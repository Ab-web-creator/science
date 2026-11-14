import Link from "next/link";
import { CardBrowser } from "@/components/learning/card-browser";
import {
  multiplicationExamples,
  multiplicationPath,
} from "@/lib/multiplication";
export const metadata = { title: "Learn multiplication | Little Orbit" };
export default function MultiplicationOverview() {
  return (
    <section className="screen-page menu-screen">
      <div className="eyebrow">MULTIPLICATION · VERMENIGVULDIGEN</div>
      <h1 className="inner-title">
        Split it. Multiply it. <span className="serif-word">Add it.</span>
      </h1>
      <p className="page-intro">
        Five examples. Four little steps for each one.
      </p>
      <CardBrowser
        multiple
        label="Multiplication examples"
        items={multiplicationExamples.map((ex, i) => ({
          href: multiplicationPath(i),
          number: i + 1,
          equation: `${ex.a} × ${ex.b}`,
          title: ex.title,
          description: `${ex.b} equal groups of ${ex.a}. Let’s find the total.`,
          icon: ex.icon,
          recommended: i === 0,
          action: `Start example ${i + 1}`,
        }))}
      />
      <Link className="text-button screen-link" href="/play/multiplication">
        Ready for the multiplication game? →
      </Link>
    </section>
  );
}
