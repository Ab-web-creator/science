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

/** Numbers said as a single word ("five", "sixteen", "forty") need no breath
 *  before an operator; longer ones ("twenty-one", "156") do. */
export function isOneWordNumber(num: string) {
  const n = Number(num);
  return Number.isInteger(n) && (n <= 20 || (n < 100 && n % 10 === 0));
}

/** Turn written maths into natural speech. Commas give the voice a short
 *  breath around each number: "21 × 12 = 252 is correct" is read as
 *  "21, times 12, equals 252, is correct". */
export function spokenMath(text: string) {
  return (
    text
      .replace(/(\d)\s*:\s*(?=\d)/g, "$1, divided by ")
      .replace(/(\d)\s*\/\s*(?=\d)/g, "$1, divided by ")
      .replace(/\s*×\s*/g, ", times ")
      .replace(/\s*÷\s*/g, ", divided by ")
      .replace(/\s*−\s*/g, ", minus ")
      .replace(/(\d)\s*-(?=\d)/g, "$1, minus ")
      .replace(/\s*\+\s*/g, ", plus ")
      .replace(/\s*=\s*/g, ", equals ")
      .replace(/%/g, " percent")
      .replace(/→/g, ". Then ")
      // A breath after the result when more words follow ("…equals 13, is
      // correct"), but not before its unit ("equals 13 groups").
      .replace(
        /(equals \d+(?: rest \d+)?)(?= (?!(?:groups?|stars?|rest)\b)[a-z])/gi,
        "$1,",
      )
      // No breath after a one-word number before an operator: "5 times 16".
      .replace(/\b(\d+), (times|plus|minus|divided by)\b/g, (m, num, op) =>
        isOneWordNumber(num) ? `${num} ${op}` : m,
      )
      // Tidy up: no comma at the start or right after other punctuation.
      .replace(/^\s*,\s*/, "")
      .replace(/([.!?;:(])\s*,/g, "$1")
      .replace(/,\s*,/g, ",")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/** Silence after every spoken sentence, on every page (rule for all narration). */
export const SENTENCE_PAUSE_MS = 800;
/** A cue that stops at a comma continues the same sentence: only a breath. */
export const COMMA_PAUSE_MS = 250;

/** Silence to leave after a spoken piece of text. */
export function pauseAfter(text: string) {
  return /,\s*$/.test(text) ? COMMA_PAUSE_MS : SENTENCE_PAUSE_MS;
}

/** Split text into sentences so each can be followed by a short pause.
 *  Splits after . ! ? (optionally followed by a closing quote) and a space,
 *  so decimals like 2.5 stay whole. */
export function splitSentences(text: string) {
  return text
    .split(/(?<=[.!?][”’"')]?)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Extra feeling for short exclamations. Browser voices cannot act, but a
 *  higher, quicker voice sounds happy and a lower, slower one sounds firm. */
export function toneFor(sentence: string) {
  const s = sentence.trim();
  if (
    /^(hurray|hooray|yay|well done|great job|super|awesome|brilliant|yes)\b[^.?]*!$/i.test(
      s,
    )
  )
    return { pitch: 1.4, rate: 1.12 };
  if (/^no,? no!?$/i.test(s)) return { pitch: 0.85, rate: 0.88 };
  return { pitch: 1, rate: 1 };
}

/** Ways to cheer a correct answer, so "Hurray!" does not get boring. */
export const cheers = [
  "Hurray!",
  "Yay!",
  "Well done!",
  "Great job!",
  "Super!",
  "Awesome!",
  "Brilliant!",
];

/** A random cheer that is never the same as the previous one. */
export function pickCheer(previous = "", random = Math.random) {
  const options = cheers.filter((c) => c !== previous);
  return options[Math.floor(random() * options.length)];
}
