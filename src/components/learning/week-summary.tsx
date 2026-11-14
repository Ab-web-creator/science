"use client";
import { useSyncExternalStore } from "react";
import { activityStore } from "@/lib/activity-store";
import { streak, weekSummary } from "@/lib/activity";
import { useToday } from "@/hooks/use-today";

/** For grown-ups: the last 7 days at a glance, something to praise at dinner. */
export function WeekSummary() {
  const activity = useSyncExternalStore(
    activityStore.subscribe,
    activityStore.get,
    activityStore.getServer,
  );
  const today = useToday();
  if (!today) return <section className="week-summary" aria-busy="true" />;
  const { gold, silver, days } = weekSummary(activity, today);
  const inARow = streak(activity, today);
  return (
    <section className="week-summary" aria-label="This week, for grown-ups">
      <span className="eyebrow">FOR GROWN-UPS · THIS WEEK</span>
      {gold + silver === 0 ? (
        <p>
          No practice yet this week. Today’s mission on the Play page takes
          about 5 minutes.
        </p>
      ) : (
        <p>
          <span className="star-gold">✦ {gold} gold</span> ·{" "}
          <span className="star-silver">✧ {silver} silver</span> · practised{" "}
          <b>{days} of 7 days</b>
          {inARow > 1 && <> · 🔥 {inARow} days in a row</>}
          <br />
          <small>
            Gold: right the first time. Silver: kept trying after a mistake.
            Both are worth praising!
          </small>
        </p>
      )}
    </section>
  );
}
