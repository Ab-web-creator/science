import { multiplicationParts } from "@/lib/multiplication";
export function MultiplicationBoard({
  a,
  b,
  step,
}: {
  a: number;
  b: number;
  step: number;
}) {
  const { tens, ones, tensProduct, onesProduct, total } = multiplicationParts(
    a,
    b,
  );
  return (
    <section className="paper-panel multiplication-board">
      <div className="eyebrow">SPLIT THE NUMBER · SPLITSEN</div>
      <p className="multiply-split">
        {a} = <b>{tens}</b> + <b>{ones}</b>
      </p>
      <p className="multiply-caption">
        {b} groups of {a}. Two easier parts:
      </p>
      <div
        className="multiply-parts"
        aria-label={`${b} groups, each split into ${tens} and ${ones}`}
      >
        <div>
          <span>TENS</span>
          <h3>
            {tens} × {b}
          </h3>
          <strong className={step >= 1 ? "reveal" : ""}>
            {step >= 1 ? tensProduct : "?"}
          </strong>
        </div>
        <div>
          <span>ONES</span>
          <h3>
            {ones} × {b}
          </h3>
          <strong className={step >= 2 ? "reveal" : ""}>
            {step >= 2 ? onesProduct : "?"}
          </strong>
        </div>
      </div>
      <div className={`multiply-total ${step >= 3 ? "reveal" : ""}`}>
        {step >= 3 ? (
          <>
            {tensProduct} + {onesProduct} = <b>{total}</b>
          </>
        ) : (
          "Multiply each part, then add."
        )}
      </div>
      <p className="multiply-caption">✎ Write each part on its own line.</p>
    </section>
  );
}
