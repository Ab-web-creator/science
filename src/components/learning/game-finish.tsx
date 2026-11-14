import type { LearningState } from "@/hooks/use-learning";
import { Robot } from "./robot";
import { StarSummary } from "./star-summary";
export function GameFinish(state: LearningState) {
  const { divisionStars, restartGame } = state;
  return (
    <section className="finish-card">
      <Robot />
      <div className="eyebrow">MISSION COMPLETE</div>
      <h2>You did it, Azat Sa!</h2>
      <p>
        <StarSummary {...divisionStars} topic="division" />
        <br />
        Now try 432 : 18 on paper. Check your answer by multiplying!
      </p>
      <details>
        <summary>Check your paper answer</summary>
        <p>432 : 18 = 24, because 24 × 18 = 432.</p>
      </details>
      <button className="button primary mt-6" onClick={restartGame}>
        Play again ↻
      </button>
    </section>
  );
}
