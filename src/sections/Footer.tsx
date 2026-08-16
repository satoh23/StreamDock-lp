import { RELEASES_PAGE_URL } from "../hooks/useLatestRelease";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <p className={styles.brand}>StreamDock</p>
          <p className={styles.tagline}>
            配信で使うツールをまとめて起動・停止できるデスクトップアプリ
          </p>
        </div>

        <nav className={styles.nav}>
          <a className={styles.link} href="#problem">
            できること
          </a>
          <a className={styles.link} href="#start">
            導入の流れ
          </a>
          <a className={styles.link} href="#faq">
            よくある質問
          </a>
          <a className={styles.link} href={RELEASES_PAGE_URL}>
            過去のバージョン
          </a>
        </nav>
      </div>

      <div className={styles.legal}>
        <p>
          OBS Studio / VOICEVOX / YouTube / Twitch
          は各提供元の商標です。StreamDock はこれらと連携する機能を持ちますが、各提供元と公式に提携しているものではありません。
        </p>
      </div>
    </footer>
  );
}
