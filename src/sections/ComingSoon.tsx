import { Section } from "../components/Section";
import styles from "./ComingSoon.module.css";
import { Sentences } from "../components/Sentences";

/** 追加したら `badge` を外して、通常の機能セクションへ移すこと。 */
const UPCOMING = [
  {
    badge: "近日公開",
    title: "やりたいことから、使えるツールを探せます",
    body: "「コメントを読み上げたい」「視聴者に通知を出したい」といったやりたいことから、それができるツールを見つけられるようにします。",
  },
  {
    badge: "近日公開",
    title: "見つけたツールを、簡単に導入できます",
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
          ツールを探すところ、導入するところも
          <br />
          引き受けていきます。
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
