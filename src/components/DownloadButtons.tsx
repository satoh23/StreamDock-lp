import { useLatestRelease } from "../hooks/useLatestRelease";
import { useOS } from "../hooks/useOS";
import styles from "./DownloadButtons.module.css";

type Props = {
  /** 補足行（無料 / 登録不要 / バージョン）を出すか。ページ内で 1 回だけ出す。 */
  showMeta?: boolean;
};

export function DownloadButtons({ showMeta = true }: Props) {
  const os = useOS();
  const release = useLatestRelease();

  const buttons = [
    { key: "mac", label: "macOS 版をダウンロード", href: release.macUrl },
    { key: "windows", label: "Windows 版をダウンロード", href: release.windowsUrl },
  ] as const;

  // 推定できた OS を先頭かつ主ボタンにする。推定できなければ両方を同じ扱いにする。
  const ordered = os === "windows" ? [buttons[1], buttons[0]] : buttons;

  return (
    <div className={styles.wrap}>
      <div className={styles.buttons}>
        {ordered.map((button, index) => (
          <a
            key={button.key}
            className={os !== "unknown" && index === 0 ? styles.primary : styles.secondary}
            href={button.href}
          >
            {button.label}
          </a>
        ))}
      </div>

      {showMeta && (
        <p className={styles.meta}>
          基本無料 / アカウント登録不要 / macOS・Windows 対応
          {release.version && <span className={styles.version}>{release.version}</span>}
        </p>
      )}
    </div>
  );
}
