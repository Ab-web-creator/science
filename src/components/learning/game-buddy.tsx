import type { LearningState } from "@/hooks/use-learning";
import { Robot } from "./robot";
export function GameBuddy(state: LearningState) {
  const { navigate } = state;
  return (
    <aside className="game-buddy">
      <Robot />
      <h3>
        You’ve got a good brain.
        <br />
        Let’s give it a little stretch.
      </h3>
      <p>
        Grab paper and a pencil if you like.
        <br />
        There’s no timer here.
      </p>
      <div className="mini-reminder">
        <b>Your four little steps</b>
        <p>
          1. Choose a chunk (hap)
          <br />
          2. Subtract (aftrekken)
          <br />
          3. Repeat until less than the divisor
          <br />
          4. Add groups (optellen)
        </p>
      </div>
      <button className="text-button" onClick={() => navigate("lesson")}>
        ← Revisit the lesson
      </button>
    </aside>
  );
}
