# streamdock-lp

> デスクトップアプリ **StreamDock** のランディングページ

公開URL: https://streamdock-lp.streamdock-support.workers.dev
本体アプリ: [satoh23/StreamDock](https://github.com/satoh23/StreamDock)（開発の背景・プロダクトストーリーはそちら）

## 技術スタック

- Frontend: React + TypeScript (Vite)
- スタイル: CSS Modules（配色トークンは StreamDock 本体の `theme.css` から移植）
- ホスティング: Cloudflare Workers（静的アセット） — 選定理由は [docs/decisions.md](docs/decisions.md)

## 特徴

- ビルド時プリレンダリング（`react-dom/server`）で本文をHTMLに焼き込み、JavaScriptを実行しないクローラーにも内容が見える（新規依存なし）
- ダウンロードボタンはGitHub Releases APIから最新版の`.dmg`/`.exe`を取得し、失敗時はReleasesページへフォールバック
- セキュリティヘッダー（CSP等）を`_headers`として毎ビルド生成

## セキュリティ面で工夫した点

- **ダウンロードリンクの検証**: GitHub Releases APIが返す`browser_download_url`を、ホスト名の前方一致ではなく`new URL()`でパースしてorigin/pathnameを照合する方式で検証している。`github.com.evil.example.com`のような前方一致すり抜けを避けるため。配布リポジトリの`releases/download/`配下を指していなければReleasesページへfail-closedでフォールバックする。ビルド後の実物に偽のAPIレスポンス（別ホスト・別リポジトリ・`javascript:`等）を実際に食わせて検証済み（[`src/hooks/useLatestRelease.ts`](src/hooks/useLatestRelease.ts)）
- **ビルド時生成のCSP**: `script-src`のハッシュ値を手で書かず、ビルド後の`index.html`から機械的に計算して`_headers`に埋め込む（[`scripts/prerender.mjs`](scripts/prerender.mjs)）。手書きで維持すると、インラインスクリプトを1文字直しただけでCSP違反になり画面が真っ白になるため。ハッシュの取り出しに失敗したらビルド自体を止める。`base-uri 'none'`で`<base>`タグ注入による相対URL乗っ取りも塞いでいる

## セットアップ

```sh
pnpm install
pnpm dev        # http://localhost:5173
```

## 検証・ビルド

```sh
pnpm typecheck
pnpm build      # typecheck + dist/ を生成（プリレンダリング込み）
```

## 運用

デプロイ手順・公開URL設定・文言ルール・画像素材の撮影/変換手順など、保守に必要な詳細は [docs/operations.md](docs/operations.md) にまとめています。
