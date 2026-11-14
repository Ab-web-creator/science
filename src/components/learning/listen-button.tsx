"use client";
import { useLearning } from "@/hooks/use-learning";

/** A small "Listen" button that lives inside the bubble it reads aloud. */
export function ListenButton({
  text,
  onRead,
}: {
  text: string;
  onRead?: () => void;
}) {
  const { voiceAvailable, speak } = useLearning();
  if (!voiceAvailable) return null;
  return (
    <button
      type="button"
      className="bubble-listen"
      onClick={() => (onRead ? onRead() : speak(text))}
      aria-label="Read Orbit’s words aloud"
    >
      🔊 Listen
    </button>
  );
}
