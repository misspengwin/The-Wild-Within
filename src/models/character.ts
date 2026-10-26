import type { ArchetypeId } from './archetype';

export type ResourceId = 'coins' | 'herbs' | 'crystals';

export type Resources = Record<ResourceId, number>;

export interface Character {
  archetypeId: ArchetypeId;
  /** ISO-8601 timestamp. */
  createdAt: string;
  /** Lifetime experience; level is derived from this (see game/progression). */
  totalXp: number;
  /** 0..MAX_ENERGY. Earned through activity, spent on adventures in a later milestone. */
  energy: number;
  resources: Resources;
}
