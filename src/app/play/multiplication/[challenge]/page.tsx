import { Suspense } from "react";
import { RouteLoading } from "@/components/learning/route-loading";
import { notFound } from "next/navigation";
import { multiplicationQuestions } from "@/lib/multiplication";
import { MultiplicationGame } from "@/components/multiplication/game";
type Params = { challenge: string };
export function generateStaticParams(): Params[] {
  return [
    ...multiplicationQuestions.map((_, i) => ({ challenge: String(i + 1) })),
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
    title: `Multiplication · ${challenge === "complete" ? "Mission complete" : `Challenge ${challenge}`} | Little Orbit`,
  };
}
export default function MultiplicationChallenge({
  params,
}: {
  params: Promise<Params>;
}) {
  return (
    <Suspense fallback={<RouteLoading kind="game" />}>
      <RouteContent params={params} />
    </Suspense>
  );
}

async function RouteContent({ params }: { params: Promise<Params> }) {
  const { challenge } = await params;
  if (
    challenge !== "complete" &&
    !multiplicationQuestions.some((_, i) => String(i + 1) === challenge)
  )
    notFound();
  return <MultiplicationGame challenge={challenge} />;
}
