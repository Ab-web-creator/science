import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
const source = await readFile(
  new URL("../src/lib/narration.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const {
  spokenMath,
  englishVoices,
  narrationStyles,
  splitSentences,
  toneFor,
  cheers,
  pickCheer,
  isOneWordNumber,
  pauseAfter,
} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
test("math is spoken as operations rather than punctuation", () => {
  assert.equal(spokenMath("156 : 12 = 13."), "156, divided by 12, equals 13.");
  assert.equal(
    spokenMath("20 × 3 = 60; 16 − 12 = 4."),
    "20 times 3, equals 60; 16 minus 12, equals 4.",
  );
  assert.equal(spokenMath("25% of 120 = 30."), "25 percent of 120, equals 30.");
  assert.equal(spokenMath("120 ÷ 4 = 30."), "120, divided by 4, equals 30.");
});
test("prefer an English natural voice and avoid novelty voices", () => {
  const voice = (name, lang = "en-GB") => ({
    name,
    lang,
    voiceURI: name,
    localService: true,
  });
  const voices = englishVoices([
    voice("Zarvox"),
    voice("Dutch Natural", "nl-NL"),
    voice("Basic English"),
    voice("English Natural"),
  ]);
  assert.deepEqual(
    voices.map((v) => v.name),
    ["English Natural", "Basic English", "Zarvox"],
  );
  assert.deepEqual(englishVoices([]), []);
});
test("playful style is brighter, with a moderate reading pace", () => {
  assert.ok(narrationStyles.playful.pitch > narrationStyles.calm.pitch);
  assert.ok(narrationStyles.playful.rate > narrationStyles.calm.rate);
  assert.ok(narrationStyles.playful.pitch < 1.2);
});

test("narration is split into sentences so each gets a pause", () => {
  assert.deepEqual(splitSentences("Take 10 groups of 12. 10 × 12 = 120."), [
    "Take 10 groups of 12.",
    "10 × 12 = 120.",
  ]);
  assert.deepEqual(splitSentences("Hap! All gone? Yes."), [
    "Hap!",
    "All gone?",
    "Yes.",
  ]);
  assert.deepEqual(splitSentences("2.5 × 4 = 10. Done."), [
    "2.5 × 4 = 10.",
    "Done.",
  ]);
  assert.deepEqual(splitSentences("Called “happen.” Next one."), [
    "Called “happen.”",
    "Next one.",
  ]);
  assert.deepEqual(splitSentences("No full stop"), ["No full stop"]);
});

test("cheers sound happier and 'no, no' sounds firmer", () => {
  assert.ok(toneFor("Hurray!").pitch > 1.2);
  assert.ok(toneFor("Hurray!").rate > 1);
  assert.ok(toneFor("No, no!").pitch < 1);
  assert.deepEqual(toneFor("10 × 12 = 120."), { pitch: 1, rate: 1 });
  assert.deepEqual(toneFor("Hurray, but 120 is more than 100."), {
    pitch: 1,
    rate: 1,
  });
});

test("cheers vary, never repeat back to back, and all sound happy", () => {
  for (const c of cheers) assert.ok(toneFor(c).pitch > 1.2, c);
  let prev = "";
  for (let i = 0; i < 50; i++) {
    const next = pickCheer(prev);
    assert.ok(cheers.includes(next));
    assert.notEqual(next, prev);
    prev = next;
  }
  assert.equal(
    pickCheer("Hurray!", () => 0),
    "Yay!",
  );
});

test("sums are read with a short breath around each number", () => {
  assert.equal(spokenMath("21 × 12 = 252."), "21, times 12, equals 252.");
  assert.equal(
    spokenMath("So 156 : 12 = 13 is correct!"),
    "So 156, divided by 12, equals 13, is correct!",
  );
  assert.equal(
    spokenMath("They match, so 728 : 24 = 30 rest 8 is correct!"),
    "They match, so 728, divided by 24, equals 30 rest 8, is correct!",
  );
  // No breath between a result and its unit.
  assert.equal(
    spokenMath("10 + 3 = 13 groups."),
    "10 plus 3, equals 13 groups.",
  );
  assert.equal(
    spokenMath("Did you know that 5 × 12 = 60 fits in 72?"),
    "Did you know that 5 times 12, equals 60, fits in 72?",
  );
  assert.equal(
    spokenMath("Subtract: 156 − 120 = 36."),
    "Subtract: 156, minus 120, equals 36.",
  );
});

test("no breath after one-word numbers before an operator", () => {
  assert.equal(spokenMath("5 × 16 = 80."), "5 times 16, equals 80.");
  assert.equal(spokenMath("21 × 12 = 252."), "21, times 12, equals 252.");
  assert.equal(spokenMath("40 + 7 = 47."), "40 plus 7, equals 47.");
  assert.equal(spokenMath("45 − 5 = 40."), "45, minus 5, equals 40.");
  for (const n of ["0", "5", "11", "16", "20", "30", "90"])
    assert.ok(isOneWordNumber(n), n);
  for (const n of ["21", "45", "100", "156", "2.5"])
    assert.ok(!isOneWordNumber(n), n);
});

test("a cue ending in a comma gets a short breath, a sentence a full pause", () => {
  assert.ok(pauseAfter("120 fits inside 156,") < pauseAfter("10 × 12 = 120."));
  assert.equal(pauseAfter("Hurray!"), 800);
});

test("an unknown answer is read as 'equals what?'", () => {
  assert.equal(
    spokenMath("Take out that chunk: 168 − 120 = ?"),
    "Take out that chunk: 168, minus 120, equals what?",
  );
});
