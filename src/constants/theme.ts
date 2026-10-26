/**
 * Visual theme: a bright storybook palette that reads well for kids and adults.
 * Archetype-specific colors live with the archetype data in game/archetypes.ts.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Palette = {
  /** Warm parchment backgrounds for in-game screens. */
  parchment: '#FFF8EA',
  parchmentDeep: '#F7E8C8',
  parchmentBorder: '#E9D3A6',
  /** Deep twilight used on the welcome screen. */
  night: '#1B1640',
  nightSoft: '#2E2766',
  ink: '#2A2140',
  inkSoft: '#5E5575',
  white: '#FFFFFF',
  gold: '#F5B83D',
  goldDeep: '#B9790A',
  xp: '#7357F6',
  energy: '#16B8A0',
  daily: '#FF8A3D',
  track: '#EADFC7',
  /** Reserved for marking simulated, unverified activity. */
  simulated: '#D9367A',
  simulatedTint: '#FDE7F0',
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 10,
  medium: 16,
  large: 24,
  pill: 999,
} as const;

export const MaxContentWidth = 640;
