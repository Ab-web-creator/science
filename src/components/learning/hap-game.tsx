"use client";
import { useState } from "react";
import { biteSizes, fewestBites, takeBite } from "@/lib/division";
import { Robot } from "./robot";
import { HapPaper } from "./hap-paper";

type Mood = "hungry" | "chomp" | "bounce" | "full";

/** Feed Orbit: the child picks bite sizes (hap) and watches the stars disappear. */
export function HapGame({
  n,
  d,
  story,
}: {
  n: number;
  d: number;
  story: string;
}) {
  const [bites, setBites] = useState<number[]>([]);
  const [mood, setMood] = useState<Mood>("hungry");
  const [message, setMessage] = useState(
    `I’m hungry! ${story} How big a bite can I take? Each bite is a number of groups of ${d}.`,
  );
  const [preview, setPreview] = useState(0);
  const [tries, setTries] = useState(0); // re-triggers the chomp/bounce animation

  const eaten = bites.reduce((a, b) => a + b, 0);
  const left = n - eaten * d;
  const done = left < d;
  const totalRows = Math.ceil(n / d);
  const rest = n % d;
  const best = fewestBites(Math.floor(n / d));

  function bite(groups: number) {
    const result = takeBite(left, d, groups);
    setTries(tries + 1);
    if (!result.fits) {
      setMood("bounce");
      setMessage(
        `${groups} × ${d} = ${groups * d}. That’s more than ${left}! Too big — it doesn’t fit. Try a smaller bite.`,
      );
      return;
    }
    const next = [...bites, groups];
    setBites(next);
    if (result.left < d) {
      setMood("full");
      const total = next.reduce((a, b) => a + b, 0);
      setMessage(
        result.left
          ? `Hap! ${result.left} is smaller than ${d}, so no whole group fits. ${n} : ${d} = ${total} rest ${result.left}.`
          : `Hap! All ${n} stars eaten — nothing left over! ${n} : ${d} = ${total}.`,
      );
    } else {
      setMood("chomp");
      setMessage(
        `Hap! ${groups} × ${d} = ${groups * d}. ${result.left} stars left. Still hungry!`,
      );
    }
  }

  function undo() {
    setBites(bites.slice(0, -1));
    setMood("hungry");
    setMessage("Okay, I spat that bite out. Pick again!");
  }

  function restart() {
    setBites([]);
    setMood("hungry");
    setTries(tries + 1);
    setMessage(`Again! Can you feed me all ${n} stars in ${best} bites?`);
  }

  // Rows of the star field: one row per group of d, plus a short row for the rest.
  const previewFits = preview > 0 && preview * d <= left;
  const rows = Array.from({ length: totalRows }, (_, r) => {
    const count = r === totalRows - 1 && rest ? rest : d;
    const isRest = count < d;
    let state = "";
    if (r < eaten) state = "eaten";
    else if (isRest && done) state = "rest";
    else if (preview && !isRest && !done)
      state = previewFits ? (r < eaten + preview ? "next" : "") : "toobig";
    return { count, state };
  });
  const dot = 10;

  return (
    <div className="hap-layout reveal">
      <section className="paper-panel hap-board">
        <div className="hap-orbit">
          <div key={tries} className={`hap-robot ${mood}`} aria-hidden="true">
            <Robot small />
          </div>
          <p className="hap-bubble" role="status" aria-live="polite">
            {message}
          </p>
        </div>
        <svg
          className="hap-stars"
          viewBox={`0 0 ${d * dot} ${totalRows * dot}`}
          role="img"
          aria-label={`${left} stars left, in rows of ${d}. Orbit has eaten ${eaten} groups.`}
        >
          {rows.map((row, r) => (
            <g key={r} className={`hap-row ${row.state}`}>
              {Array.from({ length: row.count }, (_, c) => (
                <circle
                  key={c}
                  cx={c * dot + dot / 2}
                  cy={r * dot + dot / 2}
                  r={dot * 0.36}
                />
              ))}
            </g>
          ))}
        </svg>
        <div className="hap-bites" role="group" aria-label="Choose a bite">
          {biteSizes.map((g) => (
            <button
              key={g}
              disabled={done}
              onClick={() => bite(g)}
              onPointerEnter={() => setPreview(g)}
              onPointerLeave={() => setPreview(0)}
              onFocus={() => setPreview(g)}
              onBlur={() => setPreview(0)}
            >
              <b>
                {g} × {d}
              </b>
              <span>= {g * d}</span>
            </button>
          ))}
        </div>
      </section>

      <HapPaper
        n={n}
        d={d}
        bites={bites}
        best={best}
        message={message}
        onUndo={undo}
        onRestart={restart}
      />
    </div>
  );
}
