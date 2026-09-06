import styles from "./FeatureList.module.css";

type Props = {
  items: string[];
};

export function FeatureList({ items }: Props) {
  return (
    <ul className={styles.list}>
      {/* ⚠ key に本文を使わない。同じ項目が 2 つ並ぶと衝突して片方が消える。
          並び替えも増減も起きない配列なので index でよい。 */}
      {items.map((item, index) => (
        <li key={index} className={styles.item}>
          <span className={styles.mark} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
