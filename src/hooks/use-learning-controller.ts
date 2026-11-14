"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  challengePath,
  lessonPath,
  readLearningRoute,
  tabPaths,
  type LearningTab,
} from "@/lib/learning-routes";
import { percentageQuestions } from "@/lib/percentages";
import { multiplicationQuestions } from "@/lib/multiplication";
import { stopForNavigation } from "@/lib/navigation-speech";
import { useNavigationSpeechStop } from "./use-navigation-speech-stop";
import { useNarration } from "./use-narration";
import { usePractice } from "./use-practice";
import { examples, questions, stepsFor, chunksFor } from "@/lib/division";
/** Silence between the last sentence of a step and the next step in auto-play. */
const STEP_PAUSE_MS = 1800;

export function useLearningController() {
  const router = useRouter();
  const pathname = usePathname();
  const { tab, example, step, question, isExample } =
    readLearningRoute(pathname);
  const practice = usePractice(question);
  const multiplicationMatch = pathname.match(/^\/play\/multiplication\/(\d+)$/);
  const multiplicationIndex = multiplicationMatch
    ? Number(multiplicationMatch[1]) - 1
    : 0;
  const multiplicationPractice = usePractice(
    multiplicationIndex,
    multiplicationQuestions,
    "little-orbit-stars-multiplication",
  );
  const percentageMatch = pathname.match(/^\/play\/percentages\/(\d+)$/);
  const percentagePractice = usePractice(
    percentageMatch ? Number(percentageMatch[1]) - 1 : 0,
    percentageQuestions,
    "little-orbit-stars-percentages",
  );
  const [playing, setPlaying] = useState(false),
    [voice, setVoice] = useState(false);
  // Auto-play in the Play games: reads questions and feedback aloud. It follows
  // the child's last choice in a lesson, so one switch works everywhere.
  const [gameAutoplay, setGameAutoplay] = useState(false);
  const autoplayStart = useRef<string | null>(null);
  const narration = useNarration();
  const { voiceAvailable, speak, speakCues, stopSpeaking } = narration;
  // Which spoken sentence of the current lesson step is playing (keyed by path,
  // so it resets on its own whenever the step changes).
  const [cueState, setCueState] = useState<{ path: string; i: number | null }>({
    path: "",
    i: null,
  });
  const cue = cueState.path === pathname ? cueState.i : null;
  // During the pause after a step, the step panel fades out before moving on.
  const [leavingPath, setLeavingPath] = useState("");
  const leaving = leavingPath === pathname;
  const stopNavigationPlayback = useCallback(() => {
    stopSpeaking();
    setCueState({ path: "", i: null });
    setLeavingPath("");
    autoplayStart.current = null;
    setVoice(false);
    setPlaying(false);
  }, [stopSpeaking]);
  useNavigationSpeechStop(stopNavigationPlayback, stopSpeaking);
  const [completed, setCompleted] = useState<number[]>([]);
  const ex = examples[example],
    steps = stepsFor(ex.n, ex.d, ex),
    q = questions[Math.min(question, questions.length - 1)];
  useEffect(() => {
    if (voice && isExample) {
      if (autoplayStart.current && autoplayStart.current !== pathname)
        return stopSpeaking;
      autoplayStart.current = null;
      const path = pathname;
      let pause: ReturnType<typeof setTimeout> | undefined;
      speakCues(
        stepsFor(ex.n, ex.d, ex)[step].cues.map((c) => c.say),
        (i) => setCueState({ path, i }),
        () => {
          if (!playing) return setCueState({ path, i: null });
          // A breather before the next step, so the child can take it in.
          if (step < 6) setLeavingPath(path);
          if (step < 6)
            pause = setTimeout(
              () =>
                router.replace(lessonPath(example, step + 1), {
                  scroll: false,
                }),
              STEP_PAUSE_MS,
            );
          else {
            setVoice(false);
            setPlaying(false);
            setCueState({ path, i: null });
          }
        },
      );
      return () => {
        clearTimeout(pause);
        stopSpeaking();
      };
    }
    return stopSpeaking;
  }, [
    pathname,
    step,
    ex,
    voice,
    isExample,
    speakCues,
    stopSpeaking,
    playing,
    example,
    router,
  ]);
  function toggleAutoplay() {
    setGameAutoplay(!playing);
    if (playing) {
      stopNavigationPlayback();
      return;
    }
    if (step === 6) {
      autoplayStart.current = lessonPath(example, 0);
      router.replace(autoplayStart.current, { scroll: false });
    }
    setVoice(true);
    setPlaying(true);
  }
  function navigate(next: LearningTab) {
    stopForNavigation();
    setPlaying(false);
    stopSpeaking();
    router.push(tabPaths[next]);
  }
  function setStep(next: number) {
    stopForNavigation();
    router.push(lessonPath(example, next), { scroll: false });
  }
  function chooseExample(i: number) {
    stopForNavigation();
    setPlaying(false);
    router.push(lessonPath(i));
  }
  function nextQuestion() {
    stopForNavigation();
    router.push(challengePath(question + 1));
  }
  function restartGame() {
    stopForNavigation();
    practice.resetPractice();
    router.push(challengePath(0));
  }
  const chunks = chunksFor(ex.n, ex.d);
  /** Read the current step aloud with highlights, without moving on. */
  function readStep() {
    const path = pathname;
    speakCues(
      steps[step].cues.map((c) => c.say),
      (i) => setCueState({ path, i }),
      () => setCueState({ path, i: null }),
    );
  }
  // While auto-play talks, a step's new numbers wait for the sentence that
  // mentions them; otherwise everything for the step shows straight away.
  const revealCue = playing && isExample ? (cue ?? -1) : Infinity;
  const focus =
    cue !== null && cue >= 0 ? steps[step].cues[cue].focus : steps[step].anchor;

  return {
    tab,
    example,
    step,
    playing,
    voice,
    voiceAvailable,
    narration,
    question,
    ...practice,
    stars:
      practice.stars + multiplicationPractice.stars + percentagePractice.stars,
    gold: practice.gold + multiplicationPractice.gold + percentagePractice.gold,
    divisionStars: { gold: practice.gold, silver: practice.silver },
    silver:
      practice.silver +
      multiplicationPractice.silver +
      percentagePractice.silver,
    percentagePractice,
    multiplicationPractice,
    completed,
    ex,
    steps,
    q,
    chunks,
    gameAutoplay,
    setGameAutoplay,
    cue,
    leaving,
    revealCue,
    focus,
    readStep,
    setStep,
    setPlaying,
    setVoice,
    toggleAutoplay,
    restartGame,
    setCompleted,
    speak,
    navigate,
    chooseExample,
    nextQuestion,
  };
}
export type LearningState = ReturnType<typeof useLearningController>;
