import type { LearningState } from "@/hooks/use-learning";
export function GameIntro(state: LearningState) {
  const { stars } = state;
  return (
    <>
      {" "}
      <div className="section-title">
        <div>
          <h1 className="inner-title">
            Your turn, <span className="serif-word">star explorer.</span>
          </h1>
        </div>
        <span className="score-pill">✦ {stars} stars</span>
      </div>
    </>
  );
}
