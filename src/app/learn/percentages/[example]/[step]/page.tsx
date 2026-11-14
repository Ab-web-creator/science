import { notFound } from "next/navigation";
import { percentageExamples } from "@/lib/percentages";
import { PercentageLesson } from "@/components/percentages/lesson";
type Params = { example: string; step: string };
export function generateStaticParams(): Params[] {
  return percentageExamples.flatMap((ex) =>
    Array.from({ length: 4 }, (_, i) => ({
      example: `${ex.a}-of-${ex.b}`,
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
    title: `${example.replace("-of-", "% of ")} · Step ${step} | Little Orbit`,
  };
}
export default async function PercentagePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { example, step } = await params;
  const index = percentageExamples.findIndex(
    (ex) => `${ex.a}-of-${ex.b}` === example,
  );
  if (index === -1 || !/^[1-4]$/.test(step)) notFound();
  return <PercentageLesson example={index} step={Number(step) - 1} />;
}
