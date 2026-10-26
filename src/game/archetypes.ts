import type { ActivityCategory } from '@/models/activity';
import type { Archetype, ArchetypeId } from '@/models/archetype';

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    epithet: 'Shieldbearer of the Iron Vale',
    activityFocus: 'Strength training',
    description:
      'Forged in the mountain halls, Warriors grow mightier with every lift, push and pull. Your strength becomes the shield that protects your party.',
    affinities: ['strength'],
    crest: '⚔️',
    colors: { primary: '#C8283E', secondary: '#F59E2E', tint: '#FDECE6', onPrimary: '#FFFFFF' },
  },
  ranger: {
    id: 'ranger',
    name: 'Ranger',
    epithet: 'Pathfinder of the Endless Trails',
    activityFocus: 'Walking, hiking & running',
    description:
      'Rangers map the wild places one step at a time. Every walk, hike and run reveals new paths and hidden treasures for your party.',
    affinities: ['walking', 'hiking', 'running'],
    crest: '🏹',
    colors: { primary: '#2167D1', secondary: '#4FD1E8', tint: '#E6F1FD', onPrimary: '#FFFFFF' },
  },
  druid: {
    id: 'druid',
    name: 'Druid',
    epithet: 'Warden of the Whispering Grove',
    activityFocus: 'Yoga, stretching & mobility',
    description:
      'Druids draw calm power from balance and breath. Through yoga and stretching you restore your party and coax the ancient groves back to life.',
    affinities: ['yoga', 'stretching', 'mobility'],
    crest: '🌿',
    colors: { primary: '#3E8E3A', secondary: '#B6DE5A', tint: '#ECF7E4', onPrimary: '#FFFFFF' },
  },
  elementalist: {
    id: 'elementalist',
    name: 'Elementalist',
    epithet: 'Stormcaller of the Shimmering Skies',
    activityFocus: 'Dancing, cycling & cardio',
    description:
      'Elementalists channel rhythm and momentum into raw magic. Dance, ride and race to summon storms of light that dazzle your foes.',
    affinities: ['dancing', 'cycling', 'cardio'],
    crest: '⚡',
    colors: { primary: '#7A3FE0', secondary: '#FF5FA8', tint: '#F3EBFE', onPrimary: '#FFFFFF' },
  },
};

export const ARCHETYPE_ORDER: ArchetypeId[] = ['warrior', 'ranger', 'druid', 'elementalist'];

export function getArchetype(id: ArchetypeId): Archetype {
  return ARCHETYPES[id];
}

export function isAffinityActivity(archetypeId: ArchetypeId, category: ActivityCategory): boolean {
  return ARCHETYPES[archetypeId].affinities.includes(category);
}
