export const examples = [
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
];
export function chunksFor(n: number, d: number) {
  const groups = Math.floor(n / d);
  const big = Math.floor(groups / 10) * 10;
  const left = n - big * d;
  const small = Math.floor(left / d);
  return { big, left, small, rest: left - small * d, groups };
}

export function stepsFor(n: number, d: number) {
  const { big, left, small, rest, groups } = chunksFor(n, d);
  return [
    {
      title: "Start with the whole number",
      text: `We’re finding ${n} : ${d}. Keep ${n} whole. Take out groups of ${d} in chunks, called happen in Dutch. Count the groups.`,
    },
    {
      title: "Choose a handy chunk — een hap",
      text: `Take ${big} groups: ${big} × ${d} = ${big * d}. This chunk fits inside ${n}. Write ${big} groups beside it.`,
    },
    {
      title: "Subtract the chunk — aftrekken",
      text: `Subtract the whole chunk: ${n} − ${big * d} = ${left}. We have taken out ${big} groups of ${d}, with ${left} left to share.`,
    },
    {
      title: small ? "Choose the next chunk" : "Can another group fit?",
      text: small
        ? `${left} is left. ${small} more groups fit, because ${small} × ${d} = ${small * d}. ${small + 1} groups would need ${(small + 1) * d}, which is too much.`
        : `${left} is smaller than ${d}. No more whole groups fit. We stop here; ${left} is the remainder, called rest.`,
    },
    {
      title: small ? "Subtract again" : "Keep the remainder — rest",
      text: small
        ? `${left} − ${small * d} = ${rest}. ${rest === 0 ? "Nothing left over!" : `${rest} is smaller than ${d}, so no more whole groups fit. This is the rest.`}`
        : `Keep ${rest} as the rest. Do not take away another ${d}, because there are not enough left.`,
    },
    {
      title: "Add your groups — optellen",
      text: `${big} ${small ? `+ ${small} = ${groups}` : `groups in total`}. Add the group counts at the side, not the chunks you subtracted. ${n} : ${d} = ${groups}${rest ? ` rest ${rest}` : ""}.`,
    },
    {
      title: "Check — controleren",
      text: `${groups} × ${d}${rest ? ` + ${rest}` : ""} = ${n}. Multiply the answer by ${d}, then add any rest. ${rest ? `The rest, ${rest}, must be smaller than ${d}.` : "We get the starting number back!"}`,
    },
  ];
}
export const questions = [
  {
    n: 168,
    d: 12,
    prompt: "Choose a chunk: 10 groups of 12 make…?",
    options: [12, 120, 24, 100],
    answer: 120,
    hint: "10 × 12 = 120. That chunk fits inside 168.",
  },
  {
    n: 168,
    d: 12,
    prompt: "Take out that chunk: 168 − 120 = ?",
    options: [38, 48, 58, 60],
    answer: 48,
    hint: "168 − 100 = 68. Then take away 20 more: 48.",
  },
  {
    n: 168,
    d: 12,
    prompt: "48 is left. How many more groups of 12 fit?",
    options: [2, 3, 4, 5],
    answer: 4,
    hint: "4 × 12 = 48. Take away 48 and nothing is left.",
  },
  {
    n: 168,
    d: 12,
    prompt: "Add the groups: 10 + 4. What is 168 : 12?",
    options: [12, 14, 16, 18],
    answer: 14,
    hint: "You took out 10 groups, then 4 more. 10 + 4 = 14. Check: 14 × 12 = 168.",
  },
  {
    n: 336,
    d: 14,
    prompt: "Your turn! What is 336 : 14?",
    options: [22, 23, 24, 26],
    answer: 24,
    hint: "Take 20 × 14 = 280 from 336. There are 56 left: 4 × 14. Add 20 + 4.",
  },
  {
    n: 625,
    d: 25,
    prompt: "New mission: what is 625 : 25?",
    options: [15, 24, 25, 35],
    answer: 25,
    hint: "Take 20 × 25 = 500 from 625. There are 125 left: 5 × 25. Add 20 + 5.",
  },
  {
    n: 487,
    d: 16,
    prompt: "Final challenge! 487 : 16 = 30 remainder…?",
    options: [3, 5, 7, 9],
    answer: 7,
    hint: "30 × 16 = 480. Subtract: 487 − 480. The leftover must be smaller than 16.",
  },
];
