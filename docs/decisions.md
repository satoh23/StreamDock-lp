# Decisions

このリポジトリ（ランディングページ）の設計判断を、**理由つきで**残す。
結果だけ書かないこと。半年後の自分と、初めて読む人が「なぜそうしたか」を追えるようにする。

---

## 2026-09-06 デプロイ先を Cloudflare Workers（静的アセット）にする

### 決めたこと

ランディングページを **Cloudflare Workers の静的アセット**で配信する。
Cloudflare Pages ではない（理由は後述）。

### 前提：このサイトが要求するもの

判断の前に、まず自分のサイトが何を必要としているかを実測した。

| | 値 |
| --- | --- |
| 1 訪問あたりの転送量（最後までスクロール・ライト・Chrome） | **2.59 MB** |
| ファイル数 | 46 |
| 最大の 1 ファイル | 0.31 MB |
| うち動画（webm + mp4、ライト・ダーク両方） | 2.77 MB |
| サーバー処理 | **無し**（`scripts/prerender.mjs` がビルド時に HTML を作る） |

⇒ **サーバーが要らないので、選定は「転送量」と「規約」の 2 点でほぼ決まる。**
1 訪問 2.59 MB は静的サイトとしては重い部類で、**無料枠の転送量制限が現実に効いてくる規模**。

### 決め手 1：商用利用の可否

FAQ に「今後、追加機能を有料にする可能性があります」と書いている。
**有料化した時点で、この LP は「製品の販売の宣伝」になる。**

- **Vercel Hobby は使えない。** 規約が「Hobby は非商用の個人利用のみ」と定め、商用利用の例に
  *Advertising the sale of a product or service* を明示している（寄付の募集も商用に含む）。
- **GitHub Pages も使えない。** 「オンラインビジネスの運営や、商取引を主目的とするサイトの
  無料ホスティングとしての利用は認めない」と明記されている。
- Cloudflare と Netlify にはこの種の制限が無い。

⚠ **この 2 社は転送量を比べる前に候補から外れる。** 順番を逆にしないこと。

### 決め手 2：転送量の課金

| | 無料枠 | 2.59 MB/訪問 で換算 | 超過したら |
| --- | --- | --- | --- |
| **Cloudflare Workers（静的アセット）** | 「静的アセットへのリクエストは無料かつ無制限」「データ転送・帯域に追加料金なし」 | **上限なし** | — |
| Cloudflare Pages | 転送量の課金メーター無し | 上限なし | — |
| Netlify | ⚠ **クレジット制**（300/月・転送 20cr/GB・本番デプロイ 15cr） | 本番デプロイ 10 回で残り 7.5GB ＝ **約 2,900 訪問/月** | ⚠ **月末までサイト停止** |

⚠ **Netlify は 2025 年 9 月以降クレジット制に変わり、2026 年 4 月にさらに単価が上がっている。**
「Netlify は 100GB 無料」は**もう古い情報**。動画を持つこのサイトには合わない。
告知した週に 3,000 人来ると、その月は落ちたままになる。

⇒ **残るのは Cloudflare だけ。**

### なぜ Pages ではなく Workers か

⚠ **Cloudflare 自身が、新規プロジェクトには Pages ではなく Workers（静的アセット）を推奨している。**
Pages は廃止されず強制移行も無いが、公式の案内は「greenfield なら Workers から始めよ、
既に動いている Pages はそのままでよい」。

このプロジェクトは **まだ 1 度もデプロイしていない＝ちょうど greenfield** なので、
移行コストがゼロのいま推奨側に合わせる。必要なものは Workers でも揃っている。

- `_headers` ファイル対応（`scripts/prerender.mjs` が生成する CSP がそのまま効く）
- Git 連携で `main` への push 時に自動デプロイ
- 静的アセットは無料・無制限

失うのは「設定ファイルなしで GUI だけで完結する」手軽さで、代わりに `wrangler.jsonc` を 1 つ持つ。
得るのは、**将来この LP に動的な処理が要ったときに移行が発生しないこと。**

### 動画を置くことについて

Cloudflare には非 HTML コンテンツの配信制限（旧 2.8 条）がある。現在は CDN 個別の規約に移り、

> 顧客は Stream / Images / R2 のような **Cloudflare のサービスがホストしている**限り、
> CDN で動画や大きなファイルを配信してよい。**Cloudflare の外**でホストされた動画や
> 大きなファイルは引き続き CDN 上で制限される。

Workers の静的アセットは **Cloudflare 自身がホストしている**ので、この制限には当たらないと判断した。
⚠ 2.77 MB の動画を置いている以上、ここは意識しておく論点。
将来もっと長い動画を載せるなら、Stream か R2 へ移すことを検討する。

### 諦めたこと・引き受けたリスク

- **Cloudflare 1 社に依存する。** ただし成果物は素の静的ファイル 46 個なので、
  他社へ移すのはビルド出力を置き換えるだけ（独自ドメインの張り替えを除けば数十分）。
- **`wrangler.jsonc` という設定ファイルが 1 つ増える。** Pages なら不要だった。
- **無料枠の条件は変わる。** 特に Netlify は 1 年で 2 回変えている。
  ⚠ **この判断は 2026-09-06 時点の条件に基づく。** 再検討するときは各社の公式ページを見直すこと。

### 出典（すべて 2026-09-06 に確認）

- [Cloudflare Workers 料金](https://developers.cloudflare.com/workers/platform/pricing/) — 静的アセットは無料・無制限、帯域課金なし
- [Cloudflare Pages 制限](https://developers.cloudflare.com/pages/platform/limits/) — 500 ビルド/月・2 万ファイル・25 MiB/ファイル
- [Pages から Workers への移行ガイド](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)
- [Workers 静的アセットの `_headers`](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Cloudflare 利用規約の更新（旧 2.8 条の行方）](https://blog.cloudflare.com/updated-tos)
- [Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines) — Hobby は非商用のみ
- [Netlify 料金](https://www.netlify.com/pricing/) — 無料は 300 クレジット/月
- [GitHub Pages の利用制限](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) — 商用サイトは対象外
