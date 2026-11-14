"use client";
import { useLayoutEffect, useRef, useState } from "react";
import type { Cue, Focus } from "@/lib/division";
import { ListenButton } from "./listen-button";

/** Orbit's note on the paper: sits beside the row the step is about and
 *  lights up each sentence while it is being read aloud. */
export function OrbitNote({
  anchor,
  cues,
  active,
  stepKey,
  onRead,
}: {
  anchor: Focus;
  cues: Cue[];
  active: number | null;
  stepKey: string;
  onRead: () => void;
}) {
  const note = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    const el = note.current;
    const work = el?.parentElement;
    if (!el || !work) return;
    function place() {
      const target = work!.querySelector<HTMLElement>(
        `[data-focus="${anchor}"]`,
      );
      if (!target || !el) return;
      const box = work!.getBoundingClientRect();
      const row = target.getBoundingClientRect();
      if (window.matchMedia("(max-width: 760px)").matches) {
        // Phones: no room beside the row, so sit just below it (rows further
        // down belong to later steps and are still hidden).
        setTop(row.bottom - box.top + 12);
        // Scroll the paper so the row and the note under it are both in view.
        const panel = el.closest<HTMLElement>(".paper-panel");
        if (panel) {
          const noteEnd =
            row.bottom - panel.getBoundingClientRect().top + panel.scrollTop;
          const want = noteEnd + 12 + el.offsetHeight + 12 - panel.clientHeight;
          if (want > panel.scrollTop)
            panel.scrollTo({ top: want, behavior: "smooth" });
        }
        return;
      }
      // Beside the row, but never below the paper's visible edge.
      const panel = el.closest(".paper-panel")?.getBoundingClientRect();
      const bottom = Math.min(
        box.height,
        panel ? panel.bottom - box.top - 16 : box.height,
      );
      const want = row.top - box.top + row.height / 2 - 30;
      setTop(
        Math.min(Math.max(0, want), Math.max(0, bottom - el.offsetHeight)),
      );
    }
    place();
    const observer = new ResizeObserver(place);
    observer.observe(work);
    observer.observe(el);
    // Follow the row when the paper scrolls.
    const panel = el.closest(".paper-panel");
    panel?.addEventListener("scroll", place);
    return () => {
      observer.disconnect();
      panel?.removeEventListener("scroll", place);
    };
  }, [anchor, stepKey]);

  return (
    <div
      ref={note}
      className="orbit-note"
      style={{ "--note-top": `${top}px` } as React.CSSProperties}
      aria-live="polite"
    >
      <span className="orbit-note-name" aria-hidden="true">
        🤖 Orbit
      </span>
      <p key={stepKey} className="reveal">
        {cues.map((c, i) => (
          <span key={i} className={i === active ? "cue active" : "cue"}>
            {colourGroups(c.say)}{" "}
          </span>
        ))}
      </p>
      <ListenButton text={cues.map((c) => c.say).join(" ")} onRead={onRead} />
    </div>
  );
}

/** Colour "N groups" purple, matching the group labels on the paper. */
function colourGroups(text: string) {
  return text.split(/(\d+ (?:more )?groups?)/).map((part, i) =>
    i % 2 ? (
      <b key={i} className="cue-groups">
        {part}
      </b>
    ) : (
      part
    ),
  );
}
