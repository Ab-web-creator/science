import { Suspense } from "react";
import { RouteLoading } from "@/components/learning/route-loading";
import { notFound } from "next/navigation";
import { multiplicationExamples } from "@/lib/multiplication";
import { MultiplicationLesson } from "@/components/multiplication/lesson";
type Params = { example: string; step: string };
export function generateStaticParams(): Params[] {
  return multiplicationExamples.flatMap((ex) =>
    Array.from({ length: 4 }, (_, i) => ({
      example: `${ex.a}-${ex.b}`,
      step: String(i + 1),
    })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { example, step } = await params;
  return {
    title: `${example.replace("-", " × ")} · Step ${step} | Little Orbit`,
  };
}
export default function MultiplicationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  return (
    <Suspense fallback={<RouteLoading kind="lesson" />}>
      <RouteContent params={params} />
    </Suspense>
  );
}

async function RouteContent({ params }: { params: Promise<Params> }) {
  const { example, step } = await params;
  const index = multiplicationExamples.findIndex(
    (ex) => `${ex.a}-${ex.b}` === example,
  );
  if (index === -1 || !/^[1-4]$/.test(step)) notFound();
  return <MultiplicationLesson example={index} step={Number(step) - 1} />;
}
