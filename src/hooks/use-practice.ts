"use client";
import { useState, useSyncExternalStore } from "react";
import { questions } from "@/lib/division";
import { countStars, starStore } from "@/lib/star-store";
import { activityStore } from "@/lib/activity-store";
import { dayKey, recordSolve } from "@/lib/activity";
import { gameFromStorageKey } from "@/lib/challenges";

type Attempt = { selected: number; solved: boolean; firstTry: boolean };

/**
 * One Play game. Right on the first try earns a gold star; right after a
 * wrong pick earns a silver star. The best star per challenge is saved, so
 * playing again can turn silver into gold but never loses stars.
 */
export function usePractice(
  question: number,
  answerKey: readonly { answer: number }[] = questions,
  storageKey = "little-orbit-stars-division",
) {
  const [attempts, setAttempts] = useState<Record<number, Attempt>>({});
  const [hints, setHints] = useState<Record<number, boolean>>({});
  const best = useSyncExternalStore(
    starStore.subscribe,
    () => starStore.get(storageKey),
    starStore.getServer,
  );
  const attempt = attempts[question];
  function answerQuestion(option: number) {
    const previous = attempts[question];
    if (previous?.solved) return;
    const solved = option === answerKey[question].answer;
    const firstTry = !previous;
    setAttempts({
      ...attempts,
      [question]: { selected: option, solved, firstTry: firstTry && solved },
    });
    if (solved) {
      const star = firstTry ? "gold" : "silver";
      starStore.award(storageKey, question, star);
      // Log it for today's mission, the streak and the weekly summary.
      const id = `${gameFromStorageKey(storageKey)}:${question}`;
      activityStore.update((a) => recordSolve(a, dayKey(), id, star));
    }
  }
  function resetPractice() {
    setAttempts({});
    setHints({});
  }
  const { gold, silver } = countStars(best);
  return {
    selected: attempt?.selected ?? null,
    solved: attempt?.solved ?? false,
    /** True when this challenge was answered right on the first try. */
    firstTry: attempt?.firstTry ?? false,
    hint: hints[question] ?? false,
    stars: gold + silver,
    gold,
    silver,
    setHint: (value: boolean) =>
      setHints((previous) => ({ ...previous, [question]: value })),
    answerQuestion,
    resetPractice,
  };
}
