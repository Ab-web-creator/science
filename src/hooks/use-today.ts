"use client";
import { useSyncExternalStore } from "react";
import { dayKey } from "@/lib/activity";

const noSubscribe = () => () => {};
/** Today's date ("YYYY-MM-DD"), read in the browser only. During the server
 *  prerender it is null, because Next.js must not bake a date into the page. */
export function useToday() {
  return useSyncExternalStore(
    noSubscribe,
    () => dayKey(),
    () => null,
  );
}
