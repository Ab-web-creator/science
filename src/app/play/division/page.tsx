import Link from "next/link";
import { questions } from "@/lib/division";
import { CardBrowser } from "@/components/learning/card-browser";

export const metadata = { title: "Practice planet | Little Orbit" };
const titles = [
  "Choose a chunk",
  "Subtract the chunk",
  "Find the next groups",
  "Add your groups",
  "Try a whole problem",
  "Take a bigger leap",
  "Find the rest",
];

export default function PracticeOverview() {
  return (
    <section className="screen-page menu-screen">
      <div className="eyebrow mb-3">PRACTICE PLANET</div>
      <h1 className="inner-title">
        Let’s play, <span className="serif-word">Azat Sa.</span>
      </h1>
      <p className="page-intro">
        Start with challenge 1. You can use paper, ask for a hint, and try
        again.
      </p>
      <CardBrowser
        label="Challenge cards"
        items={questions.map((q, i) => ({
          href: `/play/division/${i + 1}`,
          number: i + 1,
          equation: `${q.n} : ${q.d}`,
          title: titles[i],
          description:
            i < 4
              ? "Follow the chunks, one step at a time."
              : "Try it yourself. You can always ask for a hint.",
          icon: i < 4 ? "🪐" : "🚀",
          recommended: i === 0,
          kind: "Challenge",
          action: `Play challenge ${i + 1}`,
        }))}
      />
      <Link className="text-button screen-link" href="/learn/division">
        Want to learn first? See examples →
      </Link>
    </section>
  );
}
