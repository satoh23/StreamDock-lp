/**
 * ビルド時プリレンダリング。
 *
 * Vite の既定のビルドは `<div id="root"></div>` だけの HTML を出すので、
 * JavaScript を実行しないクローラーからは**中身が空のページ**に見える。
 * ここでページ全体を HTML 文字列にして埋め込み、素の HTML だけで読める状態にする。
 *
 * あわせて sitemap.xml と robots.txt、それに Cloudflare Pages の _headers を生成する
 * （sitemap / robots は絶対 URL が要るため、_headers は**インラインスクリプトの
 * ハッシュが要る**ため。どれも public/ に静的には置けない）。
 *
 * 新しい依存は入れていない。`react-dom/server` は react-dom に含まれている。
 */
import { createHash } from "node:crypto";
import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadEnv } from "vite";

const root = process.cwd();

// .env の VITE_SITE_URL を読む。末尾の / は付いていても付いていなくても動くように落とす。
const env = loadEnv("production", root, "VITE_");
const siteUrl = (env.VITE_SITE_URL ?? "").replace(/\/+$/, "");
if (!siteUrl) {
  // fail-closed。ここが空のまま進むと、絶対 URL が壊れた sitemap と OGP を配ることになる。
  throw new Error("VITE_SITE_URL が未設定です（.env を確認してください）");
}

const ssrEntry = path.join(root, "dist-ssr/entry-server.js");
const { render } = await import(pathToFileURL(ssrEntry).href);

const appHtml = render();

const indexPath = path.join(root, "dist/index.html");
const template = await readFile(indexPath, "utf8");

const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  // index.html の書き方が変わって差し込み先を見失った場合に、
  // 黙って空のページを配らないよう止める。
  throw new Error(`dist/index.html に ${marker} が見つかりません`);
}

await writeFile(indexPath, template.replace(marker, `<div id="root">${appHtml}</div>`));

await writeFile(
  path.join(root, "dist/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
  </url>
</urlset>
`,
);

await writeFile(
  path.join(root, "dist/robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`,
);

/**
 * セキュリティヘッダー（Cloudflare Pages は `dist/_headers` を読む）。
 *
 * ⚠ Cloudflare Pages は**既定で何も付けない**。置かなければ CSP も nosniff も無しで配ることになる。
 *
 * ⚠⚠ `script-src` の hash は**ビルド後の index.html から機械的に計算する**。
 * ここを手で書くと、index.html のインラインスクリプトを 1 文字直しただけで
 * **本体スクリプトが CSP に弾かれ、ヒーロー以外が真っ白になる**（Reveal が
 * opacity: 0 のまま残るため）。手で維持してよい種類の値ではない。
 */
const finalHtml = await readFile(indexPath, "utf8");

// src を持たない <script>（＝インライン）だけを拾う。JSON-LD も含めておく
// （実行されないので本来 script-src の対象外だが、含めても害は無く、判定の差で悩まない）。
const inlineScripts = [
  ...finalHtml.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g),
].map((match) => match[1]);

// fail-closed。取り出しに失敗したまま進むと、上に書いた「真っ白」を本番で踏む。
if (!inlineScripts.some((script) => script.includes("data-app-started"))) {
  throw new Error(
    "_headers: index.html のインラインスクリプトを取り出せませんでした" +
      "（CSP の hash が実物と合わなくなり、本文が表示されなくなります）",
  );
}

const scriptHashes = inlineScripts
  .map((script) => `'sha256-${createHash("sha256").update(script, "utf8").digest("base64")}'`)
  .join(" ");

const csp = [
  "default-src 'none'",
  `script-src 'self' ${scriptHashes}`,
  // ⚠ 'unsafe-inline' が要るのは **style 属性**のため（Screenshot が --frame と
  //   --zoom-width を React の style プロップで渡している）。style-src-attr で分離する手も
  //   あるが、対応していないブラウザは style-src へ落ちてきて属性ごと弾かれるので採らない。
  //   このページには入力欄が 1 つも無く、外部由来の文字列を CSS へ流す経路も無いので許容する。
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "media-src 'self'",
  "font-src 'self'",
  // 最新リリースの取得先。ここだけ開ける。
  "connect-src https://api.github.com",
  // ⚠ base-uri を閉じるのは重要。<base> を 1 つ差し込まれるだけで、
  //   ページ内の相対 URL がまとめて別ホストへ向く。
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

await writeFile(
  path.join(root, "dist/_headers"),
  `# ⚠ 自動生成（scripts/prerender.mjs）。直接編集しないこと。
# script-src の hash は index.html のインラインスクリプトから毎ビルド計算している。
/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
`,
);

// SSR 用のビルド成果物は配布物ではないので消す。
await rm(path.join(root, "dist-ssr"), { recursive: true, force: true });

console.log(`prerender: 本文 ${appHtml.length} 文字を dist/index.html へ埋め込みました`);
console.log(`prerender: sitemap.xml / robots.txt を ${siteUrl} で生成しました`);
console.log(`prerender: _headers を生成しました（CSP の script hash ${inlineScripts.length} 件）`);
