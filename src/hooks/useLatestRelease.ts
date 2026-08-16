import { useEffect, useState } from "react";

/** 配布物が置かれている public リポジトリ。アプリ本体のソースとは別。 */
const RELEASES_REPO = "satoh23/StreamDock-releases";

/** 取得に失敗したときの逃げ先。ここは常に存在する（リリースが 0 件でもページは開く）。 */
export const RELEASES_PAGE_URL = `https://github.com/${RELEASES_REPO}/releases`;

const API_URL = `https://api.github.com/repos/${RELEASES_REPO}/releases/latest`;

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

/** updater 専用の成果物。人がダウンロードするものではないので候補から外す。 */
const isUpdaterAsset = (name: string) =>
  name.endsWith(".sig") || name.endsWith(".app.tar.gz") || name === "latest.json";

const pickAsset = (assets: ReleaseAsset[], extension: string): string | null => {
  for (const asset of assets) {
    const { name, browser_download_url: url } = asset ?? {};
    if (typeof name !== "string" || typeof url !== "string") continue;
    if (isUpdaterAsset(name)) continue;
    if (name.toLowerCase().endsWith(extension)) return url;
  }
  return null;
};

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
export function useLatestRelease(): LatestRelease {
  const [release, setRelease] = useState<LatestRelease>({
    ...FALLBACK,
    status: "loading",
  });

  useEffect(() => {
    const controller = new AbortController();

    fetch(API_URL, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub API responded ${response.status}`);
        return response.json() as Promise<ReleaseResponse>;
      })
      .then((data) => {
        const assets = Array.isArray(data.assets) ? data.assets : [];
        const macUrl = pickAsset(assets, ".dmg");
        const windowsUrl = pickAsset(assets, ".exe");

        setRelease({
          status: "ready",
          version: typeof data.tag_name === "string" ? data.tag_name : null,
          macUrl: macUrl ?? RELEASES_PAGE_URL,
          windowsUrl: windowsUrl ?? RELEASES_PAGE_URL,
        });
      })
      .catch(() => {
        // abort は「別の描画に置き換わった」だけなので、状態を触らない。
        if (controller.signal.aborted) return;
        setRelease(FALLBACK);
      });

    return () => controller.abort();
  }, []);

  return release;
}
