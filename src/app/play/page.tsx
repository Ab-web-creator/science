import { SkillChoices } from "@/components/learning/skill-choices";
import { TodayMission } from "@/components/learning/today-mission";
export const metadata = { title: "Choose a practice game | Little Orbit" };
export default function Play() {
  return (
    <section className="screen-page home-screen play-hub">
      <h1 className="inner-title">
        Pick your <span className="serif-word">practice game.</span>
      </h1>
      <p className="page-intro">
        Turn all your stars gold! ✦ Gold means right the first time; ✧ silver
        means you kept trying.
      </p>
      <TodayMission />
      <SkillChoices mode="play" />
    </section>
  );
}
