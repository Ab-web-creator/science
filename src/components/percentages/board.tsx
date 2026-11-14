import { percentageParts } from "@/lib/percentages";
export function PercentageBoard({
  example,
  step,
}: {
  example: number;
  step: number;
}) {
  const { percent, whole, base, baseValue, total } = percentageParts(example);
  const filled = step === 0 ? 0 : step === 1 ? base : percent;
  return (
    <section className="paper-panel percentage-board">
      <div className="eyebrow">100 EQUAL PARTS · PROCENTEN</div>
      <p className="percentage-whole">
        100% = the whole <b>{whole}</b>
      </p>
      <div
        className="percent-grid"
        role="img"
        aria-label={`${filled} of 100 equal squares shaded: ${filled}%. The whole represents ${whole}.`}
      >
        {Array.from({ length: 100 }, (_, i) => (
          <span
            aria-hidden="true"
            key={i}
            className={
              i < filled ? (i < base ? "percent-filled" : "percent-extra") : ""
            }
            style={{ animationDelay: `${i * 4}ms` }}
          />
        ))}
      </div>
      <p className="percentage-caption">
        {step === 0
          ? "Each square is 1% of the whole."
          : `${filled} out of 100 squares = ${filled}%`}
      </p>
      <div className="percentage-result" key={`${example}-${step}`}>
        {step === 0
          ? `Find ${percent}% of ${whole}`
          : step === 1
            ? `${base}% of ${whole} = ${baseValue}`
            : `${percent}% of ${whole} = ${total}`}
      </div>
    </section>
  );
}
