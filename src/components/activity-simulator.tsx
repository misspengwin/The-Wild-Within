import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/theme';
import { isAffinityActivity } from '@/game/archetypes';
import { ACTIVITY_CATEGORIES, type ActivityCategory } from '@/models/activity';
import type { Archetype } from '@/models/archetype';

import { GameButton } from './ui/game-button';
import { GameText } from './ui/game-text';
import { SimulatedBadge } from './ui/simulated-badge';

const DURATIONS = [5, 10, 20, 30];

export interface ActivitySimulatorProps {
  archetype: Archetype;
  onSimulate: (category: ActivityCategory, durationMinutes: number) => void;
}

/** Prototype-only panel for generating fake activity sessions. */
export function ActivitySimulator({ archetype, onSimulate }: ActivitySimulatorProps) {
  const categories = (Object.keys(ACTIVITY_CATEGORIES) as ActivityCategory[]).toSorted(
    (a, b) => Number(isAffinityActivity(archetype.id, b)) - Number(isAffinityActivity(archetype.id, a)),
  );
  const [category, setCategory] = useState<ActivityCategory>(archetype.affinities[0]);
  const [duration, setDuration] = useState(10);
  const selectedInfo = ACTIVITY_CATEGORIES[category];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <GameText variant="heading" color={Palette.simulated}>
          Activity Simulator
        </GameText>
        <SimulatedBadge label="Test data" />
      </View>
      <GameText variant="label" color={Palette.inkSoft}>
        Real activity tracking arrives in a later update. Sessions created here are fake, marked as
        simulated, and never count as verified exercise.
      </GameText>

      <GameText variant="caption" color={Palette.inkSoft}>
        Activity · ★ = {archetype.name} bonus
      </GameText>
      <View style={styles.chips}>
        {categories.map((id) => {
          const info = ACTIVITY_CATEGORIES[id];
          const selected = id === category;
          const affinity = isAffinityActivity(archetype.id, id);
          return (
            <Pressable
              key={id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setCategory(id)}
              style={[
                styles.chip,
                selected && { backgroundColor: archetype.colors.primary, borderColor: archetype.colors.primary },
              ]}>
              <GameText variant="label" color={selected ? archetype.colors.onPrimary : Palette.ink}>
                {info.icon} {info.label}
                {affinity ? ' ★' : ''}
              </GameText>
            </Pressable>
          );
        })}
      </View>

      <GameText variant="caption" color={Palette.inkSoft}>
        Duration
      </GameText>
      <View style={styles.durations}>
        {DURATIONS.map((minutes) => {
          const selected = minutes === duration;
          return (
            <Pressable
              key={minutes}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setDuration(minutes)}
              style={[styles.duration, selected && styles.durationSelected]}>
              <GameText variant="label" color={selected ? Palette.white : Palette.ink}>
                {minutes} min
              </GameText>
            </Pressable>
          );
        })}
      </View>

      <GameButton
        label={`Simulate ${duration} min of ${selectedInfo.label}`}
        variant="secondary"
        color={Palette.simulated}
        onPress={() => onSimulate(category, duration)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.simulatedTint,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Palette.simulated,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    backgroundColor: Palette.white,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Palette.parchmentBorder,
    paddingHorizontal: Spacing.three - 4,
    paddingVertical: Spacing.two,
  },
  durations: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  duration: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Radius.small,
    borderWidth: 1.5,
    borderColor: Palette.parchmentBorder,
    paddingVertical: Spacing.two + 2,
  },
  durationSelected: {
    backgroundColor: Palette.simulated,
    borderColor: Palette.simulated,
  },
});
