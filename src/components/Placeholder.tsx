import styles from "./Placeholder.module.css";

type Props = {
  /** 何を撮る枠なのか（差し替える人が読む）。 */
  label: string;
  /** 推奨の縦横比。実素材はこの比率で用意する。 */
  ratio?: string;
  /** GIF / 動画を想定する枠かどうか。 */
  motion?: boolean;
};

/**
 * スクリーンショット・GIF が入る枠。
 *
 * 実素材が用意できたら、この要素ごと <img> に差し替える。
 * ⚠ 撮影時は実在の視聴者名・アイコン・コメントを写さないこと。
 */
export function Placeholder({ label, ratio = "16 / 10", motion = false }: Props) {
  return (
    <div className={styles.frame} style={{ aspectRatio: ratio }} aria-hidden="true">
      <div className={styles.inner}>
        <span className={styles.kind}>{motion ? "GIF" : "スクリーンショット"}</span>
        <span className={styles.label}>{label}</span>
        <span className={styles.ratio}>{ratio.replace(/\s/g, "")}</span>
      </div>
    </div>
  );
}
