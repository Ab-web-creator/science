"use client";
import { useLearning } from "@/hooks/use-learning";
import { VoiceSettings } from "./voice-settings";

export function NarrationControls({
  text,
  compact = false,
}: {
  text: string;
  compact?: boolean;
}) {
  const { voiceAvailable, speak } = useLearning();
  return (
    <div className={`narration-controls ${compact ? "compact" : ""}`}>
      <button
        className="text-button"
        disabled={!voiceAvailable}
        onClick={() => speak(text)}
      >
        {compact ? "♫ Listen" : "♫ Read this step to me"}
      </button>
      <VoiceSettings />
    </div>
  );
}
