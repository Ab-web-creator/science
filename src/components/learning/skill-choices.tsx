import Link from "next/link";
import { SkillPlaceholders } from "./skill-placeholders";
import { StarRow } from "./star-row";
import { games } from "@/lib/challenges";

export function SkillChoices({
  mode = "learn",
  placeholders = false,
}: {
  mode?: "learn" | "play";
  placeholders?: boolean;
}) {
  return (
    <div className="home-choices">
      <Link href={`/${mode}/division`} className="home-choice">
        <span aria-hidden="true">÷</span>
        <div>
          <h2>{mode === "learn" ? "Learn to divide" : "Division game"}</h2>
          <p>
            {mode === "learn"
              ? "Take chunks. Count the groups."
              : "Solve challenges and collect stars."}
          </p>
          {mode === "play" && <GameStars game="division" />}
        </div>
        <b aria-hidden="true">→</b>
      </Link>
      <Link href={`/${mode}/multiplication`} className="home-choice">
        <span aria-hidden="true">×</span>
        <div>
          <h2>
            {mode === "learn" ? "Learn to multiply" : "Multiplication game"}
          </h2>
          <p>
            {mode === "learn"
              ? "Split numbers. Multiply the parts."
              : "Build your answer, one part at a time."}
          </p>
          {mode === "play" && <GameStars game="multiplication" />}
        </div>
        <b aria-hidden="true">→</b>
      </Link>
      <Link href={`/${mode}/percentages`} className="home-choice">
        <span aria-hidden="true">%</span>
        <div>
          <h2>{mode === "learn" ? "Find percentages" : "Percentages game"}</h2>
          <p>
            {mode === "learn"
              ? "Find a share of any amount."
              : "Work out shares and discounts."}
          </p>
          {mode === "play" && <GameStars game="percentages" />}
        </div>
        <b aria-hidden="true">→</b>
      </Link>
      {placeholders && <SkillPlaceholders />}
    </div>
  );
}

/** "Turn all your stars gold!": the row of stars for one game. */
function GameStars({ game }: { game: string }) {
  const g = games.find((x) => x.game === game);
  return g ? <StarRow storageKey={g.storageKey} count={g.count} /> : null;
}
