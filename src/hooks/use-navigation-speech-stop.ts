"use client";
import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { manualNavigationEvent } from "@/lib/navigation-speech";

export function useNavigationSpeechStop(
  onNavigate: () => void,
  stopSpeaking: () => void,
) {
  const pathname = usePathname();
  // Catch any route committed outside the app's normal links and buttons.
  useLayoutEffect(() => {
    stopSpeaking();
  }, [pathname, stopSpeaking]);
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = event.target;
      const link = target instanceof Element ? target.closest("a[href]") : null;
      if (
        !(link instanceof HTMLAnchorElement) ||
        link.download ||
        (link.target && link.target !== "_self")
      )
        return;
      const next = new URL(link.href, location.href);
      if (
        next.origin !== location.origin ||
        next.pathname !== location.pathname ||
        next.search !== location.search
      )
        onNavigate();
    }
    document.addEventListener("click", onClick, true);
    window.addEventListener(manualNavigationEvent, onNavigate);
    window.addEventListener("popstate", onNavigate);
    window.addEventListener("pagehide", onNavigate);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(manualNavigationEvent, onNavigate);
      window.removeEventListener("popstate", onNavigate);
      window.removeEventListener("pagehide", onNavigate);
    };
  }, [onNavigate]);
}
