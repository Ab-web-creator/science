"use client";
import { useState, useSyncExternalStore } from "react";
import { LearningCard, type LearningCardProps } from "./learning-card";

function subscribeToSize(onChange: () => void) {
  const queries = [
    matchMedia("(min-width: 761px)"),
    matchMedia("(min-width: 1100px)"),
  ];
  queries.forEach((query) => query.addEventListener("change", onChange));
  return () =>
    queries.forEach((query) => query.removeEventListener("change", onChange));
}
function cardsForSize() {
  return matchMedia("(min-width: 1100px)").matches
    ? 3
    : matchMedia("(min-width: 761px)").matches
      ? 2
      : 1;
}

export function CardBrowser({
  items,
  label,
  multiple = false,
}: {
  items: LearningCardProps[];
  label: string;
  multiple?: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const available = useSyncExternalStore(
    subscribeToSize,
    cardsForSize,
    () => 1,
  );
  const count = multiple ? available : 1;
  const start = Math.floor(current / count) * count;
  const end = Math.min(start + count, items.length);
  return (
    <section
      className={`card-browser ${multiple ? "multi-card-browser" : ""}`}
      aria-label={label}
    >
      <div
        className="browser-grid"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {items.slice(start, end).map((item) => (
          <div className="browser-card" key={item.href}>
            <LearningCard {...item} />
          </div>
        ))}
      </div>
      <nav className="card-pager" aria-label={`${label} pages`}>
        <button
          className="button secondary"
          disabled={start === 0}
          onClick={() => setCurrent(Math.max(0, start - count))}
        >
          ← Previous
        </button>
        <span role="status" aria-live="polite">
          {count === 1 ? start + 1 : `${start + 1}–${end}`} of {items.length}
        </span>
        <button
          className="button secondary"
          disabled={end === items.length}
          onClick={() => setCurrent(end)}
        >
          Next →
        </button>
      </nav>
    </section>
  );
}
