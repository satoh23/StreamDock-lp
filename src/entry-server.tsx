import { renderToString } from "react-dom/server";
import App from "./App";

/**
 * ビルド時に 1 回だけ呼ばれ、ページ全体を HTML 文字列にする（`scripts/prerender.mjs`）。
 *
 * ⚠ ここで描かれる HTML と、ブラウザでの初回描画は**完全に一致していないといけない**
 * （食い違うと hydration が失敗して React が全部描き直す）。
 * そのため、OS 判定・最新リリース取得・スクロール位置といった
 * 「ブラウザにしか無い情報」は必ず useEffect の中で読むこと。
 * useState の初期値に入れると、この関数と初回描画がずれる。
 */
export function render(): string {
  return renderToString(<App />);
}
