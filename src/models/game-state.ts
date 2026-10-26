import type { ActivitySession } from './activity';
import type { Character } from './character';
import type { QuestId, QuestProgress, QuestReward } from './quest';

export const GAME_STATE_VERSION = 1;

export interface GameState {
  version: typeof GAME_STATE_VERSION;
  character: Character | null;
  activityLog: ActivitySession[];
  quests: Partial<Record<QuestId, QuestProgress>>;
  dailyGoalMinutes: number;
}

/** Things that happened as a result of a game action, for UI feedback. */
export type GameEvent =
  | { type: 'activity-rewarded'; xp: number; energy: number; simulated: boolean }
  | { type: 'level-up'; level: number }
  | { type: 'quest-ready'; questId: QuestId }
  | { type: 'quest-claimed'; questId: QuestId; reward: QuestReward };
