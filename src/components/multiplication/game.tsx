"use client";
import Link from "next/link";
import { useQuietRouter } from "@/hooks/use-quiet-router";
import { useLearning } from "@/hooks/use-learning";
import { multiplicationQuestions } from "@/lib/multiplication";
import { GameQuestion } from "@/components/learning/game-question";
import { GameAutoplay } from "@/components/learning/game-autoplay";
import { StarCount } from "@/components/learning/star-count";
import { StarSummary } from "@/components/learning/star-summary";
import { Robot } from "@/components/learning/robot";

export function MultiplicationGame({ challenge }: { challenge: string }) {
  const router = useQuietRouter();
  const { multiplicationPractice, voiceAvailable, speak } = useLearning();
  const complete = challenge === "complete";
  const question = complete ? 0 : Number(challenge) - 1;
  const { gold, silver, resetPractice, ...practice } = multiplicationPractice;
  return (
    <section className="screen-page game-screen">
      <div className="section-title">
        <h1 className="inner-title">
          Multiplication <span className="serif-word">mission.</span>
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
            <StarSummary gold={gold} silver={silver} topic="multiplication" />
            <br />
            Try 35 × 4 on paper next.
          </p>
          <details>
            <summary>Check your answer</summary>
            <p>30 × 4 = 120. 5 × 4 = 20. Add: 120 + 20 = 140.</p>
          </details>
          <button
            className="button primary mt-6"
            onClick={() => {
              resetPractice();
              router.push("/play/multiplication/1");
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
            q={multiplicationQuestions[question]}
            voiceAvailable={voiceAvailable}
            speak={speak}
            operator="×"
            totalQuestions={multiplicationQuestions.length}
            nextQuestion={() =>
              router.push(
                question === multiplicationQuestions.length - 1
                  ? "/play/multiplication/complete"
                  : `/play/multiplication/${question + 2}`,
              )
            }
          />
        </div>
      )}
      <Link className="text-button screen-link" href="/learn/multiplication">
        ← Revisit the multiplication lesson
      </Link>
    </section>
  );
}
