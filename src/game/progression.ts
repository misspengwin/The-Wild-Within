import type { ActivitySession } from '@/models/activity';
import type { ArchetypeId } from '@/models/archetype';

import { isAffinityActivity } from './archetypes';

export const MAX_ENERGY = 100;
/** Bonus multiplier for activities that match the player's archetype. */
export const AFFINITY_MULTIPLIER = 1.5;
/** Caps how much a single session can reward, to blunt bad or inflated data. */
export const MAX_REWARDED_MINUTES_PER_SESSION = 120;

const XP_PER_MINUTE = 2;
const ENERGY_PER_MINUTE = 1;

/** XP needed to go from `level` to `level + 1`. Grows gently so early levels feel quick. */
export function xpToNextLevel(level: number): number {
  return 100 + (level - 1) * 50;
}

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  /** 0..1 progress toward the next level. */
  progress: number;
}

export function getLevelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, totalXp);
  while (remaining >= xpToNextLevel(level)) {
    remaining -= xpToNextLevel(level);
    level += 1;
  }
  const xpForNextLevel = xpToNextLevel(level);
  return { level, xpIntoLevel: remaining, xpForNextLevel, progress: remaining / xpForNextLevel };
}

export interface ActivityReward {
  xp: number;
  energy: number;
  affinity: boolean;
}

export function getActivityReward(session: ActivitySession, archetypeId: ArchetypeId): ActivityReward {
  const minutes = Math.min(Math.max(0, session.durationMinutes), MAX_REWARDED_MINUTES_PER_SESSION);
  const affinity = isAffinityActivity(archetypeId, session.category);
  const multiplier = affinity ? AFFINITY_MULTIPLIER : 1;
  return {
    xp: Math.round(minutes * XP_PER_MINUTE * multiplier),
    energy: Math.round(minutes * ENERGY_PER_MINUTE * multiplier),
    affinity,
  };
}
