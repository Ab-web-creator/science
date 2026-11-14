import { notFound } from "next/navigation";
import { questions } from "@/lib/division";
import { GameView } from "@/components/learning/game-view";

type Params = { challenge: string };

export function generateStaticParams(): Params[] {
  return [
    ...questions.map((_, i) => ({ challenge: String(i + 1) })),
    { challenge: "complete" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { challenge } = await params;
  return {
    title: `${challenge === "complete" ? "Mission complete" : `Challenge ${challenge}`} | Little Orbit`,
  };
}

export default async function ChallengePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { challenge } = await params;
  if (
    challenge !== "complete" &&
    !questions.some((_, i) => String(i + 1) === challenge)
  )
    notFound();
  return <GameView />;
}
