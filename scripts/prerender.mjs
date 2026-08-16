/**
 * ビルド時プリレンダリング。
 *
 * Vite の既定のビルドは `<div id="root"></div>` だけの HTML を出すので、
 * JavaScript を実行しないクローラーからは**中身が空のページ**に見える。
 * ここでページ全体を HTML 文字列にして埋め込み、素の HTML だけで読める状態にする。
 *
 * あわせて sitemap.xml と robots.txt を生成する（絶対 URL が要るので、
 * public/ に静的に置くのではなくここで作る）。
 *
 * 新しい依存は入れていない。`react-dom/server` は react-dom に含まれている。
 */
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

// SSR 用のビルド成果物は配布物ではないので消す。
await rm(path.join(root, "dist-ssr"), { recursive: true, force: true });

console.log(`prerender: 本文 ${appHtml.length} 文字を dist/index.html へ埋め込みました`);
console.log(`prerender: sitemap.xml / robots.txt を ${siteUrl} で生成しました`);
