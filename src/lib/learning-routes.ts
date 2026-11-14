import { examples, questions } from "./division";

export type LearningTab = "home" | "lesson" | "game";

export const tabPaths: Record<LearningTab, string> = {
  home: "/",
  lesson: "/learn",
  game: "/play",
};

export function lessonPath(example: number, step = 0) {
  return `/learn/division/${examples[example].n}/${step + 1}`;
}

export function challengePath(question: number) {
  return question >= questions.length
    ? "/play/division/complete"
    : `/play/division/${question + 1}`;
}

export function readLearningRoute(pathname: string) {
  const lesson = pathname.match(/^\/learn\/division\/(\d+)\/([1-7])$/);
  const challenge = pathname.match(/^\/play\/division\/(\d+|complete)$/);
  const example = lesson
    ? examples.findIndex((ex) => String(ex.n) === lesson[1])
    : 0;
  return {
    tab: (pathname === "/learn" || pathname.startsWith("/learn/")
      ? "lesson"
      : pathname === "/play" || pathname.startsWith("/play/")
        ? "game"
        : "home") as LearningTab,
    example: Math.max(0, example),
    step: lesson ? Number(lesson[2]) - 1 : 0,
    question: challenge
      ? challenge[1] === "complete"
        ? questions.length
        : Number(challenge[1]) - 1
      : 0,
    isExample: !!lesson && example !== -1,
  };
}
