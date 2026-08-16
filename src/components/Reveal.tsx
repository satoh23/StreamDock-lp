import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Reveal.module.css";

/**
 * 画面に入ったら下からふわっと出す。
 *
 * ⚠ 初期値は必ず「隠れている」で、サーバー描画とブラウザの初回描画を一致させる
 * （ここを `true` 始まりにすると hydration が食い違う）。
 *
 * ⚠ 隠す指定は CSS 側で `html.js` の中だけに効かせている。JavaScript が読み込め
 * なかった場合は class が付かず、**最初から見えたまま**になる（真っ白なページを
 * 配らないため）。
 */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 古い環境向けの保険。監視できないなら隠したままにせず、すぐ出す。
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setVisible(true);
          // 一度出したら戻さない。スクロールを往復するたびに再生されると煩わしい。
          observer.disconnect();
        }
      },
      // 画面の下端より少し内側に入ってから出す（端でちらつかせない）。
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={visible ? `${styles.reveal} ${styles.isVisible}` : styles.reveal}
    >
      {children}
    </div>
  );
}
