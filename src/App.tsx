import { FloatingDownload } from "./components/FloatingDownload";
import { Reveal } from "./components/Reveal";
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
          title={
            <>
              いつも使うツールを、
              <br />
              まとめて起動できます。
            </>
          }
          lead="配信用・作業用のように、用途ごとにプリセットを分けておくこともできます。"
          items={[
            "PC を起動した際、登録したツールを自動で起動することもできます",
            "まとめてでも、1つずつでも起動・停止できます",
            "アプリのほか、Web ページも登録できます",
          ]}
          media={{
            label:
              "プリセットの起動ボタンを押して、複数のツールが順番に立ち上がるところ",
            motion: true,
          }}
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
