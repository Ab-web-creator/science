import type { Question } from "./question";
/** A group 8 word problem: after dividing, decide what the rest means. */
export type Mission = {
  question: string;
  unit: string; // "bag"
  units: string; // "bags"
  things: string; // "sweets"
  /** True when the leftover needs one more unit (round up), false to round down. */
  roundUp: boolean;
};
export type Example = {
  n: number;
  d: number;
  label: string;
  story: string;
  mission?: Mission;
};

export const examples: Example[] = [
  {
    n: 156,
    d: 12,
    label: "Start small",
    story: "156 stars, packed into groups of 12.",
  },
  {
    n: 252,
    d: 12,
    label: "Build confidence",
    story: "252 moon rocks, with 12 in each box.",
  },
  {
    n: 384,
    d: 16,
    label: "A new divisor",
    story: "384 space snacks, with 16 in each pack.",
  },
  {
    n: 728,
    d: 24,
    label: "Stop with a rest",
    story: "728 crystals, with 24 in each chest.",
  },
  {
    n: 475,
    d: 15,
    label: "A little left over",
    story: "475 stars, packed into groups of 15.",
  },
  {
    n: 1350,
    d: 52,
    label: "Mission: group 8",
    story: "1350 sweets, packed into bags of 52.",
    mission: {
      question: "How many bags do we need for all the sweets?",
      unit: "bag",
      units: "bags",
      things: "sweets",
      roundUp: true,
    },
  },
];

/** The answer to a mission's question, after deciding what the rest means. */
export function missionAnswer(n: number, d: number, mission: Mission) {
  const { groups, rest } = chunksFor(n, d);
  return mission.roundUp && rest ? groups + 1 : groups;
}
export function chunksFor(n: number, d: number) {
  const groups = Math.floor(n / d);
  const big = Math.floor(groups / 10) * 10;
  const left = n - big * d;
  const small = Math.floor(left / d);
  return { big, left, small, rest: left - small * d, groups };
}

/** Bite sizes (groups per bite) offered in the Feed Orbit game and the handy-facts strip. */
export const biteSizes = [1, 2, 5, 10, 20];

/** Try to take `groups` groups of `d` out of `left`. Too-big bites leave `left` unchanged. */
export function takeBite(left: number, d: number, groups: number) {
  const size = groups * d;
  return size <= left
    ? { fits: true, left: left - size }
    : { fits: false, left };
}

/** A bite at least twice as big as the one just taken that still fits in
 *  `left`, for Orbit's gentle "try a big bite" nudge; null if none. */
export function biggerBite(left: number, d: number, taken: number) {
  const fits = biteSizes.filter((g) => g * d <= left);
  const biggest = fits[fits.length - 1];
  return biggest !== undefined && biggest >= taken * 2 ? biggest : null;
}

/** Fewest bites from `sizes` that add up to exactly `groups` groups. */
export function fewestBites(groups: number, sizes = biteSizes) {
  const best = [0];
  for (let g = 1; g <= groups; g++)
    best[g] = Math.min(
      ...sizes.filter((s) => s <= g).map((s) => best[g - s] + 1),
    );
  return best[groups];
}

/** Parts of the paper that a spoken sentence can point at. */
export type Focus =
  | "heading"
  | "start"
  | `fact-${number}`
  | "sub1"
  | "left"
  | "sub2"
  | "rest"
  | "restnote"
  | "groups"
  | "total"
  | "checkhead"
  | "check"
  | "checksame"
  | "mission"
  | "answer";

/** One spoken sentence and the part of the paper to highlight while it plays. */
export type Cue = { say: string; focus: Focus };

/** The paper element each step adds; Orbit's note sits beside it. */
export type Step = { title: string; anchor: Focus; cues: Cue[]; text: string };

function step(title: string, anchor: Focus, cues: Cue[]): Step {
  return { title, anchor, cues, text: cues.map((c) => c.say).join(" ") };
}

