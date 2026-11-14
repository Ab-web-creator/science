import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function load(file) {
  const source = await readFile(
    new URL(`../src/lib/${file}.ts`, import.meta.url),
    "utf8",
  );
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
}
const A = await load("activity");
const lists = {
  division: (await load("division")).questions,
  multiplication: (await load("multiplication")).multiplicationQuestions,
  percentages: (await load("percentages")).percentageQuestions,
};

const done = (a, day, ids) => {
  a = { ...a, missions: { ...a.missions, [day]: ids } };
  for (const id of ids) a = A.recordSolve(a, day, id, "gold");
  return a;
};

test("days are counted in the local calendar", () => {
  assert.equal(A.addDays("2026-11-30", 1), "2026-12-01");
  assert.equal(A.addDays("2026-01-01", -1), "2025-12-31");
});

test("today's mission prefers challenges that are not gold yet, and is stable per day", () => {
  const all = ["d:0", "d:1", "d:2", "d:3", "d:4"];
  const m = A.pickMission(all, new Set(["d:0", "d:1"]), "2026-11-14");
  assert.equal(m.length, 3);
  assert.ok(m.every((id) => !["d:0", "d:1"].includes(id)));
  assert.deepEqual(
    m,
    A.pickMission(all, new Set(["d:0", "d:1"]), "2026-11-14"),
  );
});

test("the streak counts days in a row with the mission done", () => {
  let a = A.emptyActivity;
  a = done(a, "2026-11-12", ["x:0", "x:1", "x:2"]);
  a = done(a, "2026-11-13", ["x:0", "x:1", "x:2"]);
  // Today not done yet: the streak still runs up to yesterday.
  assert.equal(A.streak(a, "2026-11-14"), 2);
  a = done(a, "2026-11-14", ["x:3", "x:4", "x:5"]);
  assert.equal(A.streak(a, "2026-11-14"), 3);
  // A missed day breaks it.
  assert.equal(A.streak(a, "2026-11-17"), 0);
});

test("the weekly summary adds up stars and practice days", () => {
  let a = A.emptyActivity;
  a = A.recordSolve(a, "2026-11-14", "d:0", "gold");
  a = A.recordSolve(a, "2026-11-14", "d:1", "silver");
  a = A.recordSolve(a, "2026-11-14", "d:1", "gold"); // later the same day: best counts
  a = A.recordSolve(a, "2026-11-10", "m:0", "silver");
  a = A.recordSolve(a, "2026-11-01", "m:1", "gold"); // older than 7 days
  assert.deepEqual(A.weekSummary(a, "2026-11-14"), {
    gold: 2,
    silver: 1,
    days: 2,
  });
});

test("no tip gives away its own answer, and every answer is an option", () => {
  for (const [game, qs] of Object.entries(lists))
    for (const q of qs) {
      assert.ok(q.options.includes(q.answer), `${game}: ${q.prompt}`);
      assert.ok(
        !new RegExp(`\\b${q.answer}\\b`).test(q.hint),
        `${game} tip gives it away: ${q.hint}`,
      );
      assert.ok(q.explain.length > 0, `${game}: ${q.prompt}`);
    }
});
