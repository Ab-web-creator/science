/** End-of-game message: what was earned, and how silver can become gold. */
export function StarSummary({
  gold,
  silver,
  topic,
}: {
  gold: number;
  silver: number;
  topic: string;
}) {
  return (
    <>
      You have ✦ {gold} gold and ✧ {silver} silver {topic}{" "}
      {gold + silver === 1 ? "star" : "stars"}.
      {silver > 0 && (
        <>
          <br />
          Play again and get them right the first time to turn silver into gold!
        </>
      )}
    </>
  );
}
