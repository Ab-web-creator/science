import { NarrationControls } from "./narration-controls";
import type { LearningState } from "@/hooks/use-learning";
export function LessonStep(state: LearningState & { onFeed: () => void }) {
  const { step, steps, setStep, setPlaying, example } = state;
  return (
    <section className="step-panel">
      <div className="flex items-center justify-between">
        <span className="eyebrow">STEP {step + 1} OF 7</span>
      </div>
      <div className="step-progress">
        {steps.map((s, i) => (
          <button
            aria-label={`Go to step ${i + 1}: ${s.title}`}
            className={i <= step ? "filled" : ""}
            key={s.title}
            aria-current={i === step ? "step" : undefined}
            onClick={() => {
              setStep(i);
              setPlaying(false);
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div key={`${example}-${step}`} className="step-content reveal">
        <h2>{steps[step].title}</h2>
        <p>{steps[step].text}</p>
        {(step === 1 || step === 6) && (
          <button className="feed-invite" onClick={state.onFeed}>
            😋{" "}
            {step === 1
              ? "Your turn: choose Orbit’s bites yourself!"
              : "Can you feed Orbit in fewer bites?"}
          </button>
        )}
      </div>
      <NarrationControls text={steps[step].text} />
    </section>
  );
}
