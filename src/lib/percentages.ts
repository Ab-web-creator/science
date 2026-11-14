import type { Question } from "./question";
export const percentageExamples = [
  { a: 50, b: 80, title: "50% means half", icon: "◐", base: 50, divisor: 2 },
  { a: 10, b: 250, title: "Find 10% first", icon: "🔟", base: 10, divisor: 10 },
  {
    a: 25,
    b: 120,
    title: "25% means a quarter",
    icon: "🍊",
    base: 25,
    divisor: 4,
  },
  {
    a: 20,
    b: 150,
    title: "Build 20% from 10%",
    icon: "🧩",
    base: 10,
    divisor: 10,
  },
  {
    a: 15,
    b: 200,
    title: "Combine 10% and 5%",
    icon: "🚀",
    base: 10,
    divisor: 10,
  },
];

export function percentageParts(example: number) {
  const { a, b, base, divisor } = percentageExamples[example];
  return {
    percent: a,
    whole: b,
    base,
    baseValue: b / divisor,
    total: (b * a) / 100,
  };
}

export function percentageSteps(example: number) {
  const {
    percent: p,
    whole: n,
    base,
    baseValue,
    total,
  } = percentageParts(example);
  const strategy =
    p === 50
      ? `50% is half. Divide ${n} by 2: ${n} : 2 = ${baseValue}.`
      : p === 25
        ? `25% is one quarter. Divide ${n} by 4: ${n} : 4 = ${baseValue}.`
        : `10% is one tenth. Divide ${n} by 10: ${n} : 10 = ${baseValue}.`;
  const calculation =
    p === 20
      ? `20% is two lots of 10%. Multiply ${baseValue} by 2: ${baseValue} × 2 = ${total}.`
      : p === 15
        ? `5% is half of 10%: ${baseValue} : 2 = ${baseValue / 2}. Add 10% and 5%: ${baseValue} + ${baseValue / 2} = ${total}.`
        : `${p}% of ${n} is ${total}. The percent describes the share; ${total} is the amount in that share.`;
  return [
    {
      title: "Percent means out of 100",
      text: `100% is the whole amount: ${n}. ${p}% means ${p} out of every 100 equal parts. Find that share of ${n}.`,
    },
    { title: `Start with ${base}%`, text: strategy },
    { title: `Find ${p}% of ${n}`, text: calculation },
    {
      title: "Check your result",
      text: `Check with 1%: ${n} : 100 × ${p} = ${total}. Since ${p}% is below 100%, the answer should be below ${n}.`,
    },
  ];
}

export function percentagePath(example: number, step = 0) {
  const { a, b } = percentageExamples[example];
  return `/learn/percentages/${a}-of-${b}/${step + 1}`;
}

export const percentageQuestions: Question[] = [
  {
    n: 50,
    d: 60,
    prompt: "50% means half. What is 50% of 60?",
    options: [15, 25, 30, 50],
    answer: 30,
    hint: "Half means sharing between 2. What is 60 : 2?",
    explain: "Half of 60 is 60 : 2 = 30.",
  },
  {
    n: 10,
    d: 180,
    prompt: "What is 10% of 180?",
    options: [10, 18, 80, 170],
    answer: 18,
    hint: "10% is one tenth. Divide 180 by 10.",
    explain: "10% is one tenth: 180 : 10 = 18.",
  },
  {
    n: 25,
    d: 80,
    prompt: "25% is a quarter. What is 25% of 80?",
    options: [4, 16, 20, 25],
    answer: 20,
    hint: "A quarter means 4 equal parts. What is 80 : 4?",
    explain: "Divide 80 into four equal parts: 80 : 4 = 20.",
  },
  {
    n: 20,
    d: 120,
    prompt: "10% of 120 is 12. What is 20%?",
    options: [12, 20, 24, 60],
    answer: 24,
    hint: "20% is two times 10%. What is double 12?",
    explain: "20% is twice 10%. Double 12 to get 24.",
  },
  {
    n: 15,
    d: 60,
    prompt: "10% is 6 and 5% is 3. What is 15% of 60?",
    options: [3, 9, 15, 45],
    answer: 9,
    hint: "15% = 10% + 5%. Add the two amounts you already know.",
    explain: "15% = 10% + 5%. Add 6 + 3 = 9.",
  },
  {
    n: 20,
    d: 80,
    prompt: "A €80 bag has a 20% discount. How many euros do you save?",
    options: [8, 16, 20, 64],
    answer: 16,
    hint: "First find 10% of €80. Then double it.",
    explain:
      "10% of €80 is €8. Double it: the saving is €16. The new price would be €64.",
  },
];
