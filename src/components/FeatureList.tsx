import styles from "./FeatureList.module.css";

type Props = {
  items: string[];
  /** 2 列に並べるか（項目が多いセクション用）。 */
  columns?: boolean;
};

export function FeatureList({ items, columns = false }: Props) {
  return (
    <ul className={columns ? styles.columns : styles.list}>
      {items.map((item) => (
        <li key={item} className={styles.item}>
          <span className={styles.mark} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
