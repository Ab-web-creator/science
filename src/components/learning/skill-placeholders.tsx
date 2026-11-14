const upcomingSkills = [
  {
    icon: "½",
    title: "Explore fractions",
    description: "Parts, wholes, and equal shares.",
  },
  {
    icon: "◷",
    title: "Tell the time",
    description: "Read clocks and work out durations.",
  },
  {
    icon: "€",
    title: "Count money",
    description: "Prices, totals, and change.",
  },
  {
    icon: "↔",
    title: "Measure things",
    description: "Explore length, weight, and volume.",
  },
  {
    icon: "△",
    title: "Discover shapes",
    description: "Angles, shapes, and patterns.",
  },
];

export function SkillPlaceholders() {
  return upcomingSkills.map(({ icon, title, description }) => (
    <article className="home-choice home-placeholder" key={title}>
      <span aria-hidden="true">{icon}</span>
      <div>
        <span className="coming-soon">Coming soon</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </article>
  ));
}
