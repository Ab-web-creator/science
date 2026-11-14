"use client";
import { useSyncExternalStore } from "react";
import { starStore } from "@/lib/star-store";

/** One small star per challenge: gold, silver or still empty. */
export function StarRow({
  storageKey,
  count,
}: {
  storageKey: string;
  count: number;
}) {
  const stars = useSyncExternalStore(
    starStore.subscribe,
    () => starStore.get(storageKey),
    starStore.getServer,
  );
  const gold = Object.values(stars).filter((s) => s === "gold").length;
  return (
    <span
      className="star-row"
      aria-label={`${gold} of ${count} stars are gold`}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`star-dot ${stars[i] ?? "empty"}`}
          aria-hidden="true"
        >
          {stars[i] === "silver" ? "✧" : "✦"}
        </span>
      ))}
      <small>
        {gold === count ? "All gold! 🏆" : `${gold} of ${count} gold`}
      </small>
    </span>
  );
}
