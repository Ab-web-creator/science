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
  );
  const percentageMatch = pathname.match(/^\/play\/percentages\/(\d+)$/);
  const percentagePractice = usePractice(
    percentageMatch ? Number(percentageMatch[1]) - 1 : 0,
    percentageQuestions,
  );
  const [playing, setPlaying] = useState(false),
    [voice, setVoice] = useState(false);
  const autoplayStart = useRef<string | null>(null);
  const narration = useNarration();
  const { voiceAvailable, speak, stopSpeaking } = narration;
  const stopNavigationPlayback = useCallback(() => {
    stopSpeaking();
    autoplayStart.current = null;
    setVoice(false);
    setPlaying(false);
  }, [stopSpeaking]);
  useNavigationSpeechStop(stopNavigationPlayback, stopSpeaking);
  const [completed, setCompleted] = useState<number[]>([]);
  const ex = examples[example],
    steps = stepsFor(ex.n, ex.d),
    q = questions[Math.min(question, questions.length - 1)];
  useEffect(() => {
    if (voice && isExample) {
      if (autoplayStart.current && autoplayStart.current !== pathname)
        return stopSpeaking;
      autoplayStart.current = null;
      speak(stepsFor(ex.n, ex.d)[step].text, () => {
        if (!playing) return;
        if (step < 6)
          router.replace(lessonPath(example, step + 1), { scroll: false });
        else {
          setVoice(false);
          setPlaying(false);
        }
      });
    }
    return stopSpeaking;
  }, [
    pathname,
    step,
    ex.n,
    ex.d,
    voice,
    isExample,
    speak,
    stopSpeaking,
    playing,
    example,
    router,
  ]);
  function toggleAutoplay() {
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
    percentagePractice,
    multiplicationPractice,
    completed,
    ex,
    steps,
    q,
    chunks,
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
