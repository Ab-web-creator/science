"use client";
import { createContext, useContext } from "react";
import type { LearningState } from "./use-learning-controller";

export type { LearningState } from "./use-learning-controller";
export const LearningContext = createContext<LearningState | null>(null);

export function useLearning() {
  const state = useContext(LearningContext);
  if (!state)
    throw new Error("Learning components must be inside LearningProvider");
  return state;
}
