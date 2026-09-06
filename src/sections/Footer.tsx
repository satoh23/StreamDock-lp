import { RELEASES_PAGE_URL } from "../hooks/useLatestRelease";
import styles from "./Footer.module.css";
import { Sentences } from "../components/Sentences";

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
          {/* ⚠ #problem は「よくある悩み」なので、ここから飛ばさない。
              できること＝機能の説明が始まる最初のセクションへ送る。 */}
          <a className={styles.link} href="#presets">
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

      {/* ⚠ VOICEVOX の利用規約は「VOICEVOX を利用したことがわかるクレジット表記」を
          求めている（https://voicevox.hiroshiba.jp/term/）。この 1 行を消さないこと。
          ⚠ 商標の注記は個別列挙ではなく包括表記にしてある。スクリーンショットに
          写るアプリが増えても書き換え漏れが起きないため。 */}
      <div className={styles.legal}>
        <p>読み上げ機能は、音声合成ソフトウェア VOICEVOX と連携します。</p>
        <p>
          <Sentences text="本ページに記載・表示されている会社名・製品名・ロゴは、各提供元の商標または登録商標です。StreamDock はこれらと連携する機能を持ちますが、各提供元と公式に提携しているものではありません。" />
        </p>
      </div>
    </footer>
  );
}
