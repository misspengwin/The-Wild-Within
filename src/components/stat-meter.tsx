import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Palette, Spacing } from '@/constants/theme';

import { GameText } from './ui/game-text';
import { ProgressBar } from './ui/progress-bar';

export interface StatMeterProps {
  icon: string;
  label: string;
  valueText: string;
  progress: number;
  color: string;
  striped?: boolean;
  /** Extra content under the bar, e.g. a simulated badge. */
  footer?: ReactNode;
}

export function StatMeter({ icon, label, valueText, progress, color, striped, footer }: StatMeterProps) {
  return (
    <View style={styles.container} accessible accessibilityLabel={`${label}: ${valueText}`}>
      <View style={styles.row}>
        <GameText variant="label">
          {icon} {label}
        </GameText>
        <GameText variant="label" color={Palette.inkSoft}>
          {valueText}
        </GameText>
      </View>
      <ProgressBar progress={progress} color={color} striped={striped} />
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
