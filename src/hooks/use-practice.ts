"use client";
import { useState } from "react";
import { questions } from "@/lib/division";

type Attempt = { selected: number; solved: boolean };

export function usePractice(
  question: number,
  answerKey: readonly { answer: number }[] = questions,
) {
  const [attempts, setAttempts] = useState<Record<number, Attempt>>({});
  const [hints, setHints] = useState<Record<number, boolean>>({});
  const attempt = attempts[question];
  function answerQuestion(option: number) {
    setAttempts((previous) => {
      if (previous[question]?.solved) return previous;
      return {
        ...previous,
        [question]: {
          selected: option,
          solved: option === answerKey[question].answer,
        },
      };
    });
  }
  function resetPractice() {
    setAttempts({});
    setHints({});
  }
  return {
    selected: attempt?.selected ?? null,
    solved: attempt?.solved ?? false,
    hint: hints[question] ?? false,
    stars: Object.values(attempts).filter((attempt) => attempt.solved).length,
    setHint: (value: boolean) =>
      setHints((previous) => ({ ...previous, [question]: value })),
    answerQuestion,
    resetPractice,
  };
}
