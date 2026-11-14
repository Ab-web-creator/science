import type { LearningState } from "@/hooks/use-learning";

export function DivisionPaper(state: LearningState) {
  const { example, ex, step, chunks } = state;
  const { big, left, small, rest, groups } = chunks;
  return (
    <section className="paper-panel chunk-paper">
      <div className="flex items-center justify-between">
        <span className="eyebrow">KOLOMSGEWIJS DELEN</span>
        <span className="paper-badge">Example {example + 1} / 5</span>
      </div>
      <div className="multiples-strip">
        Handy facts: 1 × {ex.d} = {ex.d} · 10 × {ex.d} = {10 * ex.d}
      </div>
      <div
        className="chunk-calculation"
        aria-label={`${ex.n} divided by ${ex.d} using chunks, step ${step + 1}`}
      >
        <div className="chunk-heading">
          {ex.n} : {ex.d} ={" "}
          {step >= 5 ? `${groups}${rest ? ` rest ${rest}` : ""}` : "?"}
        </div>
        <div className="chunk-row">
          <span>{ex.n}</span>
          <small>starting number</small>
        </div>
        <div
          className={`chunk-row subtraction ${step >= 1 ? "reveal" : "invisible"}`}
        >
          <span>−{big * ex.d}</span>
          <small>
            {big} × {ex.d}
            <b>{big} groups</b>
          </small>
        </div>
        <div className={`chunk-row ${step >= 2 ? "reveal" : "invisible"}`}>
          <span>{left}</span>
          <small>left over</small>
        </div>
        {small > 0 ? (
          <>
            <div
              className={`chunk-row subtraction ${step >= 3 ? "reveal" : "invisible"}`}
            >
              <span>−{small * ex.d}</span>
              <small>
                {small} × {ex.d}
                <b>{small} groups</b>
              </small>
            </div>
            <div className={`chunk-row ${step >= 4 ? "reveal" : "invisible"}`}>
              <span>{rest}</span>
              <small>{rest ? "rest" : "nothing left"}</small>
            </div>
          </>
        ) : (
          <div className={`rest-note ${step >= 3 ? "reveal" : "invisible"}`}>
            {rest} &lt; {ex.d}: stop here. Rest {rest}.
          </div>
        )}
        <div className={`chunk-total ${step >= 5 ? "reveal" : "invisible"}`}>
          {big}
          {small ? ` + ${small}` : ""} = {groups} groups
        </div>
      </div>
      {step === 6 && (
        <div className="answer-check reveal">
          ✓ {groups} × {ex.d}
          {rest ? ` + ${rest}` : ""} = {ex.n}
        </div>
      )}
      <div className="paper-tip">
        ✎ Keep whole numbers aligned. Count the groups at the side.
      </div>
    </section>
  );
}
