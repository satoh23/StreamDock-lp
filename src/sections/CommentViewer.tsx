import { Placeholder } from "../components/Placeholder";
import { Screenshot } from "../components/Screenshot";
import { Section } from "../components/Section";
import styles from "./CommentViewer.module.css";

/**
 * 機能が多く、文字だけでは伝わらないので 1 機能 1 画像で並べる。
 *
 * ⚠⚠ **素材は「画面まるごと」ではなく、ラベルが約束しているものだけに切ってある。**
 * カード幅は 342px しかないので、ウィンドウ全体を入れると表示倍率が 18% 前後になり、
 * アプリの本文 13〜16px が 5px 相当まで潰れて**何も読めないただの模様**になる。
 * 切ったことで倍率は 39〜69% に上がり、どれも読める（＋ 合計 643KB → 205KB）。
 * ⚠ 目を細めて 3 枚が同じ絵に見えるなら、それは切り足りない合図。
 *
 * ⚠ 縦横比はまだ 1.46〜2.82 と揃っていないので、`frame` で 16:10 の枠に収める。
 * 中は切らないので、余った分は枠の地色になる。
 *
 * ⚠ ダーク素材はまだ無いので `dark` は付けない（置いてから true にする）。
 */
const FEATURES = [
  {
    label: "YouTube と Twitch のコメント同時取得",
    name: "cv-multi-platform",
    width: 860,
    height: 540,
    alt: "コメント一覧の一部。Twitch と YouTube のコメントが交互に並び、各行の左に配信サービスのバッジが付いている。",
  },
  {
    label: "一目で初見や久しぶりの視聴者がわかる UI",
    name: "cv-first-time",
    width: 590,
    height: 404,
    alt: "コメント一覧の一部。各行の名前の左に「初見」バッジが付いていて、初めて来た視聴者がひと目でわかる。",
  },
  {
    label: "右クリックで気になるコメントを簡単に固定",
    name: "cv-pin",
    width: 440,
    height: 275,
    alt: "一覧の上に固定したコメント。「固定」バッジの付いた行が一番上にとどまり、その下では新しいコメントが流れ続けている。",
  },
  {
    label: "VOICEVOX と連携したコメント読み上げ",
    name: "cv-voicevox",
    width: 790,
    height: 280,
    alt: "読み上げの設定。読み上げる文字数の上限、話者、スタイルを選べて、その場で試聴できる。",
  },
  {
    label: "ワンクリックで配信画面にコメントを表示",
    name: "cv-overlay",
    width: 490,
    height: 310,
    alt: "配信画面に重ねたコメント。視聴者名と配信サービスのバッジが付いた吹き出しが縦に並んでいる。",
  },
  {
    label: "視聴者ごとのメモ",
    name: "cv-memo",
    width: 830,
    height: 367,
    alt: "視聴者詳細の「配信者メモ」欄。その視聴者について書き込んだメモが保存されている。",
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
    // ⚠ チャンネルポイントは「報酬」ではなく必ず「カスタム報酬」と書く。反応するのは
    //   channel.channel_points_custom_reward_redemption.add の 1 本だけで、Twitch が
    //   最初から用意している自動報酬は別の購読＝取っていない（063e 段 3-c）。
    //   語を「報酬」へ広げると、既定の報酬で試して回らない人が出る。
    // ⚠ 「ベータ」とは書かない。本体アプリの画面に一度も出てこないので、LP だけが
    //   言うと食い違う。書くなら本体の表記を戻すのが先。
    body: "壁紙のプレゼント、配信中だけ語尾を変える。景品は配信者が自由に決められるので、視聴者がコメントしたくなるきっかけを用意できます。景品は 1 つの表に並べるだけで、当選確率は入力した重みから自動で計算されます。Twitch では、チャンネルポイントのカスタム報酬でも回せます。",
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
            <Screenshot
              name={feature.name}
              width={feature.width}
              height={feature.height}
              alt={feature.alt}
              frame="16 / 10"
            />
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
