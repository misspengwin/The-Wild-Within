import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArchetypeCard } from '@/components/archetype-card';
import { GameButton } from '@/components/ui/game-button';
import { GameText } from '@/components/ui/game-text';
import { MaxContentWidth, Palette, Spacing } from '@/constants/theme';
import { ARCHETYPE_ORDER, ARCHETYPES } from '@/game/archetypes';
import type { ArchetypeId } from '@/models/archetype';
import { useGame } from '@/state/game-context';

export default function ChooseArchetypeScreen() {
  const router = useRouter();
  const { chooseArchetype } = useGame();
  const [selectedId, setSelectedId] = useState<ArchetypeId | null>(null);
  const selected = selectedId ? ARCHETYPES[selectedId] : null;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <GameButton label="‹ Back" variant="ghost" onPress={() => router.back()} style={styles.back} />
        <View style={styles.intro}>
          <GameText variant="title">Choose your path</GameText>
          <GameText variant="body" color={Palette.inkSoft}>
            Your archetype earns bonus rewards (×1.5) from its favorite activities. Every kind of
            movement still powers your hero, so you’re never locked in.
          </GameText>
        </View>

        <View accessibilityRole="radiogroup" style={styles.cards}>
          {ARCHETYPE_ORDER.map((id) => (
            <ArchetypeCard
              key={id}
              archetype={ARCHETYPES[id]}
              selected={id === selectedId}
              onPress={() => setSelectedId(id)}
            />
          ))}
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <GameButton
          label={selected ? `Begin as ${selected.name}` : 'Select an archetype'}
          disabled={!selected}
          color={selected?.colors.primary}
          textColor={selected?.colors.onPrimary}
          onPress={() => {
            // The root layout's protected routes move to the dashboard once a character exists.
            if (selectedId) chooseArchetype(selectedId);
          }}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.parchment,
  },
  content: {
    padding: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  back: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
  },
  intro: {
    gap: Spacing.two,
  },
  cards: {
    gap: Spacing.three,
  },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    backgroundColor: Palette.parchmentDeep,
    borderTopWidth: 2,
    borderTopColor: Palette.parchmentBorder,
  },
});
