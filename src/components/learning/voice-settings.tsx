"use client";
import { useId, useRef } from "react";
import { useLearning } from "@/hooks/use-learning";
import { narrationStyles, type NarrationStyle } from "@/lib/narration";

export function VoiceSettings() {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const { narration, setVoice, setPlaying } = useLearning();
  const {
    voices,
    voiceURI,
    selectedVoice,
    style,
    speed,
    chooseVoice,
    chooseStyle,
    chooseSpeed,
    speak,
    stopSpeaking,
    voiceAvailable,
  } = narration;
  function open() {
    setVoice(false);
    setPlaying(false);
    stopSpeaking();
    ref.current?.showModal();
  }
  return (
    <>
      <button
        className="voice-settings-trigger"
        aria-label="Voice settings"
        onClick={open}
        title="Choose a voice"
      >
        ⚙
      </button>
      <dialog
        ref={ref}
        className="help-dialog voice-dialog"
        aria-labelledby={id}
        onClose={stopSpeaking}
      >
        <h2 id={id}>Find a voice you like</h2>
        <p className="voice-intro">
          Try a bright, playful style or a calmer reading voice.
        </p>
        <label htmlFor={`${id}-style`}>Style</label>
        <select
          id={`${id}-style`}
          value={style}
          onChange={(e) => chooseStyle(e.target.value as NarrationStyle)}
        >
          {Object.entries(narrationStyles).map(([value, preset]) => (
            <option value={value} key={value}>
              {preset.label}
            </option>
          ))}
        </select>
        <label htmlFor={`${id}-voice`}>Voice</label>
        <select
          id={`${id}-voice`}
          value={voiceURI}
          disabled={!voices.length}
          onChange={(e) => chooseVoice(e.target.value)}
        >
          <option value="">
            Automatic
            {selectedVoice && !voiceURI ? ` — ${selectedVoice.name}` : ""}
          </option>
          {voices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name} · {voice.lang}
            </option>
          ))}
        </select>
        <label htmlFor={`${id}-speed`}>Reading speed</label>
        <select
          id={`${id}-speed`}
          value={speed}
          onChange={(e) => chooseSpeed(Number(e.target.value))}
        >
          <option value={0.85}>Slower</option>
          <option value={1}>Normal</option>
          <option value={1.1}>Faster</option>
        </select>
        <p className="voice-note">
          Voices come from your browser or device. Their sound and availability
          can vary.
        </p>
        <div className="voice-dialog-actions">
          <button
            className="button secondary"
            disabled={!voiceAvailable}
            onClick={() =>
              speak(
                "Hi Azat! Ready for a new challenge? Let's work it out together. 20 times 3 equals 60. You've got this!",
              )
            }
          >
            ▶ Preview voice
          </button>
          <button className="text-button" onClick={stopSpeaking}>
            Stop
          </button>
        </div>
        <form method="dialog">
          <button className="button primary">Use this voice →</button>
        </form>
      </dialog>
    </>
  );
}
