"use client";
import { useState } from "react";
import { useLearning } from "@/hooks/use-learning";
import { LessonIntro } from "./lesson-intro";
import { DivisionPaper } from "./division-paper";
import { LessonStep } from "./lesson-step";
import { LessonActions } from "./lesson-actions";
import { HelpDialog } from "./help-dialog";

export function LessonView() {
  const state = useLearning();
  const [view, setView] = useState("steps");
  return (
    <section className="screen-page lesson-screen">
      <LessonIntro {...state} />
      <div className="lesson-switch" role="group" aria-label="Lesson view">
        <button
          aria-pressed={view === "steps"}
          onClick={() => setView("steps")}
        >
          ① Explain it
        </button>
        <button
          aria-pressed={view === "paper"}
          onClick={() => setView("paper")}
        >
          ✎ Show the paper
        </button>
      </div>
      <div className="lesson-layout" data-view={view}>
        <DivisionPaper {...state} />
        <LessonStep {...state} />
      </div>
      <div className="lesson-dock">
        <HelpDialog label="☀ Tips & help" title="A little help from Orbit">
          <p>
            Choose a chunk that fits. Subtract it. Repeat until the rest is
            smaller than the divisor. Add your group counts.
          </p>
          <p>
            Smaller chunks work too! Try 10 groups at a time, then check by
            multiplying.
          </p>
          <p>
            For your grown-up: practise one together, then let Azat explain the
            next. Match his teacher’s notation.
          </p>
        </HelpDialog>
        <LessonActions {...state} />
      </div>
    </section>
  );
}
