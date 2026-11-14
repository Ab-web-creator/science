"use client";
import Link from "next/link";
import { useQuietRouter } from "@/hooks/use-quiet-router";
import { useLearning } from "@/hooks/use-learning";
import { multiplicationQuestions } from "@/lib/multiplication";
import { GameQuestion } from "@/components/learning/game-question";
import { Robot } from "@/components/learning/robot";

export function MultiplicationGame({ challenge }: { challenge: string }) {
  const router = useQuietRouter();
  const { multiplicationPractice, voiceAvailable, speak } = useLearning();
  const complete = challenge === "complete";
  const question = complete ? 0 : Number(challenge) - 1;
  const { stars, resetPractice, ...practice } = multiplicationPractice;
  return (
    <section className="screen-page game-screen">
      <div className="section-title">
        <h1 className="inner-title">
          Multiplication <span className="serif-word">mission.</span>
        </h1>
        <span className="score-pill">✦ {stars} stars</span>
      </div>
      {complete ? (
        <section className="finish-card">
          <Robot />
          <div className="eyebrow">MISSION COMPLETE</div>
          <h2>You did it, Azat Sa!</h2>
          <p>
            You earned {stars} multiplication stars.
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
