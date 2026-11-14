"use client";
import { useEffect } from "react";
import { useLearning } from "./use-learning";

/** Silence between an interrupted voice and Orbit's next answer. */
const INTERRUPT_PAUSE_MS = 600;

/**
 * Orbit's voice in Feed Orbit. With Auto-play on, each new message is read
 * aloud. The child may tap again at any time: the old voice stops at once,
 * then after a short pause Orbit answers the new tap, so voices never mix.
 * `tries` makes a repeated message (e.g. "too big" twice) be read again.
 */
export function useOrbitVoice(
  message: string,
  tries: number,
  autoRead: boolean,
) {
  const { speak, narration } = useLearning();
  const { stopSpeaking } = narration;
  useEffect(() => {
    if (!autoRead) return;
    const timer = setTimeout(() => speak(message), INTERRUPT_PAUSE_MS);
    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [autoRead, message, tries, speak, stopSpeaking]);
}
