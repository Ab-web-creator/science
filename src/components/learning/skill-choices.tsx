import Link from "next/link";
import { SkillPlaceholders } from "./skill-placeholders";

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
        </div>
        <b aria-hidden="true">→</b>
      </Link>
      {placeholders && <SkillPlaceholders />}
    </div>
  );
}
