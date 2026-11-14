import Link from "next/link";
import { CardBrowser } from "@/components/learning/card-browser";
import { percentageQuestions } from "@/lib/percentages";
export const metadata = { title: "Percentage practice | Little Orbit" };
const titles = [
  "Find half",
  "Find a tenth",
  "Find a quarter",
  "Double 10%",
  "Combine 10% and 5%",
  "Work out a discount",
];
export default function PercentagePractice() {
  return (
    <section className="screen-page menu-screen">
      <div className="eyebrow">PERCENTAGE PLANET</div>
      <h1 className="inner-title">
        What’s your <span className="serif-word">share?</span>
      </h1>
      <p className="page-intro">
        Six challenges. Start with the first or revisit a skill.
      </p>
      <CardBrowser
        multiple
        label="Percentage challenges"
        items={percentageQuestions.map((q, i) => ({
          href: `/play/percentages/${i + 1}`,
          number: i + 1,
          equation: `${q.n}% of ${q.d}`,
          title: titles[i],
          description: "Try an answer. Ask for a hint whenever you need one.",
          icon: "%",
          recommended: i === 0,
          kind: "Challenge",
          action: `Play challenge ${i + 1}`,
        }))}
      />
      <Link className="text-button screen-link" href="/learn/percentages">
        Learn the steps first →
      </Link>
    </section>
  );
}
