import { Section } from "../components/Section";
import styles from "./Privacy.module.css";

/** 見出しだけで意味が通る短さにすること（本文は読まれない前提で並べている）。 */
const POINTS = [
  {
    label: "アカウント登録なし",
    body: "メールアドレスもパスワードも要りません。ダウンロードすればすぐ使えます。",
  },
  {
    label: "保存先はこの PC だけ",
    body: "設定も視聴者メモも、外部のサーバーには保存しません。",
  },
  {
    label: "利用状況を集めません",
    body: "どの機能をいつ使ったかといった記録（テレメトリ）は一切取りません。",
  },
  {
    label: "通信は必要最小限",
    body: "あなたが接続した配信サービスと、アップデートの確認でのみ通信します。",
  },
];

export function Privacy() {
  return (
    <Section
      id="privacy"
      eyebrow="データの扱い"
      title="万全のプライバシー"
      lead="配信のたびに使うアプリだからこそ、外に出す情報はできるだけ少なくしています。あなたのデータは、この PC の外へ送りません。"
      tinted
    >
      <ul className={styles.points}>
        {POINTS.map((point) => (
          <li key={point.label} className={styles.point}>
            <span className={styles.check} aria-hidden="true" />
            <p className={styles.label}>{point.label}</p>
            <p className={styles.body}>{point.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
