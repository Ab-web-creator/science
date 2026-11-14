"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { stopForNavigation } from "@/lib/navigation-speech";

export function useQuietRouter() {
  const router = useRouter();
  return useMemo(
    () => ({
      ...router,
      push: (...args: Parameters<typeof router.push>) => {
        stopForNavigation();
        router.push(...args);
      },
      replace: (...args: Parameters<typeof router.replace>) => {
        stopForNavigation();
        router.replace(...args);
      },
      back: () => {
        stopForNavigation();
        router.back();
      },
      forward: () => {
        stopForNavigation();
        router.forward();
      },
      refresh: () => {
        stopForNavigation();
        router.refresh();
      },
    }),
    [router],
  );
}
