import { DownloadButtons } from "../components/DownloadButtons";
import { Placeholder } from "../components/Placeholder";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.brand}>StreamDock</p>

          {/* ここだけ断言（体言止め寄り）。以降の本文は「です・ます」で統一する。 */}
          <h1 className={styles.title}>
            ツールが増えるほど、
            <br />
            管理が楽になる。
          </h1>

          {/* ⚠ ここでは製品用語（プリセットなど）を使わない。
              アプリを触ったことがない人が最初に読む行なので、
              仕組みの名前ではなく「何が起きるか」だけを書く。 */}
          <div className={styles.leadBlock}>
            <p className={styles.intro}>
              StreamDock は、配信者向けのツール管理アプリです。
            </p>
            <p className={styles.lead}>
              使うツールが 10 個でも 100 個でも、ワンクリックで準備完了。
              すぐに配信を始められます。
            </p>
          </div>

          <DownloadButtons />
        </div>

        <div className={styles.visual}>
          <Placeholder
            label="プリセット一覧の画面（起動ボタンが見えている状態）"
            ratio="16 / 10"
          />
        </div>
      </div>
    </header>
  );
}
