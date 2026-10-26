import type { ActivityCategory } from './activity';

export type ArchetypeId = 'warrior' | 'ranger' | 'druid' | 'elementalist';

export interface Archetype {
  id: ArchetypeId;
  name: string;
  /** Short in-world title, e.g. "Keeper of the Forge". */
  epithet: string;
  /** One-line summary of the real-world activities this path favors. */
  activityFocus: string;
  description: string;
  /** Activities that earn this archetype bonus rewards. */
  affinities: ActivityCategory[];
  /** Emoji crest; renders on iOS and Android without bundled art. */
  crest: string;
  colors: {
    primary: string;
    secondary: string;
    /** Light tint for card backgrounds. */
    tint: string;
    onPrimary: string;
  };
}
