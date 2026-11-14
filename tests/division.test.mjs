import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/division.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { chunksFor, stepsFor, examples, questions } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

for (const { n, d } of examples) {
  test(`${n} : ${d} accounts for every group and remainder`, () => {
    const { big, left, small, rest, groups } = chunksFor(n, d);
    assert.equal(n - big * d, left);
    assert.equal(left - small * d, rest);
    assert.equal(big + small, groups);
    assert.equal(groups * d + rest, n);
    assert.ok(rest >= 0 && rest < d);
    assert.equal(stepsFor(n, d).length, 7);
  });
}
test("stop without subtracting another group when only a rest remains", () => {
  assert.deepEqual(chunksFor(728, 24), {
    big: 30,
    left: 8,
    small: 0,
    rest: 8,
    groups: 30,
  });
  assert.match(stepsFor(728, 24)[3].text, /No more whole groups fit/);
});
test("guided game follows whole-number chunks", () => {
  assert.deepEqual(
    questions.slice(0, 4).map((q) => q.answer),
    [120, 48, 4, 14],
  );
  for (const q of questions) assert.ok(q.options.includes(q.answer));
  assert.equal(questions[4].answer, 336 / 14);
  assert.equal(questions[5].answer, 625 / 25);
  assert.equal(questions[6].answer, 487 % 16);
});

test("bites that are too big leave the number unchanged", async () => {
  const { takeBite } = await import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
  assert.deepEqual(takeBite(156, 12, 20), { fits: false, left: 156 });
  assert.deepEqual(takeBite(156, 12, 10), { fits: true, left: 36 });
  assert.deepEqual(takeBite(36, 12, 2), { fits: true, left: 12 });
});

test("fewest bites uses the bite ladder", async () => {
  const { fewestBites, biteSizes } = await import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
  assert.deepEqual(biteSizes, [1, 2, 5, 10, 20]);
  assert.equal(fewestBites(13), 3); // 156 : 12 → 10 + 2 + 1
  assert.equal(fewestBites(30), 2); // 728 : 24 → 20 + 10
  assert.equal(fewestBites(24), 3); // 384 : 16 → 20 + 2 + 2
  assert.equal(fewestBites(0), 0);
});

test("every step speaks short cues that point at the paper", () => {
  for (const { n, d } of examples) {
    for (const step of stepsFor(n, d)) {
      assert.ok(step.cues.length >= 2, step.title);
      assert.equal(step.text, step.cues.map((c) => c.say).join(" "));
      assert.ok(
        step.cues.every((c) => c.say.length <= 90),
        step.title,
      );
    }
  }
});

test("the step 2 chunk row appears with the sentence that says it", () => {
  const cues = stepsFor(156, 12)[1].cues;
  assert.equal(cues[0].focus, "fact-10");
  assert.deepEqual(cues[1], { say: "10 × 12 = 120.", focus: "sub1" });
});

test("Orbit suggests a bigger bite only when one at least twice as big fits", async () => {
  const { biggerBite } = await import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
  assert.equal(biggerBite(144, 12, 1), 10); // 10 × 12 = 120 fits in 144
  assert.equal(biggerBite(120, 12, 2), 10); // the screenshot case
  assert.equal(biggerBite(36, 12, 2), null); // only 2 × 12 fits: no nudge
  assert.equal(biggerBite(36, 12, 1), 2);
  assert.equal(biggerBite(475 - 300, 15, 10), null); // 10 was already the biggest that fits
});

test("no sentence puts a colon right after a number unless it means division", () => {
  // "12: 13" would be read aloud as "12 divided by 13".
  for (const { n, d } of examples)
    for (const step of stepsFor(n, d))
      for (const { say } of step.cues)
        for (const m of say.matchAll(/(\d+)\s*:\s*(\d+)/g))
          assert.equal(`${m[1]}:${m[2]}`, `${n}:${d}`, say);
});

test("'10 groups' is cued exactly on 'so write 10 groups beside it'", () => {
  const cues = stepsFor(156, 12)[1].cues;
  assert.deepEqual(cues.at(-2), { say: "120 fits inside 156,", focus: "sub1" });
  assert.deepEqual(cues.at(-1), {
    say: "so write 10 groups beside it.",
    focus: "groups",
  });
  assert.match(
    stepsFor(156, 12)[1].text,
    /120 fits inside 156, so write 10 groups beside it\./,
  );
});
