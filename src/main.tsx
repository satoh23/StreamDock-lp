import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";

// ⚠ index.html のインラインスクリプトが「本体が走り出したか」をこの印で見ている
//   （立たなければ html.js を外して、本文が隠れたままになるのを防ぐ）。
//   ⚠⚠ **必ずこのファイルの先頭で立てること。** 下の処理が例外を投げても印は残り、
//     「バンドルはパースできて走り出した」ことだけを表す印として正しく機能する。
document.documentElement.setAttribute("data-app-started", "");

const container = document.getElementById("root");
if (!container) throw new Error("#root が見つかりません");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// ビルド後は `scripts/prerender.mjs` が本文を HTML に埋め込んであるので hydrate する
// （createRoot で描き直すと、クローラー向けに用意した HTML を捨てることになる）。
// 一方 `pnpm dev` では埋め込みが無く中身が空なので、そこで hydrate すると
// 「サーバーの HTML と食い違う」という警告が毎回出る。中身の有無で見分ける。
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
