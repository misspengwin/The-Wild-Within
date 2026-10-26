import type { Resources } from './character';

export type QuestId = 'first-steps' | 'path-of-calling' | 'wanderers-trial';

export type QuestRequirement =
  /** Minutes of any activity. */
  | { kind: 'any-minutes'; minutes: number }
  /** Minutes of activities that match the player's archetype. */
  | { kind: 'affinity-minutes'; minutes: number }
  /** Minutes of activities outside the player's archetype. */
  | { kind: 'off-path-minutes'; minutes: number };

export interface QuestReward {
  xp: number;
  resources: Partial<Resources>;
}

export interface QuestDefinition {
  id: QuestId;
  title: string;
  icon: string;
  story: string;
  objective: string;
  requirement: QuestRequirement;
  reward: QuestReward;
}

/** active → ready (requirement met) → claimed (reward collected). */
export type QuestStatus = 'active' | 'ready' | 'claimed';

export interface QuestProgress {
  questId: QuestId;
  progressMinutes: number;
  status: QuestStatus;
  /** True if any simulated session contributed to this quest. */
  usedSimulatedData: boolean;
  completedAt?: string;
  claimedAt?: string;
}
