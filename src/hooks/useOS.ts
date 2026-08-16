import { useEffect, useState } from "react";

export type DetectedOS = "mac" | "windows" | "unknown";

/**
 * 閲覧中の OS を推定して、該当するダウンロードボタンを主ボタンにする。
 *
 * ⚠ 推定を外しても困らない作りにすること（もう一方のボタンも必ず並べて出す）。
 * User-Agent は偽装も省略もされうるので、外れた前提で設計する。
 */
export function useOS(): DetectedOS {
  // SSR は無いが、初期描画は「不明」から始めて hydration 差を作らない。
  const [os, setOS] = useState<DetectedOS>("unknown");

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/Mac|iPhone|iPad|iPod/i.test(ua)) {
      setOS("mac");
    } else if (/Win/i.test(ua)) {
      setOS("windows");
    }
  }, []);

  return os;
}
