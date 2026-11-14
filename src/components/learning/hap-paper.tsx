import { useEffect, useRef } from "react";
import { TypedBite } from "./typed-bite";

/** The child's own written record of each bite in the Feed Orbit game. */
export function HapPaper({
  n,
  d,
  bites,
  best,
  typing,
  onTyped,
  onUndo,
  onRestart,
}: {
  n: number;
  d: number;
  bites: number[];
  best: number;
  /** Index of the bite being typed out, or -1 when the paper is still. */
  typing: number;
  onTyped: () => void;
  onUndo: () => void;
  onRestart: () => void;
}) {
  const eaten = bites.reduce((a, b) => a + b, 0);
  const left = n - eaten * d;
  // Finished only once the last bite has been typed out.
  const done = left < d && typing < 0;
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => {
    log.current?.scrollTo({
      top: log.current.scrollHeight,
      behavior: "smooth",
    });
  });
  return (
    <section className="paper-panel chunk-paper hap-paper">
      <div className="flex items-center justify-between">
        <span className="eyebrow">YOUR PAPER</span>
        <span className="paper-badge">
          {bites.length} {bites.length === 1 ? "bite" : "bites"}
        </span>
      </div>
      <div ref={log} className="chunk-calculation hap-log">
        <div className="chunk-heading">
          {n} : {d} = {done ? `${eaten}${left ? ` rest ${left}` : ""}` : "?"}
        </div>
        <div className="chunk-row">
          <span>{n}</span>
          <small>starting number</small>
        </div>
        {bites.map((g, i) => {
          const after =
            n - bites.slice(0, i + 1).reduce((a, b) => a + b, 0) * d;
          const last = i === bites.length - 1 && after < d;
          return (
            <TypedBite
              key={i}
              g={g}
              d={d}
              after={after}
              total={last ? `${bites.join(" + ")} = ${eaten} groups` : null}
              animate={i === typing}
              waiting={i === bites.length - 1 && after >= d}
              onDone={onTyped}
            />
          );
        })}
      </div>
      {done ? (
        <div className="hap-finish reveal">
          <p className="hap-score">
            {bites.length <= best
              ? `🏆 ${bites.length} ${bites.length === 1 ? "bite" : "bites"} — the fewest possible!`
              : `⭐ You did it in ${bites.length} bites! Can you do it in ${best}?`}
          </p>
          <div className="hap-actions">
            <button className="button primary" onClick={onRestart}>
              ↻ Feed me again
            </button>
          </div>
        </div>
      ) : (
        <div className="hap-actions">
          <button
            className="text-button"
            disabled={!bites.length || typing >= 0}
            onClick={onUndo}
          >
            ↶ Undo last bite
          </button>
        </div>
      )}
    </section>
  );
}
