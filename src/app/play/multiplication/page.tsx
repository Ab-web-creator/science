import Link from "next/link";
import { CardBrowser } from "@/components/learning/card-browser";
import { multiplicationQuestions } from "@/lib/multiplication";
export const metadata = { title: "Multiplication practice | Little Orbit" };
const titles = [
  "Split the number",
  "Multiply the tens",
  "Multiply the ones",
  "Add the parts",
  "Your first full problem",
  "The final challenge",
];
export default function MultiplicationPractice() {
  return (
    <section className="screen-page menu-screen">
      <div className="eyebrow">MULTIPLICATION PLANET</div>
      <h1 className="inner-title">
        Make your numbers <span className="serif-word">grow.</span>
      </h1>
      <p className="page-intro">
        Start with challenge 1. Hints are here if you need them.
      </p>
      <CardBrowser
        multiple
        label="Multiplication challenges"
        items={multiplicationQuestions.map((q, i) => ({
          href: `/play/multiplication/${i + 1}`,
          number: i + 1,
          equation: `${q.n} × ${q.d}`,
          title: titles[i],
          description: "Think it through. Try an answer. Collect a star.",
          icon: "🚀",
          recommended: i === 0,
          kind: "Challenge",
          action: `Play challenge ${i + 1}`,
        }))}
      />
      <Link className="text-button screen-link" href="/learn/multiplication">
        Learn the steps first →
      </Link>
    </section>
  );
}
