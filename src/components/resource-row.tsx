import { StyleSheet, View } from 'react-native';

import { RESOURCE_INFO, RESOURCE_ORDER } from '@/constants/resources';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { Resources } from '@/models/character';

import { GameText } from './ui/game-text';

export function ResourceRow({ resources }: { resources: Resources }) {
  return (
    <View style={styles.row}>
      {RESOURCE_ORDER.map((id) => {
        const info = RESOURCE_INFO[id];
        return (
          <View key={id} style={styles.item} accessible accessibilityLabel={`${resources[id]} ${info.label}`}>
            <GameText style={styles.icon}>{info.icon}</GameText>
            <GameText variant="heading">{resources[id]}</GameText>
            <GameText variant="caption" color={Palette.inkSoft} numberOfLines={1}>
              {info.label}
            </GameText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
    backgroundColor: Palette.parchment,
    borderRadius: Radius.medium,
    borderWidth: 1.5,
    borderColor: Palette.parchmentBorder,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  icon: {
    fontSize: 22,
    lineHeight: 28,
  },
});
