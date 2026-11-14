"use client";
import { useEffect, useRef } from "react";
import type { LearningState } from "@/hooks/use-learning";
import { biteSizes, examples, missionAnswer, type Focus } from "@/lib/division";
import { OrbitNote } from "./orbit-note";

export function DivisionPaper(state: LearningState) {
  const { example, ex, step, steps, chunks, focus, revealCue, cue } = state;
  // When the paper is taller than the screen, keep what Orbit talks about in view.
  const paper = useRef<HTMLElement>(null);
  useEffect(() => {
    const panel = paper.current;
    const target = panel?.querySelector<HTMLElement>(`[data-focus="${focus}"]`);
    if (!panel || !target || panel.scrollHeight <= panel.clientHeight) return;
    const box = panel.getBoundingClientRect();
    const row = target.getBoundingClientRect();
    if (row.top < box.top + 8 || row.bottom > box.bottom - 8)
      panel.scrollBy({
        top: row.top - box.top - box.height / 3,
        behavior: "smooth",
      });
  }, [focus, step, revealCue]);
  const { big, left, small, rest, groups } = chunks;

  /** Shown once its step is reached and (during auto-play) its sentence starts. */
  function shown(owner: number, id: Focus) {
    if (step !== owner) return step > owner;
    const at = steps[owner].cues.findIndex((c) => c.focus === id);
    return revealCue >= Math.max(0, at);
  }
  function row(owner: number, id: Focus, extra = "") {
    const lit =
      focus === id ||
      (focus === "groups" && extra === "subtraction") ||
      // While comparing, the starting number lights up next to the check.
      (focus === "checksame" && id === "start");
    return {
      "data-focus": id,
      className: `chunk-row ${extra} ${lit ? "focus" : ""} ${shown(owner, id) ? "reveal" : "invisible"}`,
    };
  }
  /** "N groups" label: written in when Orbit says "write N groups beside it",
   *  and pulses whenever Orbit talks about the group counts later on. */
  function label(owner: number) {
    const visible = shown(owner, "groups");
    const lit = focus === "groups" && visible;
    const effect = !lit ? "" : step === owner ? "writing" : "focus";
    return `groups-label ${visible ? "" : "invisible"} ${effect}`;
  }

  return (
    <section ref={paper} className="paper-panel chunk-paper">
      <div className="flex items-center justify-between">
        <span className="eyebrow">KOLOMSGEWIJS DELEN</span>
        <span className="paper-badge">
          Example {example + 1} / {examples.length}
        </span>
      </div>
      <div className="multiples-strip">
        Handy facts:{" "}
        {biteSizes.map((g, i) => (
          <span key={g}>
            {i > 0 && " · "}
            <span className={`fact ${focus === `fact-${g}` ? "focus" : ""}`}>
              {g} × {ex.d} = {g * ex.d}
            </span>
          </span>
        ))}
      </div>
      {ex.mission && (
        <div
          data-focus="mission"
          className={`mission-banner ${focus === "mission" ? "focus" : ""}`}
        >
          🎯 <b>Mission:</b> {ex.story} {ex.mission.question}
        </div>
      )}
      <div className="paper-work">
        <div
          className="chunk-calculation"
          aria-label={`${ex.n} divided by ${ex.d} using chunks, step ${step + 1}`}
        >
          <div
            data-focus="heading"
            className={`chunk-heading ${focus === "heading" ? "focus" : ""}`}
          >
            {ex.n} : {ex.d} ={" "}
            {shown(5, "heading")
              ? `${groups}${rest ? ` rest ${rest}` : ""}`
              : "?"}
          </div>
          <div {...row(0, "start")}>
            <span>{ex.n}</span>
            <small>starting number</small>
          </div>
          <div {...row(1, "sub1", "subtraction")}>
            <span>−{big * ex.d}</span>
            <small>
              {big} × {ex.d}
              <b className={label(1)}>{big} groups</b>
            </small>
          </div>
          <div {...row(2, "left")}>
            <span>{left}</span>
            <small>left over</small>
          </div>
          {small > 0 ? (
            <>
              <div {...row(3, "sub2", "subtraction")}>
                <span>−{small * ex.d}</span>
                <small>
                  {small} × {ex.d}
                  <b className={label(3)}>
                    {small} {small === 1 ? "group" : "groups"}
                  </b>
                </small>
              </div>
              <div {...row(4, "rest")}>
                <span>{rest}</span>
                <small>{rest ? "rest" : "nothing left"}</small>
              </div>
            </>
          ) : (
            <div
              data-focus="restnote"
              className={`rest-note ${focus === "restnote" ? "focus" : ""} ${shown(3, "restnote") ? "reveal" : "invisible"}`}
            >
              {rest} &lt; {ex.d}: stop here. Rest {rest}.
            </div>
          )}
          <div
            data-focus="total"
            className={`chunk-total ${focus === "total" ? "focus" : ""} ${shown(5, "total") ? "reveal" : "invisible"}`}
          >
            {big}
            {small ? ` + ${small}` : ""} = {groups} groups
          </div>
          <div
            className={`check-box ${shown(6, "checkhead") ? "reveal" : "invisible"}`}
          >
            <div
              data-focus="checkhead"
              className={`check-head ${focus === "checkhead" ? "focus" : ""}`}
            >
              ✓ Check: multiply back
            </div>
            <div
              data-focus="check"
              className={`check-line ${focus === "check" ? "focus" : ""} ${shown(6, "check") ? "reveal" : "invisible"}`}
            >
              {groups} × {ex.d}
              {rest ? ` + ${rest}` : ""} = {ex.n}
            </div>
            <div
              data-focus="checksame"
              className={`check-line ${focus === "checksame" ? "focus" : ""} ${shown(6, "checksame") ? "reveal" : "invisible"}`}
            >
              {ex.n} = {ex.n} ✓
              <small className="check-note">same as the starting number</small>
            </div>
          </div>
          {ex.mission && (
            <div
              data-focus="answer"
              className={`mission-answer ${focus === "answer" ? "focus" : ""} ${shown(6, "answer") ? "reveal" : "invisible"}`}
            >
              🎯 Answer: {missionAnswer(ex.n, ex.d, ex.mission)}{" "}
              {ex.mission.units}
              {rest > 0 && (
                <small className="check-note">
                  {groups} full {ex.mission.units}
                  {ex.mission.roundUp
                    ? ` + 1 ${ex.mission.unit} for the last ${rest} ${ex.mission.things}`
                    : `; ${rest} ${ex.mission.things} left over`}
                </small>
              )}
            </div>
          )}
        </div>
        <OrbitNote
          anchor={steps[step].anchor}
          cues={steps[step].cues}
          active={cue}
          stepKey={`${example}-${step}`}
          onRead={state.readStep}
        />
      </div>
    </section>
  );
}
