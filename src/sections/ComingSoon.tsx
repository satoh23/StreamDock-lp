import { Section } from "../components/Section";
import styles from "./ComingSoon.module.css";
import { Sentences } from "../components/Sentences";

/** 追加したら `badge` を外して、通常の機能セクションへ移すこと。 */
const UPCOMING = [
  {
    badge: "近日公開",
    title: "やりたいことから使えるツールを探せる",
    // ⚠⚠ **「AI が提案します」とは書かない**（2026-09-06 に検討して見送り）。理由は 3 つ。
    //   1. 同じページのプライバシー欄が「接続した配信サービスとアップデート確認でのみ通信します」
    //      と言っており、やりたいことの文章を外部へ送ると**ページの中で矛盾する**。
    //   2. docs/security.md の第一原則「外部通信をしない」の禁止項目そのもの（外部 API 通信・
    //      ユーザーデータの外部送信）。開けるならレビューを通して例外を 1 本足す手続きが要る。
    //   3. アカウントが無い（「メールアドレスもパスワードも要りません」）ので API キーを
    //      同梱するしかなく、抜かれる。費用も無制限に開発者へ来る。
    //   ⇒ **やりたいこと → ツールの対応表を同梱する形なら外部通信ゼロで作れる。**
    //   AI で行くなら、先に LP のプライバシー文言を直すこと（順番を逆にすると嘘になる）。
    body: "「コメントを読み上げたい」「視聴者に通知を出したい」といったやりたいことを StreamDock に相談してみてください。条件に合うツールを提案します。",
  },
  {
    badge: "近日公開",
    title: "見つけたツールを簡単に導入できる",
    body: "手順を自分で調べたり読み解いたりしなくても、StreamDock の画面から少ない操作で、そのツールを使える状態にします。",
  },
];

export function ComingSoon() {
  return (
    <Section
      id="upcoming"
      eyebrow="今後のアップデート"
      title={
        <>
          ツール検索から導入まで
          <br />
          全て StreamDock にお任せ
        </>
      }
      lead="いま対応できているのは「毎回の起動と管理」が中心です。残りの悩みも、今後のアップデートで順番に対応していきます。"
    >
      <ul className={styles.cards}>
        {UPCOMING.map((item) => (
          <li key={item.title} className={styles.card}>
            <span className={styles.badge}>{item.badge}</span>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.body}>
              <Sentences text={item.body} />
            </p>
          </li>
        ))}
      </ul>

      <p className={styles.note}>
        <Sentences text="アップデートはアプリが自動で確認します。追加された機能は、アプリの中でお知らせします。" />
      </p>
    </Section>
  );
}
