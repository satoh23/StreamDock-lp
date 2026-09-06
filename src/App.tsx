import { FloatingDownload } from "./components/FloatingDownload";
import { Reveal } from "./components/Reveal";
import { Screenshot } from "./components/Screenshot";
import { ComingSoon } from "./sections/ComingSoon";
import { CommentViewer } from "./sections/CommentViewer";
import { Faq } from "./sections/Faq";
import { FeatureSection } from "./sections/FeatureSection";
import { Footer } from "./sections/Footer";
import { GetStarted } from "./sections/GetStarted";
import { Hero } from "./sections/Hero";
import { Privacy } from "./sections/Privacy";
import { Problem } from "./sections/Problem";

export default function App() {
  return (
    <>
      {/* ヒーローは最初から見えている位置なので Reveal で包まない
          （読み込み直後にフェードインすると、表示が遅れたように見える）。 */}
      <Hero />

      <Reveal>
        <Problem />
      </Reveal>

      <Reveal>
        <FeatureSection
          id="presets"
          eyebrow="プリセット機能"
          /* ⚠ 「一元管理」の中身は**起動状況**であって、設定ファイルではない。
             StreamDock は設定を触らない（本体 docs/decisions.md「MVP では設定ファイルの
             自動バックアップ・上書きはやらない」）。見出しだけだと設定まで管理すると
             読めてしまうので、**直後のリード文で「起動状況を」と必ず限定する。** */
          title={
            <>
              いつも使うツールを
              <br />
              一元管理
            </>
          }
          lead="いつも配信で使うツールの起動状況をまとめて管理できます。一括起動や一括停止もできます。"
          items={[
            "PC を起動した際、登録したツールを自動で起動することもできます",
            /* ⚠ 一括の話はリード文で済ませてあるので、ここは「1 つずつ」だけを言う。
               両方書くと直前の文の言い直しになる。 */
            "1 つずつの起動・停止もできます",
            "配信用・作業用のように、用途ごとにプリセットを分けられます",
            "アプリのほか、Web ページも登録できます",
          ]}
          visual={
            <Screenshot
              name="presets-launch"
              width={1200}
              height={750}
              dark
              video
              alt="StreamDock で「一括起動」を押すと、プリセットに登録したコメントビューア・OBS・OneComme・VOICEVOX・視聴者管理ツールが順番に立ち上がっていく様子。"
              caption="「一括起動」を押すと、登録した順にツールが立ち上がります。いくつ起動できたかは左上に出ます。"
            />
          }
        />
      </Reveal>

      <Reveal>
        <CommentViewer />
      </Reveal>

      <Reveal>
        <ComingSoon />
      </Reveal>

      <Reveal>
        <Privacy />
      </Reveal>

      <Reveal>
        <GetStarted />
      </Reveal>

      <Reveal>
        <Faq />
      </Reveal>

      <Footer />

      <FloatingDownload />
    </>
  );
}
