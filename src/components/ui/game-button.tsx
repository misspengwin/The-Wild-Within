import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/theme';

import { GameText } from './game-text';

export interface GameButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Overrides the primary fill color, e.g. with an archetype color. */
  color?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function GameButton({
  label,
  variant = 'primary',
  color = Palette.gold,
  textColor,
  disabled,
  style,
  ...rest
}: GameButtonProps) {
  const isPrimary = variant === 'primary';
  const labelColor = textColor ?? (isPrimary ? Palette.ink : variant === 'ghost' ? Palette.inkSoft : color);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary && { backgroundColor: color, borderBottomColor: 'rgba(0,0,0,0.22)' },
        variant === 'secondary' && [styles.secondary, { borderColor: color }],
        variant === 'ghost' && styles.ghost,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}>
      <GameText variant="heading" color={labelColor} style={styles.label}>
        {label}
      </GameText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three - 2,
    borderRadius: Radius.medium,
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: Palette.white,
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  ghost: {
    minHeight: 44,
    borderBottomWidth: 0,
  },
  pressed: {
    transform: [{ translateY: 2 }, { scale: 0.98 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    textAlign: 'center',
  },
});
