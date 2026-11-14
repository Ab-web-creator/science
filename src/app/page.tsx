import { Welcome } from "@/components/learning/welcome";
import { Adventure } from "@/components/learning/adventure";
import { WeekSummary } from "@/components/learning/week-summary";
export default function Home() {
  return (
    <section className="screen-page home-screen home-library">
      <Welcome />
      <Adventure />
      <WeekSummary />
    </section>
  );
}
