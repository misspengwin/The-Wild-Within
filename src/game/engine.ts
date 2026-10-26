/**
 * Pure game rules. Every function takes a state and returns a new state plus
 * the events it produced, so the logic is easy to test and has no UI or
 * storage dependencies.
 */
import { isSimulated, type ActivitySession } from '@/models/activity';
import type { ArchetypeId } from '@/models/archetype';
import type { Resources } from '@/models/character';
import { GAME_STATE_VERSION, type GameEvent, type GameState } from '@/models/game-state';
import type { QuestId, QuestProgress } from '@/models/quest';

import { getActivityReward, getLevelInfo, MAX_ENERGY } from './progression';
import { getQuestContribution, getQuestTarget, QUEST_ORDER, QUESTS } from './quests';

export const DEFAULT_DAILY_GOAL_MINUTES = 30;

export interface GameResult {
  state: GameState;
  events: GameEvent[];
}

export function createInitialGameState(): GameState {
  return {
    version: GAME_STATE_VERSION,
    character: null,
    activityLog: [],
    quests: {},
    dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES,
  };
}

export function createCharacter(state: GameState, archetypeId: ArchetypeId, now: Date): GameState {
  const quests: GameState['quests'] = {};
  for (const questId of QUEST_ORDER) {
    quests[questId] = { questId, progressMinutes: 0, status: 'active', usedSimulatedData: false };
  }
  return {
    ...state,
    character: {
      archetypeId,
      createdAt: now.toISOString(),
      totalXp: 0,
      energy: 0,
      resources: { coins: 0, herbs: 0, crystals: 0 },
    },
    activityLog: [],
    quests,
  };
}

/**
 * Adds new activity sessions to the log and applies their rewards.
 * Sessions already in the log (same id) are ignored, so providers can safely
 * re-send overlapping data when syncing.
 */
export function ingestSessions(state: GameState, sessions: ActivitySession[]): GameResult {
  const character = state.character;
  if (!character) return { state, events: [] };

  const knownIds = new Set(state.activityLog.map((s) => s.id));
  const fresh = sessions.filter((s) => !knownIds.has(s.id));
  if (fresh.length === 0) return { state, events: [] };

  const events: GameEvent[] = [];
  const startLevel = getLevelInfo(character.totalXp).level;
  let totalXp = character.totalXp;
  let energy = character.energy;
  const quests = { ...state.quests };

  for (const session of fresh) {
    const reward = getActivityReward(session, character.archetypeId);
    totalXp += reward.xp;
    energy = Math.min(MAX_ENERGY, energy + reward.energy);
    events.push({
      type: 'activity-rewarded',
      xp: reward.xp,
      energy: reward.energy,
      simulated: isSimulated(session),
    });

    for (const questId of QUEST_ORDER) {
      const progress = quests[questId];
      if (!progress || progress.status !== 'active') continue;
      const quest = QUESTS[questId];
      const added = getQuestContribution(quest, session, character.archetypeId);
      if (added <= 0) continue;

      const target = getQuestTarget(quest);
      const progressMinutes = Math.min(target, progress.progressMinutes + added);
      const isReady = progressMinutes >= target;
      quests[questId] = {
        ...progress,
        progressMinutes,
        usedSimulatedData: progress.usedSimulatedData || isSimulated(session),
        status: isReady ? 'ready' : 'active',
        completedAt: isReady ? session.endedAt : undefined,
      };
      if (isReady) events.push({ type: 'quest-ready', questId });
    }
  }

  const endLevel = getLevelInfo(totalXp).level;
  if (endLevel > startLevel) events.push({ type: 'level-up', level: endLevel });

  return {
    state: {
      ...state,
      character: { ...character, totalXp, energy },
      activityLog: [...state.activityLog, ...fresh],
      quests,
    },
    events,
  };
}

/** Collects a completed quest's reward. */
export function claimQuest(state: GameState, questId: QuestId, now: Date): GameResult {
  const character = state.character;
  const progress = state.quests[questId];
  if (!character || !progress || progress.status !== 'ready') return { state, events: [] };

  const { reward } = QUESTS[questId];
  const resources: Resources = { ...character.resources };
  for (const [id, amount] of Object.entries(reward.resources) as [keyof Resources, number][]) {
    resources[id] += amount;
  }

  const startLevel = getLevelInfo(character.totalXp).level;
  const totalXp = character.totalXp + reward.xp;
  const endLevel = getLevelInfo(totalXp).level;

  const claimed: QuestProgress = { ...progress, status: 'claimed', claimedAt: now.toISOString() };
  const events: GameEvent[] = [{ type: 'quest-claimed', questId, reward }];
  if (endLevel > startLevel) events.push({ type: 'level-up', level: endLevel });

  return {
    state: {
      ...state,
      character: { ...character, totalXp, resources },
      quests: { ...state.quests, [questId]: claimed },
    },
    events,
  };
}

export interface DailySummary {
  minutes: number;
  steps: number;
  sessionCount: number;
  simulatedMinutes: number;
  goalMinutes: number;
  /** 0..1, capped. */
  progress: number;
}

export function getDailySummary(state: GameState, day: Date): DailySummary {
  const key = toLocalDateKey(day);
  let minutes = 0;
  let steps = 0;
  let sessionCount = 0;
  let simulatedMinutes = 0;
  for (const session of state.activityLog) {
    if (toLocalDateKey(new Date(session.startedAt)) !== key) continue;
    minutes += session.durationMinutes;
    steps += session.steps ?? 0;
    sessionCount += 1;
    if (isSimulated(session)) simulatedMinutes += session.durationMinutes;
  }
  return {
    minutes,
    steps,
    sessionCount,
    simulatedMinutes,
    goalMinutes: state.dailyGoalMinutes,
    progress: Math.min(1, minutes / state.dailyGoalMinutes),
  };
}

export function toLocalDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
