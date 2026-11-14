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
