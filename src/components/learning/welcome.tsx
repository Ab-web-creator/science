import { Robot } from "./robot";
export function Welcome() {
  return (
    <section className="home-welcome">
      <div>
        <div className="eyebrow">YOUR SPACE TO GROW</div>
        <h1>Hey, Azat Sa 👋</h1>
        <p>What do you want to learn today?</p>
      </div>
      <Robot />
    </section>
  );
}
