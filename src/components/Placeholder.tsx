import styles from "./Placeholder.module.css";

type Props = {
  /** 何を撮る枠なのか（差し替える人が読む）。 */
  label: string;
  /** 推奨の縦横比。実素材はこの比率で用意する。 */
  ratio?: string;
  /** 動く素材（mp4 / webm）を想定する枠かどうか。 */
  motion?: boolean;
};

/**
 * 実素材がまだ無いところに置く枠。
 *
 * 用意できたら、この要素ごと <Screenshot> に差し替える。
 * ⚠ 動く素材に GIF は使わない（256 色制限で解像度 1/3・容量 3 倍になる）。
 *   撮り方と変換手順は README の「画像素材」を見ること。
 * ⚠ 撮影時は実在の視聴者名・アイコン・コメントを写さないこと。
 */
export function Placeholder({ label, ratio = "16 / 10", motion = false }: Props) {
  return (
    <div className={styles.frame} style={{ aspectRatio: ratio }} aria-hidden="true">
      <div className={styles.inner}>
        <span className={styles.kind}>{motion ? "動画" : "スクリーンショット"}</span>
        <span className={styles.label}>{label}</span>
        <span className={styles.ratio}>{ratio.replace(/\s/g, "")}</span>
      </div>
    </div>
  );
}
