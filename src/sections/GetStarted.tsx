import { DownloadButtons } from "../components/DownloadButtons";
import { Section } from "../components/Section";
import styles from "./GetStarted.module.css";

const STEPS = [
  {
    step: "1",
    title: "ダウンロードしてインストールする",
    body: "お使いの OS のインストーラを選んでください。macOS と Windows に対応しています。",
  },
  {
    step: "2",
    title: "よく使うツールを登録する",
    body: "アプリのほか、配信管理画面などの Web ページも登録できます。",
  },
  {
    step: "3",
    title: "プリセットにまとめて、起動する",
    body: "登録したツールをプリセットにまとめます。あとは起動ボタンを押すだけです。",
  },
];

export function GetStarted() {
  return (
    <Section
      id="start"
      eyebrow="導入の流れ"
      title="3 ステップではじめられます。"
    >
      <ol className={styles.steps}>
        {STEPS.map((item) => (
          <li key={item.step} className={styles.step}>
            <span className={styles.number}>{item.step}</span>
            <h3 className={styles.stepTitle}>{item.title}</h3>
            <p className={styles.stepBody}>{item.body}</p>
          </li>
        ))}
      </ol>

      <div className={styles.cta}>
        <DownloadButtons showMeta={false} />
      </div>
    </Section>
  );
}
