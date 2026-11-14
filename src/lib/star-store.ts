/** Best star per challenge, saved in this browser so it survives a reload. */
export type Star = "gold" | "silver";
export type Stars = Record<number, Star>;

const listeners = new Set<() => void>();
const empty: Stars = {};
const cache = new Map<string, { raw: string | null; value: Stars }>();

function read(key: string): Stars {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    /* Storage unavailable: stars live for this visit only. */
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value;
  let value = empty;
  try {
    value = raw ? (JSON.parse(raw) as Stars) : empty;
  } catch {
    value = empty;
  }
  cache.set(key, { raw, value });
  return value;
}

/** The better of two results: gold beats silver. */
export function betterStar(old: Star | undefined, next: Star): Star {
  return old === "gold" || next === "gold" ? "gold" : "silver";
}

export const starStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get: read,
  /** Server render: no stars yet (the browser fills them in). */
  getServer: () => empty,
  award(key: string, question: number, star: Star) {
    const current = read(key);
    const best = betterStar(current[question], star);
    if (current[question] === best) return;
    const next = { ...current, [question]: best };
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      cache.set(key, { raw: JSON.stringify(next), value: next });
    }
    listeners.forEach((l) => l());
  },
};

export function countStars(stars: Stars) {
  const values = Object.values(stars);
  return {
    gold: values.filter((s) => s === "gold").length,
    silver: values.filter((s) => s === "silver").length,
  };
}
