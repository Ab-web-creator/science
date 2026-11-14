"use client";
import type { ReactNode } from "react";
import { LearningContext } from "@/hooks/use-learning";
import { useLearningController } from "@/hooks/use-learning-controller";
import { Header } from "./header";

export function LearningProvider({ children }: { children: ReactNode }) {
  const state = useLearningController();
  return (
    <LearningContext.Provider value={state}>
      <div className="app-shell">
        <Header {...state} />
        <main className="app-main">{children}</main>
      </div>
    </LearningContext.Provider>
  );
}
