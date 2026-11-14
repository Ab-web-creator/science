"use client";
import { useState } from "react";
import { useLearning, type LearningState } from "@/hooks/use-learning";
import { useOrbitVoice } from "@/hooks/use-orbit-voice";
import { pickCheer } from "@/lib/narration";
import { HelpDialog } from "./help-dialog";
import { questions } from "@/lib/division";
type QuestionProps = Pick<
  LearningState,
  | "question"
  | "voiceAvailable"
  | "speak"
  | "q"
  | "solved"
  | "selected"
  | "answerQuestion"
  | "nextQuestion"
  | "firstTry"
> & { totalQuestions?: number; operator?: string; equation?: string };
export function GameQuestion(state: QuestionProps) {
  const {
    totalQuestions = questions.length,
    operator = ":",
    equation,
    question,
    q,
    solved,
    selected,
    answerQuestion,
    nextQuestion,
    firstTry,
  } = state;
  const { gameAutoplay } = useLearning();
  // What Orbit says. A new question is read as it appears; each tap gets its
  // own answer (a varied cheer, or "No, no!"), and a tap interrupts Orbit.
  const asked = q.story
    ? `${q.story} ${q.prompt}`
    : `${equation ?? `${q.n} ${operator} ${q.d}`}. ${q.prompt}`;
  const [said, setSaid] = useState({
    question: -1,
    text: "",
    tap: 0,
    cheer: "",
  });
  const current = said.question === question ? said : { text: asked, tap: 0 };
  useOrbitVoice(current.text, current.tap, gameAutoplay);
  function answer(option: number) {
    const right = option === q.answer;
    const firstGo = selected === null; // no wrong pick yet on this challenge
    const cheer = right ? pickCheer(said.cheer) : said.cheer;
    setSaid({
      question,
      tap: said.tap + 1,
      cheer,
      // After a wrong pick Orbit gives the tip straight away, so the next try
      // is thinking, not guessing.
      text: right
        ? `${cheer}${firstGo ? "" : " You kept trying!"} ${q.explain}`
        : `No, no! Not ${option}. Here is a tip: ${q.hint}`,
    });
    answerQuestion(option);
  }
  const showHint = () =>
    setSaid({ ...said, question, tap: said.tap + 1, text: q.hint });
  return (
    <section className="game-card">
      <div className="flex items-center justify-between">
        <span className="eyebrow">
          MISSION {question + 1} / {totalQuestions}
        </span>
      </div>
      <div className="game-progress">
        <div style={{ width: `${(question / totalQuestions) * 100}%` }} />
      </div>
      {q.story ? (
        <p className="game-story">
          <b>{q.title}:</b> {q.story}
        </p>
      ) : (
        <div className="game-equation">
          {equation ?? (
            <>
              {q.n} <span>{operator}</span> {q.d}
            </>
          )}
        </div>
      )}
      <h2>{q.prompt}</h2>
      <div className="answer-grid">
        {q.options.map((option, i) => (
          <button
            disabled={solved}
            onClick={() => answer(option)}
            className={`answer-option ${selected === option ? (solved ? "correct" : "incorrect") : ""}`}
            key={option}
          >
            <span>{String.fromCharCode(65 + i)}</span>
            {option}
            {selected === option && <b>{solved ? "✓" : "↻"}</b>}
          </button>
        ))}
      </div>
      <div className="feedback" role="status" aria-live="polite">
        {selected !== null &&
          (solved ? (
            firstTry ? (
              <p className="success">
                ✦ {said.cheer || "Hurray!"} Right the first time: a gold star!
              </p>
            ) : (
              <p className="success">
                ✧ {said.cheer || "Hurray!"} You kept trying: a silver star!
              </p>
            )
          ) : (
            <p className="retry">
              No, no! Not {selected}. <b>Tip:</b> {q.hint}
            </p>
          ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <HelpDialog
          label="☀ Hint"
          title="Let’s think about this"
          onOpen={showHint}
        >
          <p>{q.hint}</p>
        </HelpDialog>
        {solved && (
          <button className="button primary" onClick={nextQuestion}>
            {question === totalQuestions - 1
              ? "Finish mission"
              : "Next challenge"}{" "}
            →
          </button>
        )}
      </div>
    </section>
  );
}
