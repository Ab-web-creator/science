import type { LearningState } from "@/hooks/use-learning";

export function LessonIntro(state: LearningState) {
  const { playing, voiceAvailable, toggleAutoplay, ex, example } = state;
  return (
    <>
      <div className="section-title lesson-heading">
        <div>
          <div className="eyebrow mb-3">
            EXAMPLE {example + 1} OF 5 · HAPMETHODE
          </div>
          <h1 className="inner-title">
            Let’s solve{" "}
            <span className="serif-word">
              {ex.n} : {ex.d}
            </span>
          </h1>
        </div>
        <button
          className={`button secondary ${playing ? "voice-on" : ""}`}
          disabled={!voiceAvailable}
          onClick={toggleAutoplay}
          aria-pressed={playing}
        >
          {playing ? "Ⅱ Pause" : "▶ Auto-play"}
        </button>
      </div>
      {!voiceAvailable && (
        <p className="muted mb-4">
          Read-aloud is unavailable in this browser. You can read every step
          below.
        </p>
      )}
    </>
  );
}
