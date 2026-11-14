import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

function moduleUrl(source) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  });
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
}
const divisionUrl = moduleUrl(
  await readFile(new URL("../src/lib/division.ts", import.meta.url), "utf8"),
);
const source = await readFile(
  new URL("../src/lib/learning-routes.ts", import.meta.url),
  "utf8",
);
const routes = await import(
  moduleUrl(source.replace('"./division"', JSON.stringify(divisionUrl)))
);
const { examples, questions } = await import(divisionUrl);

test("every worked example and step has a unique restorable URL", () => {
  const paths = new Set();
  examples.forEach((_, example) => {
    for (let step = 0; step < 7; step++) {
      const path = routes.lessonPath(example, step);
      paths.add(path);
      const restored = routes.readLearningRoute(path);
      assert.equal(restored.tab, "lesson");
      assert.equal(restored.example, example);
      assert.equal(restored.step, step);
      assert.equal(restored.isExample, true);
    }
  });
  assert.equal(paths.size, examples.length * 7);
});
test("game challenge and completion URLs restore the right screen", () => {
  for (let question = 0; question <= questions.length; question++) {
    const restored = routes.readLearningRoute(routes.challengePath(question));
    assert.equal(restored.tab, "game");
    assert.equal(restored.question, question);
  }
});
test("menus and home do not activate the lesson auto-player", () => {
  for (const path of Object.values(routes.tabPaths))
    assert.equal(routes.readLearningRoute(path).isExample, false);
  assert.equal(routes.readLearningRoute("/").tab, "home");
});
