export type NarrationStyle = "playful" | "calm";
export const narrationStyles = {
  playful: { label: "Bright & playful", rate: 1.02, pitch: 1.08 },
  calm: { label: "Calm & clear", rate: 0.92, pitch: 1 },
};

export type VoiceOption = Pick<
  SpeechSynthesisVoice,
  "name" | "lang" | "voiceURI" | "localService"
>;

export function rankVoice(voice: VoiceOption) {
  if (!/^en(?:[-_]|$)/i.test(voice.lang)) return -1000;
  let score = /^en[-_]GB$/i.test(voice.lang) ? 10 : 0;
  if (/natural|neural|premium|enhanced/i.test(voice.name)) score += 80;
  if (/google.*english/i.test(voice.name)) score += 50;
  if (/samantha|ava|serena|siri/i.test(voice.name)) score += 25;
  if (!voice.localService) score += 5;
  if (
    /albert|bad news|bahh|bells|boing|bubbles|cellos|good news|hysterical|organ|trinoids|whisper|zarvox/i.test(
      voice.name,
    )
  )
    score -= 200;
  return score;
}

export function englishVoices<T extends VoiceOption>(voices: T[]) {
  return voices
    .filter((voice) => /^en(?:[-_]|$)/i.test(voice.lang))
    .sort(
      (a, b) => rankVoice(b) - rankVoice(a) || a.name.localeCompare(b.name),
    );
}

export function spokenMath(text: string) {
  return text
    .replace(/(\d)\s*:\s*(?=\d)/g, "$1 divided by ")
    .replace(/(\d)\s*\/\s*(?=\d)/g, "$1 divided by ")
    .replace(/×/g, " times ")
    .replace(/÷/g, " divided by ")
    .replace(/−/g, " minus ")
    .replace(/(\d)\s*-(?=\d)/g, "$1 minus ")
    .replace(/\+/g, " plus ")
    .replace(/=/g, " equals ")
    .replace(/%/g, " percent")
    .replace(/→/g, ". Then ")
    .replace(/\s+/g, " ")
    .trim();
}
