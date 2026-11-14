export const multiplicationExamples = [
  { a: 23, b: 4, title: "Split into tens and ones", icon: "🧩" },
  { a: 34, b: 3, title: "Try another number", icon: "🌙" },
  { a: 42, b: 6, title: "Grow your groups", icon: "⭐" },
  { a: 56, b: 4, title: "Add a bigger ones part", icon: "💎" },
  { a: 37, b: 8, title: "Put it all together", icon: "🚀" },
];
export function multiplicationParts(a: number, b: number) {
  const tens = Math.floor(a / 10) * 10;
  const ones = a % 10;
  return {
    tens,
    ones,
    tensProduct: tens * b,
    onesProduct: ones * b,
    total: a * b,
  };
}
export function multiplicationSteps(a: number, b: number) {
  const { tens, ones, tensProduct, onesProduct, total } = multiplicationParts(
    a,
    b,
  );
  return [
    {
      title: "Split the number — splitsen",
      text: `${a} is ${tens} + ${ones}. We want ${b} groups of ${a}. Split each group into tens and ones.`,
    },
    {
      title: "Multiply the tens",
      text: `${tens} × ${b} = ${tensProduct}. First multiply the tens part. ${tens / 10} tens × ${b} makes ${tensProduct / 10} tens.`,
    },
    {
      title: "Multiply the ones",
      text: `${ones} × ${b} = ${onesProduct}. Now multiply the ones part. Keep both answers: ${tensProduct} and ${onesProduct}.`,
    },
    {
      title: "Add the parts — optellen",
      text: `${tensProduct} + ${onesProduct} = ${total}. So ${a} × ${b} = ${total}. Check by dividing: ${total} : ${b} = ${a}.`,
    },
  ];
}
export function multiplicationPath(example: number, step = 0) {
  const { a, b } = multiplicationExamples[example];
  return `/learn/multiplication/${a}-${b}/${step + 1}`;
}
export const multiplicationQuestions = [
  {
    n: 24,
    d: 3,
    prompt: "Split 24 into 20 + …?",
    options: [2, 4, 6, 8],
    answer: 4,
    hint: "24 has 2 tens and 4 ones. 20 + 4 = 24.",
  },
  {
    n: 24,
    d: 3,
    prompt: "Multiply the tens: 20 × 3 = ?",
    options: [23, 40, 60, 80],
    answer: 60,
    hint: "2 tens × 3 = 6 tens. That is 60.",
  },
  {
    n: 24,
    d: 3,
    prompt: "Multiply the ones: 4 × 3 = ?",
    options: [7, 10, 12, 16],
    answer: 12,
    hint: "4 + 4 + 4 = 12.",
  },
  {
    n: 24,
    d: 3,
    prompt: "Add the parts: 60 + 12 = ?",
    options: [62, 72, 82, 612],
    answer: 72,
    hint: "60 + 10 = 70. Add 2 more: 72.",
  },
  {
    n: 32,
    d: 4,
    prompt: "Your turn! What is 32 × 4?",
    options: [108, 124, 128, 148],
    answer: 128,
    hint: "30 × 4 = 120. 2 × 4 = 8. Add 120 + 8.",
  },
  {
    n: 47,
    d: 6,
    prompt: "Final challenge! What is 47 × 6?",
    options: [242, 262, 282, 286],
    answer: 282,
    hint: "40 × 6 = 240. 7 × 6 = 42. Add 240 + 42.",
  },
];
