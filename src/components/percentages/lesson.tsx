"use client";
import { NarrationControls } from "@/components/learning/narration-controls";
import { useState } from "react";
import { useQuietRouter } from "@/hooks/use-quiet-router";
import { useLearning } from "@/hooks/use-learning";
import {
  percentageExamples,
  percentageSteps,
  percentagePath,
} from "@/lib/percentages";
import { HelpDialog } from "@/components/learning/help-dialog";
import { PercentageBoard } from "./board";

export function PercentageLesson({
  example,
  step,
}: {
  example: number;
  step: number;
}) {
  const router = useQuietRouter();
  const [view, setView] = useState("steps");
  const { voiceAvailable, speak } = useLearning();
  const { a, b } = percentageExamples[example];
  const steps = percentageSteps(example);
  function go(next: number) {
    router.push(percentagePath(example, next), { scroll: false });
  }
  return (
    <section className="screen-page lesson-screen">
      <div className="section-title lesson-heading">
        <div>
          <div className="eyebrow">
            EXAMPLE {example + 1} OF 5 · PERCENTAGES
          </div>
          <h1 className="inner-title">
            Let’s solve{" "}
            <span className="serif-word">
              {a}% of {b}
            </span>
          </h1>
        </div>
        <button
          className="button secondary"
          disabled={!voiceAvailable}
          onClick={() => speak(steps[step].text)}
        >
          ♫ Listen
        </button>
      </div>
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
          ▦ Show the picture
        </button>
      </div>
      <div className="lesson-layout" data-view={view}>
        <PercentageBoard example={example} step={step} />
        <section className="step-panel">
          <span className="eyebrow">STEP {step + 1} OF 4</span>
          <div className="step-progress">
            {steps.map((s, i) => (
              <button
                key={s.title}
                aria-label={`Go to step ${i + 1}: ${s.title}`}
                aria-current={step === i ? "step" : undefined}
                className={i <= step ? "filled" : ""}
                onClick={() => go(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="step-content reveal" key={step}>
            <h2>{steps[step].title}</h2>
            <p>{steps[step].text}</p>
          </div>
          <NarrationControls text={steps[step].text} />
        </section>
      </div>
      <div className="lesson-dock">
        <HelpDialog label="☀ Tips & help" title="Think in equal shares">
          <p>
            Percent means out of 100. Start with a helpful share: 50% is half,
            25% is a quarter, and 10% is one tenth.
          </p>
          <p>
            To find any percentage, divide the whole by 100 to find 1%, then
            multiply by the percent. A percent and an amount are different: 20%
            of 150 is 30, not 20.
          </p>
        </HelpDialog>
        <div className="step-actions">
          <button
            className="button secondary"
            disabled={step === 0}
            onClick={() => go(step - 1)}
          >
            ← Back
          </button>
          <button
            className="button primary"
            onClick={() => {
              if (step < 3) go(step + 1);
              else
                router.push(
                  example < 4
                    ? percentagePath(example + 1)
                    : "/play/percentages/1",
                );
            }}
          >
            {step < 3
              ? "Next step"
              : example < 4
                ? "Next example"
                : "Let’s play"}{" "}
            →
          </button>
        </div>
      </div>
    </section>
  );
}
