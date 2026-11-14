/** A Play challenge. `hint` points the way without giving the answer (shown
 *  after a wrong pick); `explain` shows the full working (said when right). */
export type Question = {
  n: number;
  d: number;
  prompt: string;
  options: number[];
  answer: number;
  hint: string;
  explain: string;
  /** Real-life missions: a short name and the story shown instead of the sum. */
  title?: string;
  story?: string;
};
