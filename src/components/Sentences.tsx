import { Fragment, type ReactNode } from "react";

/**
 * 本文を「。」ごとに改行して描く。
 *
 * 日本語の段落は、句点で折らないと 1 行が長くなって目が戻る場所を見失う。
 * 文ごとに行を分けると、読み手が「いま何文目か」を意識せずに追える。
 *
 * ⚠ 使う側は素の文字列を渡すだけでよい（`<br />` を文章に埋め込まない）。
 * 文章に `<br />` を書くと、文を足したり並べ替えたりするたびに改行が壊れる。
 *
 * ⚠ 文字列以外（改行位置を自分で決めている JSX）はそのまま返す。
 * ヒーローの見出しや悩みのリード文のように、意図した位置で折っている箇所を
 * 巻き込まないため。
 */
export function Sentences({ text }: { text: ReactNode }) {
  if (typeof text !== "string") {
    return <>{text}</>;
  }

  // 「。」の後ろで切る（「。」自体は前の文に残す）。
  const parts = text
    .split(/(?<=。)/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={part}>
          {index > 0 && <br />}
          {part}
        </Fragment>
      ))}
    </>
  );
}