export function stepsFor(n: number, d: number, ex?: Example): Step[] {
  const { big, left, small, rest, groups } = chunksFor(n, d);
  const mission = ex?.mission;
  const answer = `${n} : ${d} = ${groups}${rest ? ` rest ${rest}` : ""}`;
  const fact: Focus = biteSizes.includes(big) ? `fact-${big}` : "fact-10";
  return [
    step("Start with the whole number", "start", [
      ...(mission && ex
        ? [
            { say: `Mission! ${ex.story}`, focus: "mission" as Focus },
            { say: mission.question, focus: "mission" as Focus },
          ]
        : []),
      { say: `We’re finding ${n} : ${d}.`, focus: "heading" },
      { say: `Keep ${n} whole.`, focus: "start" },
      {
        say: `We take out groups of ${d} in chunks, called “happen” or bites, in Dutch.`,
        focus: "start",
      },
    ]),
    step("Choose a handy chunk — een hap", "sub1", [
      { say: `Take ${big} groups of ${d}.`, focus: fact },
      { say: `${big} × ${d} = ${big * d}.`, focus: "sub1" },
      // Split at the comma so "10 groups" is written in exactly on "so write…".
      { say: `${big * d} fits inside ${n},`, focus: "sub1" },
      { say: `so write ${big} groups beside it.`, focus: "groups" },
    ]),
    step("Subtract the chunk — aftrekken", "left", [
      { say: `${n} − ${big * d} = ${left}.`, focus: "left" },
      { say: `${left} is left to share.`, focus: "left" },
    ]),
    small
      ? step("Choose the next chunk", "sub2", [
          { say: `${left} is left.`, focus: "left" },
          {
            say: `${small} × ${d} = ${small * d}, so ${small} more groups fit.`,
            focus: "sub2",
          },
          {
            say: `${small + 1} groups would need ${(small + 1) * d}, which is too much.`,
            focus: "sub2",
          },
        ])
      : step("Can another group fit?", "restnote", [
          { say: `${left} is smaller than ${d}.`, focus: "left" },
          {
            say: `No more whole groups fit. We stop here; ${left} is the remainder, called rest.`,
            focus: "restnote",
          },
        ]),
    small
      ? step("Subtract again", "rest", [
          { say: `${left} − ${small * d} = ${rest}.`, focus: "rest" },
          {
            say: rest
              ? `${rest} is smaller than ${d}, so no more whole groups fit. This is the rest.`
              : "Nothing left over!",
            focus: "rest",
          },
        ])
      : step("Keep the remainder — rest", "restnote", [
          { say: `Keep ${rest} as the rest.`, focus: "restnote" },
          {
            say: `Do not take away another ${d}, because there are not enough left.`,
            focus: "restnote",
          },
        ]),
    step("Add your groups — optellen", "total", [
      {
        say: "Add the group counts at the side, not the chunks you subtracted.",
        focus: "groups",
      },
      {
        say: small
          ? `${big} + ${small} = ${groups} groups.`
          : `${big} groups in total.`,
        focus: "total",
      },
      { say: `${answer}.`, focus: "heading" },
    ]),
    // Check by working backwards: multiplying undoes dividing. Multiply the
    // answer back (and add the rest); getting the starting number again proves
    // the division was right.
    step("Check: is our answer right? — controleren", "check", [
      { say: "Now let’s check if our answer is right.", focus: "heading" },
      {
        say: "Multiplying undoes dividing, so we check by multiplying back.",
        focus: "checkhead",
      },
      {
        say: `Our answer is ${groups} groups of ${d}, and ${groups} × ${d} = ${groups * d}.`,
        focus: "check",
      },
      ...(rest
        ? [
            {
              say: `Then add the rest: ${groups * d} + ${rest} = ${n}.`,
              focus: "check" as Focus,
            },
          ]
        : []),
      {
        say: `Compare with the starting number: ${n} is the same as ${n}.`,
        focus: "checksame",
      },
      ...(rest
        ? [
            {
              say: `And the rest, ${rest}, is smaller than ${d}, as it must be.`,
              focus: (small ? "rest" : "restnote") as Focus,
            },
          ]
        : []),
      { say: `They match, so ${answer} is correct!`, focus: "checksame" },
      ...(mission ? missionCues(n, d, mission) : []),
    ]),
  ];
}
/** Back to the story: what does the rest mean for the question? */
function missionCues(n: number, d: number, m: Mission): Cue[] {
  const { groups, rest } = chunksFor(n, d);
  const answer = missionAnswer(n, d, m);
  return [
    { say: `Now back to the question: ${m.question}`, focus: "answer" },
    rest
      ? {
          say: `${groups} ${m.units} are full, and ${rest} ${m.things} are left over.`,
          focus: "answer",
        }
      : {
          say: `${groups} ${m.units} are full, with nothing left over.`,
          focus: "answer",
        },
    {
      say: !rest
        ? `So we need ${answer} ${m.units}.`
        : m.roundUp
          ? `Those ${rest} ${m.things} need a ${m.unit} too, so we need ${answer} ${m.units}!`
          : `${rest} ${m.things} are not enough for a full ${m.unit}, so the answer is ${answer} ${m.units}.`,
      focus: "answer",
    },
  ];
}

