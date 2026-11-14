import type { LearningState } from "@/hooks/use-learning";
export function LessonActions(state: LearningState) {
  const {
    step,
    setStep,
    setPlaying,
    completed,
    setCompleted,
    example,
    chooseExample,
    navigate,
  } = state;
  return (
    <div className="step-actions">
      <button
        className="button secondary"
        disabled={step === 0}
        onClick={() => {
          setStep(step - 1);
          setPlaying(false);
        }}
      >
        ← Back
      </button>
      <button
        className="button primary"
        onClick={() => {
          setPlaying(false);
          if (step < 6) setStep(step + 1);
          else {
            setCompleted([...new Set([...completed, example])]);
            if (example < 4) chooseExample(example + 1);
            else navigate("game");
          }
        }}
      >
        {step < 6 ? "Next step" : example < 4 ? "Next example" : "Let’s play"} →
      </button>
    </div>
  );
}
