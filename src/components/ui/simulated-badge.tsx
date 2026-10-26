import { StyleSheet, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/theme';

import { GameText } from './game-text';

/** Marks data that came from the simulator rather than a verified health source. */
export function SimulatedBadge({ label = 'Simulated' }: { label?: string }) {
  return (
    <View
      style={styles.badge}
      accessible
      accessibilityLabel={`${label}: not verified physical activity`}>
      <GameText variant="caption" color={Palette.simulated}>
        🧪 {label}
      </GameText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Palette.simulatedTint,
    borderColor: Palette.simulated,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
});