export const questions: Question[] = [
  {
    n: 168,
    d: 12,
    prompt: "Choose a chunk: 10 groups of 12 make…?",
    options: [12, 120, 24, 100],
    answer: 120,
    hint: "10 groups of 12 is 10 × 12. Multiplying by 10: put a 0 behind the 12.",
    explain: "10 × 12 = 120. That chunk fits inside 168.",
  },
  {
    n: 168,
    d: 12,
    prompt: "Take out that chunk: 168 − 120 = ?",
    options: [38, 48, 58, 60],
    answer: 48,
    hint: "First take away 100 from 168. Then take away 20 more.",
    explain: "168 − 100 = 68. Then take away 20 more: 48.",
  },
  {
    n: 168,
    d: 12,
    prompt: "48 is left. How many more groups of 12 fit?",
    options: [2, 3, 4, 5],
    answer: 4,
    hint: "Count up in twelves: 12, 24, 36… How many twelves make 48?",
    explain: "4 × 12 = 48. Take away 48 and nothing is left.",
  },
  {
    n: 168,
    d: 12,
    prompt: "Add the groups: 10 + 4. What is 168 : 12?",
    options: [12, 14, 16, 18],
    answer: 14,
    hint: "You took out 10 groups, then 4 more. How many groups is that together?",
    explain:
      "You took out 10 groups, then 4 more. 10 + 4 = 14. Check: 14 × 12 = 168.",
  },
  {
    n: 336,
    d: 14,
    prompt: "Your turn! What is 336 : 14?",
    options: [22, 23, 24, 26],
    answer: 24,
    hint: "Start with a big bite: 20 × 14 = 280. How many fourteens fit in what is left?",
    explain:
      "Take 20 × 14 = 280 from 336. There are 56 left: 4 × 14. Add 20 + 4.",
  },
  {
    n: 625,
    d: 25,
    prompt: "New mission: what is 625 : 25?",
    options: [15, 24, 25, 35],
    answer: 25,
    hint: "Start with 20 groups of twenty-five: that is 500. How many more groups fit in what is left?",
    explain:
      "Take 20 × 25 = 500 from 625. There are 125 left: 5 × 25. Add 20 + 5.",
  },
  {
    n: 487,
    d: 16,
    prompt: "Final challenge! 487 : 16 = 30 remainder…?",
    options: [3, 5, 7, 9],
    answer: 7,
    hint: "30 × 16 = 480. How much is left from 487? That leftover is the rest.",
    explain:
      "30 × 16 = 480. Subtract: 487 − 480. The leftover must be smaller than 16.",
  },
  // Real-life missions (group 8): after dividing, decide what the rest means.
  {
    n: 160,
    d: 36,
    title: "School trip",
    story:
      "Your school goes on a trip with 160 children. Each bus takes 36 children.",
    prompt: "How many buses are needed?",
    options: [4, 5, 6, 16],
    answer: 5,
    hint: "How many buses are full? 4 × 36 = 144. Are there children left who still need a seat?",
    explain:
      "4 × 36 = 144, so 4 buses are full and 16 children are left. They need a bus too: 5 buses.",
  },
  {
    n: 75,
    d: 11,
    title: "Football teams",
    story: "75 children want to play football. A team has 11 players.",
    prompt: "How many full teams can they make?",
    options: [6, 7, 8, 9],
    answer: 6,
    hint: "How many times does 11 fit in 75? Can the children who are left make a full team?",
    explain:
      "6 × 11 = 66, so 6 full teams. 9 children are left: not enough for another team.",
  },
  {
    n: 150,
    d: 12,
    title: "Saving up",
    story: "You save €12 every week for a game that costs €150.",
    prompt: "How many weeks until you can buy it?",
    options: [12, 13, 14, 15],
    answer: 13,
    hint: "How much have you saved after 12 weeks? Is that enough for the game?",
    explain:
      "12 weeks × €12 = €144. That is €6 short, so you need one more week: 13 weeks.",
  },
];
