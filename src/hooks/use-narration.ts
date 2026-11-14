"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  englishVoices,
  narrationStyles,
  pauseAfter,
  toneFor,
  splitSentences,
  spokenMath,
  type NarrationStyle,
} from "@/lib/narration";

const preferenceKey = "little-orbit-narration";
export function useNarration() {
  const voiceAvailable = useSyncExternalStore(
    () => () => {},
    () => "speechSynthesis" in window,
    () => false,
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [style, setStyle] = useState<NarrationStyle>("playful");
  const [speed, setSpeed] = useState(1);

  const activeUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const stopSpeaking = useCallback(() => {
    clearTimeout(pauseTimer.current);
    if (activeUtterance.current) {
      activeUtterance.current.onend = null;
      activeUtterance.current.onerror = null;
      activeUtterance.current = null;
    }
    window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    function updateVoices() {
      setVoices(englishVoices(window.speechSynthesis.getVoices()));
    }
    const timer = setTimeout(() => {
      updateVoices();
      try {
        const saved = JSON.parse(localStorage.getItem(preferenceKey) || "null");
        if (typeof saved?.voiceURI === "string") setVoiceURI(saved.voiceURI);
        if (saved?.style === "playful" || saved?.style === "calm")
          setStyle(saved.style);
        if ([0.85, 1, 1.1].includes(saved?.speed)) setSpeed(saved.speed);
      } catch {
        /* Use defaults if storage is unavailable or invalid. */
      }
    }, 0);
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    return () => {
      clearTimeout(timer);
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
      stopSpeaking();
    };
  }, [stopSpeaking]);

  function save(next: {
    voiceURI: string;
    style: NarrationStyle;
    speed: number;
  }) {
    stopSpeaking();
    setVoiceURI(next.voiceURI);
    setStyle(next.style);
    setSpeed(next.speed);
    try {
      localStorage.setItem(preferenceKey, JSON.stringify(next));
    } catch {
      /* Keep preferences for this visit. */
    }
  }
  const selectedVoice =
    voices.find((voice) => voice.voiceURI === voiceURI) ?? voices[0];
  /** Queue one utterance. `onStart` fires when the audio actually begins. */
  const utter = useCallback(
    (text: string, onStart?: () => void, onEnd?: () => void) => {
      const available = englishVoices(window.speechSynthesis.getVoices());
      const chosen =
        available.find((voice) => voice.voiceURI === voiceURI) ?? available[0];
      const utterance = new SpeechSynthesisUtterance(spokenMath(text));
      if (chosen) utterance.voice = chosen;
      utterance.lang = chosen?.lang ?? "en-GB";
      const tone = toneFor(text);
      utterance.rate = narrationStyles[style].rate * speed * tone.rate;
      utterance.pitch = Math.min(2, narrationStyles[style].pitch * tone.pitch);
      activeUtterance.current = utterance;
      let started = false;
      const start = () => {
        if (started || activeUtterance.current !== utterance) return;
        started = true;
        onStart?.();
      };
      // Some voices never fire onstart; fall back shortly after queueing.
      const fallback = setTimeout(start, 700);
      utterance.onstart = start;
      utterance.onend = () => {
        clearTimeout(fallback);
        if (activeUtterance.current !== utterance) return;
        start();
        activeUtterance.current = null;
        onEnd?.();
      };
      utterance.onerror = utterance.onend;
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    },
    [voiceURI, style, speed],
  );

  /** Speak `parts` one sentence at a time with a short pause after each.
   *  `onCue(i)` fires when the first sentence of part i starts. */
  const speakCues = useCallback(
    (texts: string[], onCue?: (i: number) => void, onEnd?: () => void) => {
      if (!("speechSynthesis" in window)) return;
      stopSpeaking();
      const sentences = texts.flatMap((text, cue) =>
        splitSentences(text).map((say, k) => ({ say, cue, first: k === 0 })),
      );
      const next = (i: number) => {
        if (i >= sentences.length) return onEnd?.();
        const { say, cue, first } = sentences[i];
        utter(say, first ? () => onCue?.(cue) : undefined, () => {
          if (i + 1 >= sentences.length) return onEnd?.();
          pauseTimer.current = setTimeout(() => next(i + 1), pauseAfter(say));
        });
      };
      pauseTimer.current = setTimeout(() => next(0), 120);
    },
    [utter, stopSpeaking],
  );

  const speak = useCallback(
    (text: string, onEnd?: () => void) => speakCues([text], undefined, onEnd),
    [speakCues],
  );

  return {
    voiceAvailable,
    voices,
    voiceURI,
    selectedVoice,
    style,
    speed,
    speak,
    speakCues,
    chooseVoice: (next: string) => save({ voiceURI: next, style, speed }),
    chooseStyle: (next: NarrationStyle) =>
      save({ voiceURI, style: next, speed }),
    chooseSpeed: (next: number) => save({ voiceURI, style, speed: next }),
    stopSpeaking,
  };
}
