"use client";
import { useEffect, useState } from "react";

/** Typing speed (ms per character): numbers are typed slowly so the child can
 *  follow them; words like "left over" and "groups" go quickly. */
const NUMBER_MS = 110;
const WORD_MS = 30;
const TOTAL_MS = 60;
/** Pause before each new field starts. */
const GAP_MS = 260;

let audio: AudioContext | null = null;
/** A soft "tip" for each typed character (quiet, so narration stays clear). */
function tip() {
  try {
    audio ??= new AudioContext();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const now = audio.currentTime;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1300 + Math.random() * 250, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    osc.connect(gain).connect(audio.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    /* No sound available: typing still shows. */
  }
}

/** One bite on the child's paper. When `animate` is set, it is typed out
 *  character by character (number, sum, group count, what is left), slowly
 *  enough to follow, then `onDone` lets the game continue. */
export function TypedBite({
  g,
  d,
  after,
  total,
  animate,
  waiting,
  onDone,
}: {
  g: number;
  d: number;
  after: number;
  /** The closing "10 + 2 + 1 = 13 groups" line, on the last bite only. */
  total: string | null;
  animate: boolean;
  /** Newest "left over": bounce to show Orbit expects another bite. */
  waiting: boolean;
  onDone: () => void;
}) {
  const fields = [
    `−${g * d}`,
    `${g} × ${d}`,
    `${g} ${g === 1 ? "group" : "groups"}`,
    `${after}`,
    after < d ? (after ? "rest" : "nothing left") : "left over",
    ...(total ? [total] : []),
  ];
  const speed = [NUMBER_MS, NUMBER_MS, WORD_MS, NUMBER_MS, WORD_MS, TOTAL_MS];
  // `t` counts typed characters across all fields; field i starts at starts[i].
  const starts: number[] = [];
  let end = 0;
  for (const f of fields) {
    starts.push(end);
    end += f.length;
  }
  const [t, setT] = useState(animate ? 0 : end);

  useEffect(() => {
    if (t >= end) {
      if (animate) onDone();
      return;
    }
    const i = starts.findLastIndex((s) => s <= t);
    const delay = (t === starts[i] ? GAP_MS : 0) + speed[i];
    const timer = setTimeout(() => {
      if (fields[i][t - starts[i]].trim()) tip();
      setT(t + 1);
    }, delay);
    return () => clearTimeout(timer);
    // `fields`/`starts` are derived from the props, which stay fixed per bite.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, end, animate]);

  /** Typed part visible; the rest keeps its space so nothing shifts. */
  function typed(i: number) {
    const n = Math.max(0, Math.min(fields[i].length, t - starts[i]));
    const active = t >= starts[i] && t < starts[i] + fields[i].length;
    return (
      <>
        <span className={active ? "typed typing" : "typed"}>
          {fields[i].slice(0, n)}
        </span>
        <span className="untyped" aria-hidden="true">
          {fields[i].slice(n)}
        </span>
      </>
    );
  }

  return (
    <div aria-label={`${fields.join(", ")}`}>
      <div className="chunk-row subtraction">
        <span>{typed(0)}</span>
        <small>
          {typed(1)}
          <b>{typed(2)}</b>
        </small>
      </div>
      <div className="chunk-row">
        <span>{typed(3)}</span>
        <small>
          <span
            className={waiting && t >= end ? "left-over waiting" : "left-over"}
          >
            {typed(4)}
          </span>
        </small>
      </div>
      {total && <div className="chunk-total">{typed(5)}</div>}
    </div>
  );
}
