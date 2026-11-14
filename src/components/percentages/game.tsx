"use client";
import Link from "next/link";
import { useQuietRouter } from "@/hooks/use-quiet-router";
import { useLearning } from "@/hooks/use-learning";
import { percentageQuestions } from "@/lib/percentages";
import { GameQuestion } from "@/components/learning/game-question";
import { GameAutoplay } from "@/components/learning/game-autoplay";
import { StarCount } from "@/components/learning/star-count";
import { StarSummary } from "@/components/learning/star-summary";
import { Robot } from "@/components/learning/robot";
export function PercentageGame({ challenge }: { challenge: string }) {
  const router = useQuietRouter();
  const { percentagePractice, voiceAvailable, speak } = useLearning();
  const complete = challenge === "complete",
    question = complete ? 0 : Number(challenge) - 1;
  const { gold, silver, resetPractice, ...practice } = percentagePractice;
  const q = percentageQuestions[question];
  return (
    <section className="screen-page game-screen percentage-game">
      <div className="section-title">
        <h1 className="inner-title">
          Percentage <span className="serif-word">mission.</span>
        </h1>
        <div className="game-heading-actions">
          <span className="score-pill">
            <StarCount gold={gold} silver={silver} words />
          </span>
          <GameAutoplay />
        </div>
      </div>
      {complete ? (
        <section className="finish-card">
          <Robot />
          <div className="eyebrow">MISSION COMPLETE</div>
          <h2>You did it, Azat Sa!</h2>
          <p>
            <StarSummary gold={gold} silver={silver} topic="percentage" />
            <br />
            Try 30% of 90 on paper next.
          </p>
          <details>
            <summary>Check your answer</summary>
            <p>10% of 90 is 9. Triple it: 30% is 27.</p>
          </details>
          <button
            className="button primary mt-6"
            onClick={() => {
              resetPractice();
              router.push("/play/percentages/1");
            }}
          >
            Play again ↻
          </button>
        </section>
      ) : (
        <div className="game-layout">
          <GameQuestion
            {...practice}
            question={question}
            q={q}
            voiceAvailable={voiceAvailable}
            speak={speak}
            equation={`${q.n}% of ${q.d}`}
            totalQuestions={percentageQuestions.length}
            nextQuestion={() =>
              router.push(
                question === percentageQuestions.length - 1
                  ? "/play/percentages/complete"
                  : `/play/percentages/${question + 2}`,
              )
            }
          />
        </div>
      )}
      <Link className="text-button screen-link" href="/learn/percentages">
        ← Revisit the percentage lesson
      </Link>
    </section>
  );
}
