/** "✦ 5 ✧ 2": gold stars (right first time) and silver stars (kept trying). */
export function StarCount({
  gold,
  silver,
  words = false,
}: {
  gold: number;
  silver: number;
  /** Also say "gold"/"silver" (for the bigger score pill). */
  words?: boolean;
}) {
  return (
    <span
      className="star-count-pair"
      aria-label={`${gold} gold ${gold === 1 ? "star" : "stars"}, ${silver} silver ${silver === 1 ? "star" : "stars"}`}
    >
      <span className="star-gold">
        ✦ {gold}
        {words && " gold"}
      </span>
      {silver > 0 && (
        <span className="star-silver">
          ✧ {silver}
          {words && " silver"}
        </span>
      )}
    </span>
  );
}
