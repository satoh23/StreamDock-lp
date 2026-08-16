/**
 * OGP 用のシェアカード（public/og.png・1200×630）を生成する。
 *
 * X / Discord / LINE に貼ったときに出る画像。**タイムライン上での専有面積を決める**ので、
 * 拡散が主な流入経路ならページ本体より効く。
 *
 * 画像編集ソフトを使わず、HTML を headless Chrome で撮って PNG にしている。理由は 3 つ:
 *   - 文字が画像ではなく実際のテキストとして描かれるので、拡大しても潰れない
 *   - LP と同じ CSS 変数の値をそのまま使えるので、配色がずれない
 *   - 文言を直したいとき、このファイルを編集して再実行するだけで作り直せる
 *
 * 実行: pnpm build:og
 * ⚠ 生成物 public/og.png は**コミットする**（ビルドのたびに走らせない。
 *   Chrome に依存するので CI では動かないことがある）。
 */
import { readFile, writeFile, rm, mkdtemp } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import path from "node:path";

const run = promisify(execFile);
const root = process.cwd();

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = path.join(root, "public/og.png");

const iconBase64 = (await readFile(path.join(root, "scripts/og/icon.png"))).toString("base64");

/**
 * ⚠ 色は LP の src/styles/tokens.css のダーク値と同じものを直接書いている。
 * トークンを変えたときは、ここも合わせて変えて作り直すこと（自動では追従しない）。
 */
const html = `<!doctype html>
<html lang="ja">
<head><meta charset="utf-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1200px;
    height: 630px;
    background: #090d18;
    font-family: "Hiragino Sans", "Noto Sans JP", -apple-system, sans-serif;
    color: #f9fafb;
    overflow: hidden;
    position: relative;
  }

  /* ヒーローと同じ、左上から差す淡いシアンの光。 */
  .glow {
    position: absolute;
    left: -180px;
    top: -260px;
    width: 900px;
    height: 780px;
    background: radial-gradient(closest-side, rgba(34, 211, 238, 0.22), transparent 70%);
  }
  .glow2 {
    position: absolute;
    right: -220px;
    bottom: -300px;
    width: 820px;
    height: 760px;
    background: radial-gradient(closest-side, rgba(167, 139, 250, 0.18), transparent 70%);
  }

  /* 上端のグラデ罫。アプリの「一括起動」ボタンと同じ cyan→purple。 */
  .rule {
    position: absolute;
    inset: 0 0 auto;
    height: 8px;
    background: linear-gradient(90deg, #22d3ee, #a78bfa);
  }

  .stage {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 64px;
    padding: 0 84px;
  }

  .icon {
    width: 248px;
    height: 248px;
    flex: none;
    border-radius: 56px;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.12),
      0 40px 90px rgba(5, 7, 13, 0.75),
      0 0 90px rgba(34, 211, 238, 0.22);
  }

  .copy { display: flex; flex-direction: column; gap: 20px; min-width: 0; }

  .brand {
    font-size: 30px;
    font-weight: 800;
    letter-spacing: 0.22em;
    color: #22d3ee;
  }

  .headline {
    font-size: 62px;
    font-weight: 800;
    line-height: 1.32;
    letter-spacing: 0.01em;
  }

  .sub {
    font-size: 25px;
    line-height: 1.6;
    color: #9ca3af;
  }

  .chips { display: flex; gap: 12px; margin-top: 6px; }

  .chip {
    padding: 10px 20px;
    border-radius: 999px;
    border: 1px solid rgba(249, 250, 251, 0.16);
    background: rgba(249, 250, 251, 0.06);
    font-size: 20px;
    font-weight: 700;
    color: #f9fafb;
  }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="glow2"></div>
  <div class="rule"></div>

  <div class="stage">
    <img class="icon" src="data:image/png;base64,${iconBase64}" alt="" />

    <div class="copy">
      <p class="brand">STREAMDOCK</p>
      <h1 class="headline">ツールが増えるほど、<br />管理が楽になる。</h1>
      <p class="sub">配信で使うツールを、まとめて起動・停止できるアプリ</p>
      <div class="chips">
        <span class="chip">macOS / Windows</span>
        <span class="chip">基本無料</span>
        <span class="chip">コメントビューア内蔵</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

const workDir = await mkdtemp(path.join(tmpdir(), "streamdock-og-"));
const htmlPath = path.join(workDir, "og.html");
await writeFile(htmlPath, html);

await run(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--window-size=1200,630",
  // フォントと画像の読み込みを待つ。短すぎると文字が抜けた状態で撮れる。
  "--virtual-time-budget=3000",
  `--screenshot=${OUT}`,
  `file://${htmlPath}`,
]);

await rm(workDir, { recursive: true, force: true });

console.log(`build:og: ${path.relative(root, OUT)} を生成しました（1200×630）`);
