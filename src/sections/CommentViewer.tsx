import { Placeholder } from "../components/Placeholder";
import { Section } from "../components/Section";
import styles from "./CommentViewer.module.css";

/** 機能が多く、文字だけでは伝わらないので 1 機能 1 画像で並べる。 */
const FEATURES = [
  {
    label: "YouTube と Twitch のコメント同時取得",
    media: "YouTube と Twitch のコメントが混ざって流れている一覧",
  },
  {
    label: "一目で初見や久しぶりの視聴者がわかる UI",
    media: "初見さん・久しぶりの視聴者が色分けされているコメント一覧",
  },
  {
    label: "右クリックで気になるコメントを簡単に固定",
    media: "右クリックメニューからコメントを固定しているところ",
  },
  {
    label: "VOICEVOX と連携したコメント読み上げ",
    media: "読み上げの話者を選んでいる設定画面",
  },
  {
    label: "ワンクリックで配信画面にコメントを表示",
    media: "配信画面の上にコメントのオーバーレイが乗っている様子",
  },
  {
    label: "視聴者ごとのメモ",
    media: "視聴者にメモを書き込んでいるところ",
  },
];

/**
 * 目玉の 4 つ。上のグリッドと同じ大きさで並べると埋もれるので全幅で見せる。
 *
 * ⚠ 配信エフェクトはアプリ上は別画面（ヘッダーの「OBSエフェクト」）だが、
 * 発火はコメント取得に依存する（`EffectOverlayApp` は購読するだけで、
 * `startSession` を呼ぶのは `CommentViewerApp` だけ）。コメントビューアで接続して
 * いなければ一度も発火しないので、使う人から見た区切りに合わせてここへ置く。
 */
const HIGHLIGHTS = [
  {
    label: "コメントや投げ銭に反応する配信エフェクト",
    body: "決めた言葉が入ったコメントが来たときや、投げ銭が届いたときに、配信画面へ演出を重ねて表示できます。",
    media: "投げ銭が届いて、配信画面に演出が出るところ",
    motion: true,
  },
  {
    label: "投げ銭やコメントで回せるガチャ",
    // ⚠ 「かなり簡単」「他ツールより簡単」は名乗らない（docs/tasks/063 の決定。
    //   操作回数の総和では負けているため、名乗ってよいのは「分かりやすい」まで）。
    // ⚠ 景品の配布は配信者が手で行う。自動で届くとは書かないこと（063g の結論＝やらない）。
    body: "壁紙のプレゼント、配信中だけ語尾を変える。景品は配信者が自由に決められるので、視聴者がコメントしたくなるきっかけを用意できます。景品は1つの表に並べるだけで、当選確率は入力した重みから自動で計算されます。",
    media: "ガチャの景品と当選確率を設定している画面",
  },
  {
    label: "配信ごとのレイドや投げ銭がわかるサマリー",
    body: "誰がレイドしてくれたのか、誰が投げ銭をしてくれたのかを、配信が終わったあとに配信ごとに振り返れます。",
    media: "配信ごとのサマリー画面（レイドと投げ銭の一覧）",
  },
  {
    label: "来訪回数や投げ銭額がわかる視聴者詳細",
    body: "その視聴者が何回来てくれたのか、これまでいくら投げてくれたのか、過去にどんなコメントをくれたのかを、まとめて確認できます。",
    media: "視聴者詳細の画面（来訪回数・合計投げ銭額・過去のコメント）",
  },
];

export function CommentViewer() {
  return (
    <Section
      id="comment-viewer"
      eyebrow="内蔵コメントビューア"
      title={
        <>
          配信に必要な機能を盛り込んだ、
          <br />
          高機能コメントビューア
        </>
      }
      lead="別のツールを探して用意しなくても、配信に必要なものはこれ一つで揃います。"
      tinted
    >
      <ul className={styles.grid}>
        {FEATURES.map((feature) => (
          <li key={feature.label} className={styles.card}>
            <Placeholder label={feature.media} ratio="16 / 10" />
            <p className={styles.label}>{feature.label}</p>
          </li>
        ))}

        {/* 並び順は配信の時系列（配信中の演出・ガチャ → 配信後のサマリー → 視聴者の履歴）。 */}
        {HIGHLIGHTS.map((item, index) => (
          <li
            key={item.label}
            className={index % 2 === 1 ? styles.wideReverse : styles.wide}
          >
            <div className={styles.wideCopy}>
              <p className={styles.wideLabel}>{item.label}</p>
              <p className={styles.wideBody}>{item.body}</p>
            </div>
            <Placeholder label={item.media} ratio="16 / 10" motion={item.motion} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
