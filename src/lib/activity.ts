/** Daily practice log: what was solved each day, today's mission, the streak
 *  and a weekly summary for grown-ups. Pure helpers, so they can be tested. */
export type Star = "gold" | "silver";
export type Activity = {
  /** day ("2026-11-14") → challenge id ("division:3") → best star that day */
  days: Record<string, Record<string, Star>>;
  /** day → the 3 challenge ids picked as that day's mission */
  missions: Record<string, string[]>;
};
export const emptyActivity: Activity = { days: {}, missions: {} };
export const MISSION_SIZE = 3;

/** Local calendar day as "YYYY-MM-DD". */
export function dayKey(date = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}
export function addDays(day: string, n: number) {
  const [y, m, d] = day.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}

export function recordSolve(
  a: Activity,
  day: string,
  id: string,
  star: Star,
): Activity {
  const today = a.days[day] ?? {};
  const best: Star =
    today[id] === "gold" || star === "gold" ? "gold" : "silver";
  return { ...a, days: { ...a.days, [day]: { ...today, [id]: best } } };
}

/** A fixed, date-based shuffle: the same day always gives the same order. */
function seeded(list: string[], day: string) {
  let h = 0;
  for (const c of day) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return list
    .map((id) => {
      h = (h * 1103515245 + 12345) >>> 0;
      return { id, r: h };
    })
    .sort((x, y) => x.r - y.r)
    .map((x) => x.id);
}

/** Pick today's mission: challenges that are not gold yet come first. */
export function pickMission(all: string[], gold: Set<string>, day: string) {
  const order = seeded(all, day);
  return [
    ...order.filter((id) => !gold.has(id)),
    ...order.filter((id) => gold.has(id)),
  ].slice(0, MISSION_SIZE);
}

export function missionDone(a: Activity, day: string) {
  const mission = a.missions[day];
  const solved = a.days[day] ?? {};
  return !!mission?.length && mission.every((id) => solved[id]);
}

/** Days in a row with the mission done. Today still counts as "in progress":
 *  if today is not done yet, the streak runs up to yesterday. */
export function streak(a: Activity, today: string) {
  let day = missionDone(a, today) ? today : addDays(today, -1);
  let count = 0;
  while (missionDone(a, day)) {
    count++;
    day = addDays(day, -1);
  }
  return count;
}

/** The last 7 days: stars earned and days practised. */
export function weekSummary(a: Activity, today: string) {
  let gold = 0;
  let silver = 0;
  let days = 0;
  for (let i = 0; i < 7; i++) {
    const solved = Object.values(a.days[addDays(today, -i)] ?? {});
    if (solved.length) days++;
    gold += solved.filter((s) => s === "gold").length;
    silver += solved.filter((s) => s === "silver").length;
  }
  return { gold, silver, days };
}
