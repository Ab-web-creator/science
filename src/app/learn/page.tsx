import { SkillChoices } from "@/components/learning/skill-choices";
export const metadata = { title: "Choose a skill | Little Orbit" };
export default function Learn() {
  return (
    <section className="screen-page home-screen">
      <h1 className="inner-title">
        What shall we <span className="serif-word">learn?</span>
      </h1>
      <p className="page-intro">
        Choose a skill, Azat Sa. We’ll figure it out together.
      </p>
      <SkillChoices />
    </section>
  );
}
