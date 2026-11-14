import Link from "next/link";
import { CardBrowser } from "@/components/learning/card-browser";
import { percentageExamples, percentagePath } from "@/lib/percentages";
export const metadata = { title: "Learn percentages | Little Orbit" };
export default function PercentageOverview() {
  return (
    <section className="screen-page menu-screen">
      <div className="eyebrow">PERCENTAGES · PROCENTEN</div>
      <h1 className="inner-title">
        Find a share. <span className="serif-word">Make it click.</span>
      </h1>
      <p className="page-intro">
        Start with halves and tenths. Build other percentages from there.
      </p>
      <CardBrowser
        multiple
        label="Percentage examples"
        items={percentageExamples.map((ex, i) => ({
          href: percentagePath(i),
          number: i + 1,
          equation: `${ex.a}% of ${ex.b}`,
          title: ex.title,
          description: "Four steps, with a picture of 100 equal parts.",
          icon: ex.icon,
          recommended: i === 0,
          action: `Start example ${i + 1}`,
        }))}
      />
      <Link className="text-button screen-link" href="/play/percentages">
        Ready for the percentages game? →
      </Link>
    </section>
  );
}
