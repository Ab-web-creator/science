import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
const source = await readFile(
  new URL("../src/lib/percentages.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const {
  percentageExamples,
  percentageParts,
  percentageSteps,
  percentagePath,
  percentageQuestions,
} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const expected = [40, 25, 30, 30, 30];
percentageExamples.forEach((ex, i) =>
  test(`${ex.a}% of ${ex.b} uses a correct benchmark and total`, () => {
    const parts = percentageParts(i);
    assert.equal(parts.total, expected[i]);
    assert.equal(parts.baseValue, (ex.b * ex.base) / 100);
    assert.equal((parts.total / ex.b) * 100, ex.a);
    assert.ok(parts.total < parts.whole);
    const steps = percentageSteps(i);
    assert.equal(steps.length, 4);
    assert.ok(
      steps[3].text.includes(`${ex.b} : 100 × ${ex.a} = ${expected[i]}`),
    );
  }),
);
test("20% doubles 10%, and 15% combines 10% and 5%", () => {
  const twenty = percentageParts(3),
    fifteen = percentageParts(4);
  assert.equal(twenty.total, twenty.baseValue * 2);
  assert.equal(fifteen.total, fifteen.baseValue + fifteen.baseValue / 2);
});
test("all twenty percentage lesson steps have distinct direct links", () => {
  const paths = percentageExamples.flatMap((_, i) =>
    Array.from({ length: 4 }, (_, step) => percentagePath(i, step)),
  );
  assert.equal(new Set(paths).size, 20);
  assert.equal(paths[0], "/learn/percentages/50-of-80/1");
});
test("game answers find the amount, including the saving instead of the final price", () => {
  for (const q of percentageQuestions) {
    assert.ok(q.options.includes(q.answer));
    assert.equal(q.answer, (q.n * q.d) / 100);
  }
  const discount = percentageQuestions.at(-1);
  assert.equal(discount.answer, 16);
  assert.notEqual(discount.answer, 64);
});
