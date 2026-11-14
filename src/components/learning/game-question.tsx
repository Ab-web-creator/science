import { NarrationControls } from "./narration-controls";
import type { LearningState } from "@/hooks/use-learning";
import { HelpDialog } from "./help-dialog";
import { questions } from "@/lib/division";
type QuestionProps = Pick<
  LearningState,
  | "question"
  | "voiceAvailable"
  | "speak"
  | "q"
  | "solved"
  | "selected"
  | "answerQuestion"
  | "nextQuestion"
> & { totalQuestions?: number; operator?: string; equation?: string };
export function GameQuestion(state: QuestionProps) {
  const {
    totalQuestions = questions.length,
    operator = ":",
    equation,
    question,
    q,
    solved,
    selected,
    answerQuestion,
    nextQuestion,
  } = state;
  return (
    <section className="game-card">
      <div className="flex items-center justify-between">
        <span className="eyebrow">
          MISSION {question + 1} / {totalQuestions}
        </span>
        <NarrationControls text={q.prompt} compact />
      </div>
      <div className="game-progress">
        <div style={{ width: `${(question / totalQuestions) * 100}%` }} />
      </div>
      <div className="game-equation">
        {equation ?? (
          <>
            {q.n} <span>{operator}</span> {q.d}
          </>
        )}
      </div>
      <h2>{q.prompt}</h2>
      <div className="answer-grid">
        {q.options.map((option, i) => (
          <button
            disabled={solved}
            onClick={() => answerQuestion(option)}
            className={`answer-option ${selected === option ? (solved ? "correct" : "incorrect") : ""}`}
            key={option}
          >
            <span>{String.fromCharCode(65 + i)}</span>
            {option}
            {selected === option && <b>{solved ? "✓" : "↻"}</b>}
          </button>
        ))}
      </div>
      <div className="feedback" role="status" aria-live="polite">
        {selected !== null &&
          (solved ? (
            <p className="success">
              ✦ That’s it! One more star for your thinking.
            </p>
          ) : (
            <p className="retry">Not quite. Try again, or ask for a hint.</p>
          ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <HelpDialog label="☀ Hint" title="Let’s think about this">
          <p>{q.hint}</p>
        </HelpDialog>
        {solved && (
          <button className="button primary" onClick={nextQuestion}>
            {question === totalQuestions - 1
              ? "Finish mission"
              : "Next challenge"}{" "}
            →
          </button>
        )}
      </div>
    </section>
  );
}
