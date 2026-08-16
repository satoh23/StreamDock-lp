import type { ReactNode } from "react";
import { FeatureList } from "../components/FeatureList";
import { Placeholder } from "../components/Placeholder";
import styles from "./FeatureSection.module.css";

type Props = {
  id: string;
  eyebrow: string;
  /** 改行位置を指定したいことがあるので JSX も受ける。 */
  title: ReactNode;
  lead: string;
  items: string[];
  media: { label: string; ratio?: string; motion?: boolean };
  /** 画像を左に置く（機能セクションを 2 つ並べたときに向きを交互にする）。 */
  reverse?: boolean;
};

export function FeatureSection({
  id,
  eyebrow,
  title,
  lead,
  items,
  media,
  reverse = false,
}: Props) {
  return (
    <section id={id} className={styles.section}>
      <div className={reverse ? styles.innerReverse : styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.lead}>{lead}</p>
          <FeatureList items={items} />
        </div>

        <div className={styles.visual}>
          <Placeholder label={media.label} ratio={media.ratio} motion={media.motion} />
        </div>
      </div>
    </section>
  );
}
