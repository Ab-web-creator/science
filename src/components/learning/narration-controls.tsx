"use client";
import { useLearning } from "@/hooks/use-learning";

export function NarrationControls({
  text,
  compact = false,
  onRead,
}: {
  text: string;
  compact?: boolean;
  /** Custom reader, e.g. one that highlights the paper while it talks. */
  onRead?: () => void;
}) {
  const { voiceAvailable, speak } = useLearning();
  return (
    <div className={`narration-controls ${compact ? "compact" : ""}`}>
      <button
        className="text-button"
        disabled={!voiceAvailable}
        onClick={() => (onRead ? onRead() : speak(text))}
      >
        {compact ? "♫ Listen" : "♫ Read this step to me"}
      </button>
    </div>
  );
}
