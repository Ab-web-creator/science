import { SkillChoices } from "@/components/learning/skill-choices";
export const metadata = { title: "Choose a practice game | Little Orbit" };
export default function Play() {
  return (
    <section className="screen-page home-screen">
      <h1 className="inner-title">
        Pick your <span className="serif-word">practice game.</span>
      </h1>
      <p className="page-intro">
        Hints, friendly retries, and stars for your thinking.
      </p>
      <SkillChoices mode="play" />
    </section>
  );
}
