import { questions } from "./division";
import { multiplicationQuestions } from "./multiplication";
import { percentageQuestions } from "./percentages";

/** Every Play challenge, so missions and star rows can refer to them by id. */
export type Game = "division" | "multiplication" | "percentages";
export const games: {
  game: Game;
  title: string;
  icon: string;
  storageKey: string;
  count: number;
}[] = [
  {
    game: "division",
    title: "Division",
    icon: "÷",
    storageKey: "little-orbit-stars-division",
    count: questions.length,
  },
  {
    game: "multiplication",
    title: "Multiplication",
    icon: "×",
    storageKey: "little-orbit-stars-multiplication",
    count: multiplicationQuestions.length,
  },
  {
    game: "percentages",
    title: "Percentages",
    icon: "%",
    storageKey: "little-orbit-stars-percentages",
    count: percentageQuestions.length,
  },
];

export type Challenge = {
  id: string;
  game: Game;
  index: number;
  href: string;
  label: string;
  icon: string;
};

export const challenges: Challenge[] = [
  ...questions.map((q, i) => ({
    id: `division:${i}`,
    game: "division" as Game,
    index: i,
    href: `/play/division/${i + 1}`,
    label: q.title ?? `${q.n} : ${q.d}`,
    icon: "÷",
  })),
  ...multiplicationQuestions.map((q, i) => ({
    id: `multiplication:${i}`,
    game: "multiplication" as Game,
    index: i,
    href: `/play/multiplication/${i + 1}`,
    label: `${q.n} × ${q.d}`,
    icon: "×",
  })),
  ...percentageQuestions.map((q, i) => ({
    id: `percentages:${i}`,
    game: "percentages" as Game,
    index: i,
    href: `/play/percentages/${i + 1}`,
    label: `${q.n}% of ${q.d}`,
    icon: "%",
  })),
];

/** Store key for a game's stars, from its storage key ("little-orbit-stars-division"). */
export function gameFromStorageKey(key: string): Game {
  return (games.find((g) => g.storageKey === key)?.game ?? "division") as Game;
}
