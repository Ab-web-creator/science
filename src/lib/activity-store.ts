import { createLocalStore } from "./local-store";
import { emptyActivity, type Activity } from "./activity";

/** Saved in this browser: daily solves and the picked daily missions. */
export const activityStore = createLocalStore<Activity>(
  "little-orbit-activity",
  emptyActivity,
);
