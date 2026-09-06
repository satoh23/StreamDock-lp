import { useEffect, useState } from "react";

/** 配布物が置かれている public リポジトリ。アプリ本体のソースとは別。 */
const RELEASES_REPO = "satoh23/StreamDock-releases";

/** 取得に失敗したときの逃げ先。ここは常に存在する（リリースが 0 件でもページは開く）。 */
export const RELEASES_PAGE_URL = `https://github.com/${RELEASES_REPO}/releases`;

const API_URL = `https://api.github.com/repos/${RELEASES_REPO}/releases/latest`;

/**
 * 応答が返ってこないまま待ち続けない。
 * 落ちる（エラー応答）場合と違い、**ハングは自分では終わらない**ので上限を切る。
 */
const REQUEST_TIMEOUT_MS = 8000;

export type LatestRelease = {
  /** "loading" の間はボタンを押せる状態にしておき、URL だけ後から差し替える。 */
  status: "loading" | "ready" | "fallback";
  /** 表示用のバージョン文字列（例 "v0.1.0"）。取れなければ null。 */
  version: string | null;
  macUrl: string;
  windowsUrl: string;
};

type ReleaseAsset = {
  name?: string;
  browser_download_url?: string;
};

type ReleaseResponse = {
  tag_name?: string;
  assets?: ReleaseAsset[];
};

/**
 * 取得した URL が「この配布リポジトリの Releases 直下」を指しているかを確かめる。
 *
 * ⚠⚠ **ここを外すと、GitHub API の応答をそのまま `href` にすることになる。**
 * 応答は HTTPS で来るが、**LP 側でホストを縛らない限り、任意のホストのファイルを
 * ダウンロードさせる形が残る**（2026-09-06 の実測: React 19 は `javascript:` こそ
 * 無効化するが、`https://evil.example.com/StreamDock.dmg` は素通りで `href` に入る）。
 * ダウンロードボタンは配布物の入口なので、**一致しなければ Releases ページへ落とす**
 * （怪しいものを渡さない側に倒す）。
 *
 * ⚠ 文字列の前方一致だけで判定しないこと。`https://github.com.evil.com/...` のような
 * 形を延々と考える羽目になる。`new URL()` で正規化してから `origin` を見る。
 *
 * ⚠ これで防げないものが 1 つある。**配布リポジトリをリネームすると名前空間が空き、
 * 他人が同じ名前を取れる**（その場合ホストは github.com のままなのでここは通る）。
 * 対策はコードではなく「リネームしない」と「チェックサムを併記する」。
 */
const isTrustedAssetUrl = (url: string): boolean => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  return (
    parsed.origin === "https://github.com" &&
    parsed.pathname.startsWith(`/${RELEASES_REPO}/releases/download/`)
  );
};

/** updater 専用の成果物。人がダウンロードするものではないので候補から外す。 */
const isUpdaterAsset = (name: string) =>
  name.endsWith(".sig") || name.endsWith(".app.tar.gz") || name === "latest.json";

/**
 * 拡張子に合う配布物をちょうど 1 つだけ選ぶ。
 *
 * ⚠ **0 個のときも 2 個以上のときも `null` を返す（fail-closed）。**
 * 以前は「最初に一致したもの」を採っていたが、それだと Windows arm64 を足した瞬間に
 * 「どちらが渡るかは GitHub が返す順序次第」になる。どれを渡すべきか機械で決められない
 * なら、一覧ページへ送って人に選ばせるほうが安全。
 * 本体 CI の `make-latest-json.mjs` の `requireOne` と同じ考え方で揃えてある。
 */
const pickAsset = (assets: ReleaseAsset[], extension: string): string | null => {
  const hits: string[] = [];

  for (const asset of assets) {
    const { name, browser_download_url: url } = asset ?? {};
    if (typeof name !== "string" || typeof url !== "string") continue;
    if (isUpdaterAsset(name)) continue;
    if (!name.toLowerCase().endsWith(extension)) continue;
    if (!isTrustedAssetUrl(url)) continue;
    hits.push(url);
  }

  return hits.length === 1 ? hits[0] : null;
};

/**
 * 表示用のバージョン。
 * ⚠ React が中身をエスケープするので XSS にはならないが、長さは誰も見ていない。
 * 見慣れない形や異常に長い値をそのまま描くとレイアウトが壊れるので、形で弾く。
 */
const pickVersion = (value: unknown): string | null =>
  typeof value === "string" && /^v?\d[\w.+-]{0,29}$/.test(value) ? value : null;

const FALLBACK: LatestRelease = {
  status: "fallback",
  version: null,
  macUrl: RELEASES_PAGE_URL,
  windowsUrl: RELEASES_PAGE_URL,
};

/**
 * 最新リリースの .dmg / .exe への直リンクを取得する。
 *
 * ⚠ 失敗しても例外を投げず、必ず Releases ページへのリンクに落とす。
 * リリースがまだ 1 件も公開されていない場合・API のレート制限に当たった場合・
 * オフラインの場合のいずれでも、ボタンは押せる状態のままにする。
 */
const fetchLatestRelease = async (): Promise<LatestRelease> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) return FALLBACK;

    const data = (await response.json()) as ReleaseResponse;
    const assets = Array.isArray(data.assets) ? data.assets : [];

    return {
      status: "ready",
      version: pickVersion(data.tag_name),
      macUrl: pickAsset(assets, ".dmg") ?? RELEASES_PAGE_URL,
      windowsUrl: pickAsset(assets, ".exe") ?? RELEASES_PAGE_URL,
    };
  } catch {
    // 通信断・タイムアウト・JSON が壊れている、のいずれでも同じ扱いでよい。
    return FALLBACK;
  } finally {
    clearTimeout(timer);
  }
};

/**
 * ページ全体で 1 回だけ取りに行くための共有結果。
 *
 * ⚠⚠ これが無いと **1 表示で 3 回**リクエストする（Hero と 導入の流れ の
 * `DownloadButtons`、それに `FloatingDownload` が別々に呼ぶため。2026-09-06 に実測）。
 * 未認証の GitHub API は **60 リクエスト/時/IP** なので、同一 IP から 20 回表示した
 * 時点で以降 1 時間すべてのボタンが Releases ページ送りに退化する。
 * 共有 NAT（会社・学校・モバイル回線）や告知直後に、**一番人が来ている瞬間に**効く。
 */
let shared: Promise<LatestRelease> | null = null;

export function useLatestRelease(): LatestRelease {
  const [release, setRelease] = useState<LatestRelease>({
    ...FALLBACK,
    status: "loading",
  });

  useEffect(() => {
    // ⚠ 描画が差し替わっても取得は中断しない（他の呼び出し元がまだ待っている）。
    //   代わりに「この呼び出し元がまだ生きているか」だけを見る。
    let active = true;

    if (!shared) shared = fetchLatestRelease();
    shared
      .then((result) => {
        if (active) setRelease(result);
      })
      .catch(() => {
        if (active) setRelease(FALLBACK);
      });

    return () => {
      active = false;
    };
  }, []);

  return release;
}
