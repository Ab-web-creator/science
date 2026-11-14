import { Suspense } from "react";
import { RouteLoading } from "@/components/learning/route-loading";
import { notFound } from "next/navigation";
import { examples } from "@/lib/division";
import { LessonView } from "@/components/learning/lesson-view";

type Params = { example: string; step: string };

export function generateStaticParams(): Params[] {
  return examples.flatMap((ex) =>
    Array.from({ length: 7 }, (_, i) => ({
      example: String(ex.n),
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
  const ex = examples.find((ex) => String(ex.n) === example);
  return {
    title: ex
      ? `${ex.n} : ${ex.d} · Step ${step} | Little Orbit`
      : "Lesson not found",
  };
}

export default function LessonPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={<RouteLoading kind="lesson" />}>
      <RouteContent params={params} />
    </Suspense>
  );
}

async function RouteContent({ params }: { params: Promise<Params> }) {
  const { example, step } = await params;
  if (!examples.some((ex) => String(ex.n) === example) || !/^[1-7]$/.test(step))
    notFound();
  return <LessonView />;
}
