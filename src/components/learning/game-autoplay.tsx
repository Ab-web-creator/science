"use client";
import { useLearning } from "@/hooks/use-learning";

/** Auto-play for the Play games, in the usual top-right spot. */
export function GameAutoplay() {
  const { gameAutoplay, setGameAutoplay, voiceAvailable, narration } =
    useLearning();
  return (
    <button
      className={`button secondary ${gameAutoplay ? "voice-on" : ""}`}
      disabled={!voiceAvailable}
      aria-pressed={gameAutoplay}
      onClick={() => {
        if (gameAutoplay) narration.stopSpeaking();
        setGameAutoplay(!gameAutoplay);
      }}
    >
      {gameAutoplay ? "Ⅱ Pause" : "▶ Auto-play"}
    </button>
  );
}
