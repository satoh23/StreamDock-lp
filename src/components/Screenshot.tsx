import { useEffect, useRef, useState } from "react";
import styles from "./Screenshot.module.css";

type Props = {
  /** public/images/ 配下のファイル名（拡張子なし）。例: "hero-preset" */
  name: string;
  /** 画像が出ないときと読み上げ環境で読まれる説明。画面の中身を文章で書く。 */
  alt: string;
  /** 元素材の実寸。入れておくと読み込み前に場所が確保され、レイアウトが飛ばない。 */
  width: number;
  height: number;
  /**
   * ダーク用（`<name>-dark.*`）を用意してあるか。
   *
   * ⚠ ファイルが無いのに true にすると、ダークモードの閲覧者に何も出なくなる。
   * ファイルを置いてから true にすること。
   */
  dark?: boolean;
  /**
   * 動く素材か。true なら `<name>.webm` / `<name>.mp4` を再生する。
   *
   * ⚠ あわせて `<name>-still.png`（＋ dark なら `<name>-dark-still.png`）も要る。
   * これは動画の poster 兼、JavaScript が無いとき・「動きを減らす」設定のときの表示。
   *
   * ⚠ GIF は使わない。同じ画から作ると **解像度 1/3・容量 3 倍**になる（256 色制限のため）。
   */
  video?: boolean;
  /** 最初の画面に入る素材なら true（遅延読み込みをやめ、優先して取りに行く）。 */
  priority?: boolean;
  /**
   * 拡大表示したときに下へ出す説明。省略すると素材だけが出る。
   * 一覧では書ききれない補足を書く場所で、`alt` とは役割が違う
   * （`alt` は見えない人のための代替、こちらは見えている人への補足）。
   */
  caption?: string;
};

/**
 * OS の設定に追従して素材を差し替えるスクリーンショット。クリックで拡大表示する。
 *
 * **静止画はすべて CSS だけで切り替える**（`<picture>` の `media`）。JavaScript を
 * 使わないので、初回描画でいきなり正しい方が出て、後から差し替わってちらつくことがない。
 *
 * **動画だけは JavaScript で選ぶ。** `<source media>` は `<video>` では当てにならず、
 * かといって 2 本置くと両方ダウンロードされるため。読み込まれるまでは静止画を出すので、
 * JavaScript が動かない環境・「動きを減らす」設定の環境でも**中身は必ず見える**
 * （プリレンダリングした HTML にも静止画のほうが入る）。
 */
export function Screenshot({
  name,
  alt,
  width,
  height,
  dark = false,
  video = false,
  priority = false,
  caption,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // 動画を再生してよいか（＝ JS が動いていて、動きを減らす設定でもない）と、
  // いまダークかどうか。どちらも初期値は false ＝ サーバーで描いた静止画と一致する。
  const [playable, setPlayable] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");

    const sync = () => {
      setPlayable(!reduced.matches);
      setIsDark(darkMode.matches);
    };
    sync();

    // ページの配色は CSS が勝手に追従するので、動画だけ取り残されないよう監視する。
    reduced.addEventListener("change", sync);
    darkMode.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      darkMode.removeEventListener("change", sync);
    };
  }, [video]);

  const suffix = dark && isDark ? "-dark" : "";
  const still = `/images/${name}${suffix}-still.png`;

  /**
   * ⚠ `<source>` は**上から順に最初に一致したものが選ばれる**。
   * 並び順を変えないこと。
   */
  const stillSources = dark
    ? [{ media: "(prefers-color-scheme: dark)", srcSet: `/images/${name}-dark-still.png` }]
    : [];

  const imageSources = dark
    ? [{ media: "(prefers-color-scheme: dark)", srcSet: `/images/${name}-dark.png` }]
    : [];

  const renderMedia = (zoom: boolean) => {
    const mediaClass = zoom ? styles.zoomMedia : styles.media;

    if (video && playable) {
      return (
        // key を変えて作り直す。src だけ差し替えても読み直さないブラウザがあるため。
        <video
          key={suffix}
          className={mediaClass}
          width={width}
          height={height}
          poster={still}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={alt}
        >
          <source src={`/images/${name}${suffix}.webm`} type="video/webm" />
          <source src={`/images/${name}${suffix}.mp4`} type="video/mp4" />
        </video>
      );
    }

    return (
      <picture className={styles.picture}>
        {(video ? stillSources : imageSources).map((source) => (
          <source key={source.media} media={source.media} srcSet={source.srcSet} />
        ))}
        <img
          className={mediaClass}
          src={video ? `/images/${name}-still.png` : `/images/${name}.png`}
          width={width}
          height={height}
          alt={alt}
          loading={priority ? undefined : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
      </picture>
    );
  };

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => dialogRef.current?.showModal()}
      >
        {renderMedia(false)}
        <span className={styles.srOnly}>{alt}（クリックで拡大）</span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={alt}
        // 背景（::backdrop）のクリックで閉じる。dialog 自身が押されたときだけ反応する。
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        <div className={styles.panel}>
          <button
            type="button"
            className={styles.close}
            onClick={() => dialogRef.current?.close()}
            aria-label="閉じる"
          >
            ×
          </button>

          {/*
            ⚠ 幅は max-width ではなく width で与えること。max-width だけだと
            .panel の justify-items: center で実寸まで縮み、拡大にならない。

            上限は viewport から決める。縦は 84vh に収めたいので、縦横比から
            幅へ換算して min() に混ぜている ＝ letterbox も歪みも出ない。
          */}
          <div
            className={styles.zoomBox}
            style={
              {
                "--zoom-width": `min(92vw, calc(84vh * ${(width / height).toFixed(4)}))`,
              } as React.CSSProperties
            }
          >
            {renderMedia(true)}
          </div>

          {caption && <p className={styles.caption}>{caption}</p>}
        </div>
      </dialog>
    </>
  );
}
