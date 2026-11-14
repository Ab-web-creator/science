import Link from "next/link";
import { examples } from "@/lib/division";
import { lessonPath } from "@/lib/learning-routes";
import { CardBrowser } from "@/components/learning/card-browser";

export const metadata = { title: "Choose a division adventure | Little Orbit" };
const icons = ["⭐", "🌙", "🥨", "💎", "🚀"];
const titles = [
  "Let’s learn the first steps",
  "Try a bigger chunk",
  "Meet a new divisor",
  "Know when to stop",
  "Find what’s left over",
];

export default function DivisionOverview() {
  return (
    <section className="screen-page menu-screen">
      <div className="eyebrow mb-3">LEARN TO DIVIDE · HAPMETHODE</div>
      <h1 className="inner-title">
        Pick an example, <span className="serif-word">Azat Sa.</span>
      </h1>
      <p className="page-intro">Pick a card. Let’s solve it together.</p>
      <CardBrowser
        multiple
        label="Example cards"
        items={examples.map((ex, i) => ({
          href: lessonPath(i),
          number: i + 1,
          equation: `${ex.n} : ${ex.d}`,
          title: titles[i],
          description: ex.story,
          icon: icons[i],
          recommended: i === 0,
          action: `Start example ${i + 1}`,
        }))}
      />
      <Link className="text-button screen-link" href="/play/division">
        Ready to play? Go to practice →
      </Link>
    </section>
  );
}
