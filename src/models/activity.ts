/**
 * Activity data models.
 *
 * Every session records where it came from (`source`) and whether that source
 * is a trusted health platform (`verified`). Simulated sessions are never
 * verified, so the UI and game logic can always tell them apart.
 */

export type ActivityCategory =
  | 'strength'
  | 'walking'
  | 'hiking'
  | 'running'
  | 'yoga'
  | 'stretching'
  | 'mobility'
  | 'dancing'
  | 'cycling'
  | 'cardio';

/** Where an activity session came from. Health platforms are future sources. */
export type ActivitySource = 'simulated' | 'apple-healthkit' | 'android-health-connect';

export interface ActivitySession {
  /** Unique per source; used to de-duplicate when syncing. */
  id: string;
  category: ActivityCategory;
  /** ISO-8601 timestamps. */
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  steps?: number;
  source: ActivitySource;
  /** True only when the data came from a trusted health platform. */
  verified: boolean;
}

export interface ActivityCategoryInfo {
  id: ActivityCategory;
  label: string;
  icon: string;
  /** Rough steps per minute, used only by the simulator. */
  simulatedStepsPerMinute: number;
}

export const ACTIVITY_CATEGORIES: Record<ActivityCategory, ActivityCategoryInfo> = {
  strength: { id: 'strength', label: 'Strength', icon: '🏋️', simulatedStepsPerMinute: 10 },
  walking: { id: 'walking', label: 'Walking', icon: '🚶', simulatedStepsPerMinute: 100 },
  hiking: { id: 'hiking', label: 'Hiking', icon: '🥾', simulatedStepsPerMinute: 90 },
  running: { id: 'running', label: 'Running', icon: '🏃', simulatedStepsPerMinute: 160 },
  yoga: { id: 'yoga', label: 'Yoga', icon: '🧘', simulatedStepsPerMinute: 0 },
  stretching: { id: 'stretching', label: 'Stretching', icon: '🤸', simulatedStepsPerMinute: 0 },
  mobility: { id: 'mobility', label: 'Mobility', icon: '🌀', simulatedStepsPerMinute: 5 },
  dancing: { id: 'dancing', label: 'Dancing', icon: '💃', simulatedStepsPerMinute: 80 },
  cycling: { id: 'cycling', label: 'Cycling', icon: '🚴', simulatedStepsPerMinute: 0 },
  cardio: { id: 'cardio', label: 'Cardio', icon: '❤️‍🔥', simulatedStepsPerMinute: 120 },
};

export function isSimulated(session: ActivitySession): boolean {
  return session.source === 'simulated';
}
