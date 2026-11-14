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
const { spokenMath, englishVoices, narrationStyles } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
test("math is spoken as operations rather than punctuation", () => {
  assert.equal(spokenMath("156 : 12 = 13."), "156 divided by 12 equals 13.");
  assert.equal(
    spokenMath("20 × 3 = 60; 16 − 12 = 4."),
    "20 times 3 equals 60; 16 minus 12 equals 4.",
  );
  assert.equal(spokenMath("25% of 120 = 30."), "25 percent of 120 equals 30.");
  assert.equal(spokenMath("120 ÷ 4 = 30."), "120 divided by 4 equals 30.");
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
