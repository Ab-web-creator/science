"use client";
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { activityStore } from "@/lib/activity-store";
import { starStore } from "@/lib/star-store";
import { challenges, games } from "@/lib/challenges";
import { missionDone, pickMission, streak } from "@/lib/activity";
import { useToday } from "@/hooks/use-today";

/** Three short challenges a day (about 5 minutes) and a streak counter. */
export function TodayMission() {
  const activity = useSyncExternalStore(
    activityStore.subscribe,
    activityStore.get,
    activityStore.getServer,
  );
  const today = useToday();
  const mission = today ? activity.missions[today] : undefined;

  // Pick today's 3 once and save them, so the mission stays the same all day.
  useEffect(() => {
    if (!today || activityStore.get().missions[today]) return;
    const gold = new Set<string>();
    for (const g of games)
      for (const [i, s] of Object.entries(starStore.get(g.storageKey)))
        if (s === "gold") gold.add(`${g.game}:${i}`);
    const picked = pickMission(
      challenges.map((c) => c.id),
      gold,
      today,
    );
    activityStore.update((a) => ({
      ...a,
      missions: { ...a.missions, [today]: picked },
    }));
  }, [today]);

  if (!today || !mission)
    return <section className="today-mission" aria-busy="true" />;
  const solved = activity.days[today] ?? {};
  const done = missionDone(activity, today);
  const days = streak(activity, today);
  const count = mission.filter((id) => solved[id]).length;
  return (
    <section className="today-mission" aria-label="Today's mission">
      <div className="today-head">
        <h2>{done ? "Mission complete! 🎉" : "Today’s mission"}</h2>
        <span className="streak">
          {days > 0
            ? `🔥 ${days} ${days === 1 ? "day" : "days"} in a row`
            : "🔥 Start a streak today!"}
        </span>
      </div>
      <p>
        {done
          ? "Great work! Come back tomorrow for a new mission."
          : `3 short challenges, about 5 minutes. ${count} of 3 done.`}
      </p>
      <ol className="today-list">
        {mission.map((id) => {
          const c = challenges.find((x) => x.id === id);
          if (!c) return null;
          const star = solved[id];
          return (
            <li key={id}>
              <Link href={c.href} className={star ? `done ${star}` : ""}>
                <span className="today-icon" aria-hidden="true">
                  {c.icon}
                </span>
                {c.label}
                <b aria-label={star ? `done, ${star} star` : "not done yet"}>
                  {star === "gold" ? "✦" : star === "silver" ? "✧" : "→"}
                </b>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
