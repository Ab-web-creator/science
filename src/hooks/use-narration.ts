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
  const stopSpeaking = useCallback(() => {
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
  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!("speechSynthesis" in window)) return;
      const available = englishVoices(window.speechSynthesis.getVoices());
      const chosen =
        available.find((voice) => voice.voiceURI === voiceURI) ?? available[0];
      const utterance = new SpeechSynthesisUtterance(spokenMath(text));
      if (chosen) utterance.voice = chosen;
      utterance.lang = chosen?.lang ?? "en-GB";
      utterance.rate = narrationStyles[style].rate * speed;
      utterance.pitch = narrationStyles[style].pitch;
      stopSpeaking();
      activeUtterance.current = utterance;
      utterance.onend = () => {
        if (activeUtterance.current !== utterance) return;
        activeUtterance.current = null;
        onEnd?.();
      };
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    },
    [voiceURI, style, speed, stopSpeaking],
  );

  return {
    voiceAvailable,
    voices,
    voiceURI,
    selectedVoice,
    style,
    speed,
    speak,
    chooseVoice: (next: string) => save({ voiceURI: next, style, speed }),
    chooseStyle: (next: NarrationStyle) =>
      save({ voiceURI, style: next, speed }),
    chooseSpeed: (next: number) => save({ voiceURI, style, speed: next }),
    stopSpeaking,
  };
}
