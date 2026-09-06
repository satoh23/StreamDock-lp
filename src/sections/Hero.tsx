import { DownloadButtons } from "../components/DownloadButtons";
import { Screenshot } from "../components/Screenshot";
import styles from "./Hero.module.css";
import { Sentences } from "../components/Sentences";

export function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.brand}>StreamDock</p>

          {/* ⚠ 見出しは**言い切り**、本文は「です・ます」（README の文言ルール）。
              ここだけの例外ではなく、ページ内の見出しは全部この形。
              ⚠ 見出しに句読点は打たない。改行が読点の代わりをする。 */}
          <h1 className={styles.title}>
            ツールが増えるほど
            <br />
            管理が楽になる
          </h1>

          {/* ⚠ ここでは製品用語（プリセットなど）を使わない。
              アプリを触ったことがない人が最初に読む行なので、
              仕組みの名前ではなく「何が起きるか」だけを書く。 */}
          <div className={styles.leadBlock}>
            <p className={styles.intro}>
              StreamDock は、配信者向けのツール管理アプリです。
            </p>
            <p className={styles.lead}>
              <Sentences text="使うツールが 10 個でも 100 個でも、ワンクリックで準備完了。すぐに配信を始められます。" />
            </p>
          </div>

          <DownloadButtons />
        </div>

        <div className={styles.visual}>
          <Screenshot
            name="hero-preset"
            width={980}
            height={612}
            dark
            priority
            alt="StreamDock のプリセット画面。「雑談配信用」というプリセットに、コメントビューア・OBS・OneComme・VOICEVOX・視聴者管理ツール・Google Chrome の 6 つが起動順に並んでいる。右上の「一括起動」ボタンでまとめて起動できる。"
          />
        </div>
      </div>
    </header>
  );
}
