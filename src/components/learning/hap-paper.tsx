import { useEffect, useRef } from "react";
import { NarrationControls } from "./narration-controls";

/** The child's own written record of each bite in the Feed Orbit game. */
export function HapPaper({
  n,
  d,
  bites,
  best,
  message,
  onUndo,
  onRestart,
}: {
  n: number;
  d: number;
  bites: number[];
  best: number;
  message: string;
  onUndo: () => void;
  onRestart: () => void;
}) {
  const eaten = bites.reduce((a, b) => a + b, 0);
  const left = n - eaten * d;
  const done = left < d;
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => {
    log.current?.scrollTo({
      top: log.current.scrollHeight,
      behavior: "smooth",
    });
  }, [bites.length]);
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
          return (
            <div key={i} className="reveal">
              <div className="chunk-row subtraction">
                <span>−{g * d}</span>
                <small>
                  {g} × {d}
                  <b>
                    {g} {g === 1 ? "group" : "groups"}
                  </b>
                </small>
              </div>
              <div className="chunk-row">
                <span>{after}</span>
                <small>
                  {after < d ? (after ? "rest" : "nothing left") : "left over"}
                </small>
              </div>
            </div>
          );
        })}
        {done && (
          <div className="chunk-total reveal">
            {bites.join(" + ")} = {eaten} groups
          </div>
        )}
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
            disabled={!bites.length}
            onClick={onUndo}
          >
            ↶ Undo last bite
          </button>
          <NarrationControls text={message} compact />
        </div>
      )}
    </section>
  );
}
