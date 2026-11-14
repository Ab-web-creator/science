import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/star-store.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { betterStar, countStars, starOutcome } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

test("a replay can turn silver into gold, but never gold into silver", () => {
  assert.equal(betterStar(undefined, "silver"), "silver");
  assert.equal(betterStar("silver", "gold"), "gold");
  assert.equal(betterStar("gold", "silver"), "gold");
});

test("stars are counted per colour", () => {
  assert.deepEqual(countStars({ 0: "gold", 1: "silver", 4: "gold" }), {
    gold: 2,
    silver: 1,
  });
  assert.deepEqual(countStars({}), { gold: 0, silver: 0 });
});

test("the star message is honest when a challenge is played again", () => {
  assert.match(starOutcome(true, undefined).text, /gold star/);
  assert.match(starOutcome(false, undefined).text, /silver star/);
  assert.match(starOutcome(true, "silver").text, /turned gold/);
  assert.match(starOutcome(true, "gold").text, /already have gold/);
  assert.match(starOutcome(false, "gold").text, /already have gold/);
  assert.match(starOutcome(false, "silver").text, /still silver/);
});
