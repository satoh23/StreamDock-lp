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
  //
  // ⚠⚠ **後方参照（`split(/(?<=。)/)`）を使わないこと。** Safari 16.4 で入った機能で、
  //   16.0〜16.3 では正規表現リテラルが**パース時に**構文エラーになる
  //   ＝このバンドルが 1 行も実行されない。そうなると index.html が付けた `html.js` だけが
  //   残り、Reveal が opacity: 0 のままヒーロー以外が全部消える（2026-09-06 に実測）。
  //   Vite の既定ターゲットは `safari16` を含むのに、esbuild は警告も出さない
  //   （後方参照は原理的に古い構文へ落とせないため）。
  const parts = text
    .split("。")
    // 切り離した「。」を戻す。最後の断片の後ろには元から無い。
    .map((part, index, all) => (index < all.length - 1 ? `${part}。` : part))
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <>
      {parts.map((part, index) => (
        // ⚠ key に本文を使わない。同じ文が 2 回出ると衝突して片方が消える。
        //   並び替えも増減も起きない配列なので index でよい。
        <Fragment key={index}>
          {index > 0 && <br />}
          {part}
        </Fragment>
      ))}
    </>
  );
}
