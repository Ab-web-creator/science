import type { LearningState } from "@/hooks/use-learning";
import { Robot } from "./robot";
export function LessonNotes(state: LearningState) {
  const { navigate } = state;
  return (
    <>
      <div className="lesson-bottom">
        <Robot small />
        <p>
          <b>Orbit’s tip</b>
          <br />
          Any chunk that fits is a good start. Try 10 groups first. You can take
          several smaller chunks and still get the same answer!
        </p>
        <button className="button secondary" onClick={() => navigate("game")}>
          Ready to try? ↗
        </button>
      </div>
      <details className="parent-note">
        <summary>For your grown-up: how to help</summary>
        <p>
          This lesson uses kolomsgewijs delen: subtract whole-number multiples
          (happen), then add the group counts. Start with 10 groups at a time;
          take larger chunks when comfortable. Let Azat explain what each chunk
          means. A rest must be smaller than the divisor. Dutch schools can use
          different layouts and methods, so match his teacher’s notation when
          available. Try one example together, then let him lead the next.
        </p>
        <a
          href="https://www.slo.nl/thema/meer/tule/rekenen-wiskunde/kerndoel-30/?mode=toelichting-en-verantwoording"
          target="_blank"
          rel="noreferrer"
        >
          Dutch curriculum context: SLO ↗
        </a>
      </details>
    </>
  );
}
