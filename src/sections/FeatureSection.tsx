import type { ReactNode } from "react";
import { FeatureList } from "../components/FeatureList";
import styles from "./FeatureSection.module.css";
import { Sentences } from "../components/Sentences";

type Props = {
  id: string;
  eyebrow: string;
  /** 改行位置を指定したいことがあるので JSX も受ける。 */
  title: ReactNode;
  lead: string;
  items: string[];
  /** 右に置く絵。<Screenshot> を渡す。 */
  visual: ReactNode;
};

export function FeatureSection({ id, eyebrow, title, lead, items, visual }: Props) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.lead}>
            <Sentences text={lead} />
          </p>
          <FeatureList items={items} />
        </div>

        <div className={styles.visual}>{visual}</div>
      </div>
    </section>
  );
}
