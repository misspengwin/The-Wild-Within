import type { ActivitySession } from '@/models/activity';
import type { ArchetypeId } from '@/models/archetype';
import type { QuestDefinition, QuestId } from '@/models/quest';

import { isAffinityActivity } from './archetypes';
import { MAX_REWARDED_MINUTES_PER_SESSION } from './progression';

export const QUESTS: Record<QuestId, QuestDefinition> = {
  'first-steps': {
    id: 'first-steps',
    title: 'First Steps',
    icon: '🗺️',
    story: 'The village elder hands you a blank map. "Every legend begins with a single step."',
    objective: 'Do 10 minutes of any activity',
    requirement: { kind: 'any-minutes', minutes: 10 },
    reward: { xp: 50, resources: { coins: 10 } },
  },
  'path-of-calling': {
    id: 'path-of-calling',
    title: 'Path of Your Calling',
    icon: '🔥',
    story: 'Your crest glows faintly. Train in the ways of your path to awaken its power.',
    objective: 'Do 20 minutes of your archetype’s activities',
    requirement: { kind: 'affinity-minutes', minutes: 20 },
    reward: { xp: 100, resources: { crystals: 3 } },
  },
  'wanderers-trial': {
    id: 'wanderers-trial',
    title: 'The Wanderer’s Trial',
    icon: '🧭',
    story: 'A traveling sage challenges you: "True heroes learn from every path, not just their own."',
    objective: 'Do 10 minutes of an activity outside your archetype',
    requirement: { kind: 'off-path-minutes', minutes: 10 },
    reward: { xp: 75, resources: { herbs: 5, coins: 5 } },
  },
};

export const QUEST_ORDER: QuestId[] = ['first-steps', 'path-of-calling', 'wanderers-trial'];

export function getQuestTarget(quest: QuestDefinition): number {
  return quest.requirement.minutes;
}

/** How many minutes of `session` count toward `quest` for this archetype. */
export function getQuestContribution(
  quest: QuestDefinition,
  session: ActivitySession,
  archetypeId: ArchetypeId,
): number {
  const minutes = Math.min(Math.max(0, session.durationMinutes), MAX_REWARDED_MINUTES_PER_SESSION);
  const affinity = isAffinityActivity(archetypeId, session.category);
  switch (quest.requirement.kind) {
    case 'any-minutes':
      return minutes;
    case 'affinity-minutes':
      return affinity ? minutes : 0;
    case 'off-path-minutes':
      return affinity ? 0 : minutes;
  }
}
