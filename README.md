# streamdock-lp

デスクトップアプリ **StreamDock** のランディングページ。

- Frontend: React + TypeScript (Vite)
- スタイル: CSS Modules（配色トークンは StreamDock 本体の `theme.css` から移植）
- ホスティング: Cloudflare Pages

本体（アプリ本体のソース）は別リポジトリ。配布物は
[`satoh23/StreamDock-releases`](https://github.com/satoh23/StreamDock-releases) の Releases に置かれる。

## セットアップ

```sh
pnpm install
```

## 開発

```sh
pnpm dev        # http://localhost:5173
pnpm typecheck  # tsc --noEmit
pnpm build      # typecheck + dist/ を生成
```

## 公開 URL の設定（⚠ デプロイ後に必ずやること）

`.env` の `VITE_SITE_URL` が、`canonical` / OGP / `sitemap.xml` の絶対 URL の元になる。
**Cloudflare Pages のサブドメインが決まったら、ここを実際の URL に直すこと。**

ここが実際の URL と食い違うと、**X や Discord に貼ったときにカードの画像が出ない**
（クローラーは `og:image` の絶対 URL を取りに行くため）。

## プリレンダリングについて

`pnpm build` は次の 3 段階で動く。

1. `vite build` … 通常のクライアント向けビルド
2. `vite build --ssr` … `src/entry-server.tsx` を Node 向けにビルド
3. `node scripts/prerender.mjs` … ページ全体を HTML 文字列にして `dist/index.html` へ埋め込み、
   `sitemap.xml` / `robots.txt` を生成

これをやらないと `<div id="root"></div>` だけの HTML が配られ、JavaScript を実行しない
クローラーからは**中身が空のページ**に見える。新しい依存は入れていない
（`react-dom/server` は react-dom に含まれている）。

⚠ **ビルド時に描く HTML と、ブラウザでの初回描画は一致していないといけない。**
OS 判定・最新リリース取得・スクロール位置のような「ブラウザにしか無い情報」は
必ず `useEffect` の中で読むこと。`useState` の初期値に入れると hydration が失敗し、
React がページ全体を描き直す（＝プリレンダリングした意味が消える）。

## デプロイ（Cloudflare Pages）

| 設定項目 | 値 |
| --- | --- |
| Framework preset | None |
| Build command | `pnpm build` |
| Build output directory | `dist` |

`main` への push で自動デプロイされる。プルリクエストにはプレビュー URL が付く。

## ダウンロードボタンについて

`src/hooks/useLatestRelease.ts` が GitHub Releases API から最新版を取得し、
macOS の `.dmg` / Windows の `.exe` へ直接リンクする。**取得に失敗した場合は
Releases ページへのリンクにフォールバック**するため、API のレート制限や
リリース未公開の状態でもページは壊れない。

リリースを公開するたびに、このリポジトリを更新する必要はない。

## 文言のルール

ページ全体で用語を揃える。混ざると同じものを指しているのか分からなくなる。

| 語 | 指すもの | 例 |
| --- | --- | --- |
| **ツール** | 配信者が StreamDock に登録して管理する対象 | 「使うツールが 10 個でも 100 個でも」 |
| **アプリ** | StreamDock 自身 | 「配信者向けのツール管理アプリです」 |

⚠ 例外は**登録できる種別を Web ページと対比する箇所だけ**。ここは「実行ファイルか
Web ページか」の区別が要点なので「アプリ」を使う（例:「アプリのほか、Web ページも登録できます」）。
⚠ 「URL」は使わない（一般の配信者にとっては「Web ページ」のほうが通じる）。

⚠ **特定の配信サービスだけの用語で、両サービスに共通する概念を指さない。**
StreamDock は YouTube と Twitch の両方に対応しているため、片方の用語を使うと
もう片方のユーザーには自分の話に読めない。

| 使わない | 使う | 理由 |
| --- | --- | --- |
| スパチャ / スーパーチャット | **投げ銭** | YouTube 固有の名称。Twitch は Bits / チアー / サブスク |

⚠ 例外は**その機能が実際に片方にしか無いとき**。「レイド」は Twitch にしかない機能なので、
言い換えずにそのまま書く。

文体は「です・ます」で統一する。ただし次の 2 箇所だけ意図的に外している
（理由は各ファイルのコメントに記載。表記統一のつもりで戻さないこと）。

- ヒーローの見出し … 断言（「ツールが増えるほど、管理が楽になる。」）
- 悩みの声セクションのリード文 … 読み手の独白として書いているため言い切らない
- コメントビューアの見出し … 体言止め（「〜高機能コメントビューア」）

## 画像素材

`src/components/Placeholder.tsx` が寸法と用途を表示する枠を描いている。
実際のスクリーンショット・GIF が用意できたら、この枠を `<img>` に差し替える。

⚠ スクリーンショットには実在の視聴者名・アイコン・コメントを写さないこと
（第三者の投稿とアイコン画像の無断利用になる）。テスト用アカウントの
ダミーコメントで撮影する。
