"use client";
import { useLearning } from "@/hooks/use-learning";
import { questions } from "@/lib/division";
import { GameIntro } from "./game-intro";
import { GameFinish } from "./game-finish";
import { GameQuestion } from "./game-question";

export function GameView() {
  const state = useLearning();
  return (
    <section className="screen-page game-screen">
      <GameIntro {...state} />
      {state.question >= questions.length ? (
        <GameFinish {...state} />
      ) : (
        <div className="game-layout">
          <GameQuestion {...state} />
        </div>
      )}
    </section>
  );
}
