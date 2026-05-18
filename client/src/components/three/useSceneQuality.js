import { useEffect, useState } from "react";

function readScenePreferences() {
  if (typeof window === "undefined") {
    return {
      isCompact: false,
      isTouch: false,
      reducedMotion: false,
    };
  }

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const saveData = Boolean(navigator.connection?.saveData);

  return {
    isCompact: isTouch || isSmallScreen || reducedMotion || saveData,
    isTouch,
    reducedMotion,
  };
}

function bindMediaQuery(queryList, handler) {
  if (queryList.addEventListener) {
    queryList.addEventListener("change", handler);
    return () => queryList.removeEventListener("change", handler);
  }

  queryList.addListener(handler);
  return () => queryList.removeListener(handler);
}

export function useSceneQuality() {
  const [preferences, setPreferences] = useState(() => readScenePreferences());

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const queries = [
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(max-width: 768px)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];

    const update = () => setPreferences(readScenePreferences());
    const cleanups = queries.map((queryList) =>
      bindMediaQuery(queryList, update),
    );

    update();

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return {
    ...preferences,
    canvasDpr: preferences.isCompact ? 1 : [1, 1.5],
    isLowPower: preferences.isCompact,
  };
}
