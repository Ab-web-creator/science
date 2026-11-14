import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
const source = await readFile(
  new URL("../src/lib/multiplication.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const {
  multiplicationExamples,
  multiplicationParts,
  multiplicationSteps,
  multiplicationQuestions,
  multiplicationPath,
} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

const expected = [92, 102, 252, 224, 296];
multiplicationExamples.forEach(({ a, b }, i) =>
  test(`${a} × ${b} teaches correct partial products`, () => {
    const parts = multiplicationParts(a, b);
    assert.equal(parts.tens + parts.ones, a);
    assert.equal(parts.tensProduct + parts.onesProduct, expected[i]);
    assert.equal(parts.total, expected[i]);
    assert.equal(parts.total / b, a);
    const steps = multiplicationSteps(a, b);
    assert.equal(steps.length, 4);
    assert.ok(steps[3].text.includes(`${a} × ${b} = ${expected[i]}`));
  }),
);
test("every multiplication step has a distinct direct URL", () => {
  const paths = multiplicationExamples.flatMap((_, i) =>
    Array.from({ length: 4 }, (_, step) => multiplicationPath(i, step)),
  );
  assert.equal(new Set(paths).size, 20);
  assert.equal(paths[0], "/learn/multiplication/23-4/1");
  assert.equal(paths.at(-1), "/learn/multiplication/37-8/4");
});
test("guided and independent multiplication game answers are correct", () => {
  assert.deepEqual(
    multiplicationQuestions.map((q) => q.answer),
    [4, 60, 12, 72, 128, 282],
  );
  for (const q of multiplicationQuestions)
    assert.ok(q.options.includes(q.answer));
  for (const q of multiplicationQuestions.slice(4))
    assert.equal(q.answer, q.n * q.d);
});
