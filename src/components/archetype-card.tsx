import { Pressable, StyleSheet, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/theme';
import { ACTIVITY_CATEGORIES } from '@/models/activity';
import type { Archetype } from '@/models/archetype';

import { Crest } from './crest';
import { GameText } from './ui/game-text';

export interface ArchetypeCardProps {
  archetype: Archetype;
  selected: boolean;
  onPress: () => void;
}

export function ArchetypeCard({ archetype, selected, onPress }: ArchetypeCardProps) {
  const { colors } = archetype;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${archetype.name}, ${archetype.activityFocus}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: selected ? colors.primary : Palette.parchmentBorder, backgroundColor: colors.tint },
        selected && { boxShadow: `0 6px 18px ${colors.primary}55` },
        pressed && styles.pressed,
      ]}>
      <View
        style={[
          styles.banner,
          { experimental_backgroundImage: `linear-gradient(120deg, ${colors.primary}, ${colors.secondary})` },
        ]}
      />
      <View style={styles.header}>
        <Crest archetype={archetype} size={68} />
        <View style={styles.headerText}>
          <GameText variant="title" color={colors.primary}>
            {archetype.name}
          </GameText>
          <GameText variant="label" color={Palette.inkSoft}>
            {archetype.epithet}
          </GameText>
        </View>
        {selected && (
          <View style={[styles.check, { backgroundColor: colors.primary }]}>
            <GameText variant="heading" color={colors.onPrimary}>
              ✓
            </GameText>
          </View>
        )}
      </View>

      <View style={styles.chips}>
        {archetype.affinities.map((category) => {
          const info = ACTIVITY_CATEGORIES[category];
          return (
            <View key={category} style={[styles.chip, { borderColor: colors.primary }]}>
              <GameText variant="label" color={colors.primary}>
                {info.icon} {info.label}
              </GameText>
            </View>
          );
        })}
      </View>

      {selected && <GameText variant="body">{archetype.description}</GameText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.large,
    borderWidth: 3,
    padding: Spacing.three,
    paddingTop: Spacing.three + 8,
    gap: Spacing.three,
    overflow: 'hidden',
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  headerText: {
    flex: 1,
    gap: Spacing.half,
  },
  check: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    backgroundColor: Palette.white,
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
  },
});
