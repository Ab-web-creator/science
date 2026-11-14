"use client";
import { useState } from "react";
import { useLearning } from "@/hooks/use-learning";
import { LessonIntro } from "./lesson-intro";
import { DivisionPaper } from "./division-paper";
import { LessonStep } from "./lesson-step";
import { LessonActions } from "./lesson-actions";
import { HelpDialog } from "./help-dialog";
import { HapGame } from "./hap-game";

export function LessonView() {
  const state = useLearning();
  const [view, setView] = useState("steps");
  const [feeding, setFeeding] = useState(false);
  // Auto-play in Feed Orbit reads Orbit's messages; it carries over from the lesson.
  const [feedVoice, setFeedVoice] = useState(false);
  function startFeeding() {
    setFeedVoice(state.playing);
    state.setPlaying(false);
    state.setVoice(false);
    setFeeding(true);
  }
  return (
    <section className="screen-page lesson-screen">
      <LessonIntro
        {...state}
        feeding={feeding}
        onFeed={startFeeding}
        onBack={() => setFeeding(false)}
        feedVoice={feedVoice}
        onToggleFeedVoice={() => setFeedVoice(!feedVoice)}
      />
      {feeding ? (
        <HapGame
          key={state.example}
          n={state.ex.n}
          d={state.ex.d}
          story={state.ex.story}
          mission={state.ex.mission}
          autoRead={feedVoice}
        />
      ) : (
        <>
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
            <LessonStep {...state} onFeed={startFeeding} />
          </div>
        </>
      )}
      <div className="lesson-dock">
        <HelpDialog label="☀ Tips & help" title="A little help from Orbit">
          <p>
            Choose a chunk that fits. Subtract it. Repeat until the rest is
            smaller than the divisor. Add your group counts.
          </p>
          <p>
            Smaller chunks work too! Tap 😋 Feed Orbit to pick your own bites.
            Bigger bites that still fit mean fewer bites.
          </p>
          <p>
            For your grown-up: practise one together, then let Azat explain the
            next. Match his teacher’s notation.
          </p>
        </HelpDialog>
        {!feeding && <LessonActions {...state} />}
      </div>
    </section>
  );
}
