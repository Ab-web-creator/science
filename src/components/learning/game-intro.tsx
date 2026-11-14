import type { LearningState } from "@/hooks/use-learning";
import { GameAutoplay } from "./game-autoplay";
import { StarCount } from "./star-count";
export function GameIntro(state: LearningState) {
  const { gold, silver } = state;
  return (
    <>
      {" "}
      <div className="section-title">
        <div>
          <h1 className="inner-title">
            Your turn, <span className="serif-word">Azat.</span>
          </h1>
        </div>
        <div className="game-heading-actions">
          <span className="score-pill">
            <StarCount gold={gold} silver={silver} words />
          </span>
          <GameAutoplay />
        </div>
      </div>
    </>
  );
}
