import { useEffect, useRef, useState } from "react";
import { useLatestRelease } from "../hooks/useLatestRelease";
import { useOS } from "../hooks/useOS";
import styles from "./FloatingDownload.module.css";

/** ヒーローのダウンロードボタンが画面から外れたあたりで出す。 */
const SHOW_AFTER_PX = 520;

const OPTIONS = [
  {
    key: "mac",
    label: "macOS 版",
    meta: "Intel / Apple Silicon 対応（.dmg）",
  },
  {
    key: "windows",
    label: "Windows 版",
    meta: "Windows 10 / 11・64bit（.exe）",
  },
] as const;

export function FloatingDownload() {
  const os = useOS();
  const release = useLatestRelease();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const href = (key: (typeof OPTIONS)[number]["key"]) =>
    key === "mac" ? release.macUrl : release.windowsUrl;

  // 推定できた OS を上に出す。推定できなければ macOS を上にする（順序を固定する）。
  const ordered = os === "windows" ? [OPTIONS[1], OPTIONS[0]] : OPTIONS;

  return (
    <>
      <button
        type="button"
        className={visible ? styles.fabVisible : styles.fab}
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        // 隠れている間はフォーカス順からも外す（見えないボタンに Tab で入らないように）。
        tabIndex={visible ? 0 : -1}
        aria-hidden={visible ? undefined : true}
      >
        <DownloadIcon />
        ダウンロード
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="floating-download-title"
        // 背景（::backdrop）のクリックで閉じる。dialog 自身が押されたときだけ反応する。
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        <div className={styles.panel}>
          <div className={styles.head}>
            <h2 id="floating-download-title" className={styles.title}>
              お使いの OS を選んでください
            </h2>
            <button
              type="button"
              className={styles.close}
              onClick={() => dialogRef.current?.close()}
              aria-label="閉じる"
            >
              ×
            </button>
          </div>

          <div className={styles.options}>
            {ordered.map((option) => (
              <a
                key={option.key}
                className={styles.option}
                href={href(option.key)}
                onClick={() => dialogRef.current?.close()}
              >
                <span className={styles.optionMain}>
                  <span className={styles.optionLabel}>
                    {option.label}
                    {os !== "unknown" && option.key === os && (
                      <span className={styles.badge}>おすすめ</span>
                    )}
                  </span>
                  <span className={styles.optionMeta}>{option.meta}</span>
                </span>
                <span className={styles.optionArrow} aria-hidden="true" />
              </a>
            ))}
          </div>

          <p className={styles.note}>
            {release.status === "fallback"
              ? "最新版の情報を取得できませんでした。ダウンロード一覧のページが開きます。"
              : "基本無料でお使いいただけます。アカウントの登録は必要ありません。"}
            {release.version && (
              <span className={styles.version}>最新版 {release.version}</span>
            )}
          </p>
        </div>
      </dialog>
    </>
  );
}

/** ダウンロードアイコン。外部アセットを増やさないためインライン SVG で描く。 */
function DownloadIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 1.8v8.4" />
      <path d="M4.4 6.8 8 10.4l3.6-3.6" />
      <path d="M2.4 12.6v1.6h11.2v-1.6" />
    </svg>
  );
}
