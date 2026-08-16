import type { ReactNode } from "react";
import styles from "./Section.module.css";

type Props = {
  id?: string;
  /** 見出しの上に置く小さいラベル。無くてもよい。 */
  eyebrow?: string;
  /** 改行位置を指定したいことがあるので、文字列だけでなく JSX も受ける。 */
  title: ReactNode;
  /** 見出しの下の説明文。改行を入れたいことがあるので JSX も受ける。 */
  lead?: ReactNode;
  /** 背景を一段持ち上げるか（セクションの切れ目を作りたいときだけ）。 */
  tinted?: boolean;
  children?: ReactNode;
};

export function Section({ id, eyebrow, title, lead, tinted = false, children }: Props) {
  return (
    <section id={id} className={tinted ? styles.tinted : styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2 className={styles.title}>{title}</h2>
          {lead && <p className={styles.lead}>{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
