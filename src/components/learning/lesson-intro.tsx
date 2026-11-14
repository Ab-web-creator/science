import type { LearningState } from "@/hooks/use-learning";

export function LessonIntro(
  state: LearningState & {
    feeding: boolean;
    onFeed: () => void;
    onBack: () => void;
    feedVoice: boolean;
    onToggleFeedVoice: () => void;
  },
) {
  const { voiceAvailable, ex, example, feeding, onFeed } = state;
  // Same button, same place: in Feed Orbit it reads Orbit's messages aloud.
  const playing = feeding ? state.feedVoice : state.playing;
  const toggleAutoplay = feeding
    ? state.onToggleFeedVoice
    : state.toggleAutoplay;
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
        <div className="lesson-heading-actions">
          {/* Same spot for going into Feed Orbit and back out again. */}
          {feeding ? (
            <button className="button secondary" onClick={state.onBack}>
              ← Back to the steps
            </button>
          ) : (
            <button className="button primary feed-button" onClick={onFeed}>
              😋 Feed Orbit
            </button>
          )}
          <button
            className={`button secondary ${playing ? "voice-on" : ""}`}
            disabled={!voiceAvailable}
            onClick={toggleAutoplay}
            aria-pressed={playing}
          >
            {playing ? "Ⅱ Pause" : "▶ Auto-play"}
          </button>
        </div>
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
