import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, Palette } from '@/constants/theme';

export type GameTextVariant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption';

export interface GameTextProps extends TextProps {
  variant?: GameTextVariant;
  color?: string;
}

export function GameText({ variant = 'body', color, style, ...rest }: GameTextProps) {
  return <Text style={[styles.base, styles[variant], color ? { color } : null, style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    color: Palette.ink,
    fontFamily: Fonts.rounded,
  },
  display: {
    fontFamily: Fonts.serif,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  heading: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
  },
  body: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
