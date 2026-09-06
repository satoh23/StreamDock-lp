import { Section } from "../components/Section";
import styles from "./Problem.module.css";

const JOURNEY = [
  { step: "1", label: "やりたいことを思いつく" },
  { step: "2", label: "使えるツールを探す" },
  { step: "3", label: "導入する" },
  { step: "4", label: "毎回起動して管理する" },
];

const VOICES = [
  "どのツールを使えばいいのか分からない",
  "導入の手順が難しくて、途中でやめてしまった",
  "ツールを起動し直すのが面倒で、PC をつけっぱなしにしている",
];

export function Problem() {
  return (
    <Section
      id="problem"
      eyebrow="よくある悩み"
      title={
        <>
          配信をよくしようとするほど
          <br />
          ツールの管理が大変になる
        </>
      }
      /* ⚠ ここだけ「です・ます」にしないこと。読み手の頭の中の声として書いている
         共感パートなので、言い切ると説明・断定になって他人事に読める。 */
      lead={
        <>
          配信を盛り上げたい、配信環境をよくしたい。
          <br />
          そう思って新しいツールを入れるたびに、毎回立ち上げるツールが増えていく。
          <br />
          気づいたときには、配信を始めるまでが一番大変に...😱
        </>
      }
      tinted
    >
      <ol className={styles.journey}>
        {JOURNEY.map((item, index) => (
          <li
            key={item.step}
            // 1 段目「思いつく」は配信者自身がやること。2 段目以降が StreamDock の担当範囲。
            className={index > 0 ? styles.stepActive : styles.step}
          >
            <span className={styles.stepNumber}>{item.step}</span>
            <span className={styles.stepLabel}>{item.label}</span>
          </li>
        ))}
      </ol>

      {/* 吹き出しで並べる。カギ括弧は付けない（吹き出しの形が引用を示すので二重になる）。 */}
      <ul className={styles.voices}>
        {VOICES.map((voice, index) => (
          <li
            key={voice}
            className={index % 2 === 1 ? styles.voiceRight : styles.voiceLeft}
          >
            <p className={styles.bubble}>{voice}</p>
          </li>
        ))}
      </ul>

      {/* ⚠ 上の 3 つの悩みを「全て」解決すると言い切っている。
          悩みを足すときは、それに対応する機能セクションがページ内にあるか確認すること。 */}
      <p className={styles.conclusion}>
        StreamDock は、これらの悩みを
        <strong className={styles.strong}>全て解決します！</strong>
      </p>
    </Section>
  );
}
