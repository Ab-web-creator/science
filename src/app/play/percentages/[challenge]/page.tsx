import { Suspense } from "react";
import { RouteLoading } from "@/components/learning/route-loading";
import { notFound } from "next/navigation";
import { percentageQuestions } from "@/lib/percentages";
import { PercentageGame } from "@/components/percentages/game";
type Params = { challenge: string };
export function generateStaticParams(): Params[] {
  return [
    ...percentageQuestions.map((_, i) => ({ challenge: String(i + 1) })),
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
    title: `Percentage · ${challenge === "complete" ? "Mission complete" : `Challenge ${challenge}`} | Little Orbit`,
  };
}
export default function PercentageChallenge({
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
    !percentageQuestions.some((_, i) => String(i + 1) === challenge)
  )
    notFound();
  return <PercentageGame challenge={challenge} />;
}
