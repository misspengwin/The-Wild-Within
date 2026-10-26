import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Starfield } from '@/components/starfield';
import { GameButton } from '@/components/ui/game-button';
import { GameText } from '@/components/ui/game-text';
import { APP_NAME } from '@/constants/app';
import { MaxContentWidth, Palette, Radius, Spacing } from '@/constants/theme';
import { ARCHETYPE_ORDER, ARCHETYPES } from '@/game/archetypes';

const PILLARS = [
  { icon: '👟', text: 'Move in the real world: walk, lift, stretch, dance.' },
  { icon: '⚡', text: 'Your activity becomes energy and experience for your hero.' },
  { icon: '🗺️', text: 'Complete quests, gather treasure and explore new lands.' },
];

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Starfield />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.hero}>
            <View style={styles.crests}>
              {ARCHETYPE_ORDER.map((id) => (
                <View
                  key={id}
                  style={[styles.crestBubble, { backgroundColor: ARCHETYPES[id].colors.primary }]}>
                  <GameText style={styles.crestIcon}>{ARCHETYPES[id].crest}</GameText>
                </View>
              ))}
            </View>
            <GameText variant="caption" color={Palette.gold} style={styles.center}>
              A new adventure awaits
            </GameText>
            <GameText variant="display" color={Palette.white} style={[styles.center, styles.title]}>
              {APP_NAME}
            </GameText>
            <GameText variant="body" color="#E9E4FF" style={styles.center}>
              In this realm, heroes aren’t made by buttons. They’re made by moving. Every step,
              stretch and stride you take in real life powers your hero’s journey.
            </GameText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).duration(600)} style={styles.pillars}>
            {PILLARS.map((pillar) => (
              <View key={pillar.icon} style={styles.pillar}>
                <GameText style={styles.pillarIcon}>{pillar.icon}</GameText>
                <GameText variant="label" color={Palette.white} style={styles.pillarText}>
                  {pillar.text}
                </GameText>
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.actions}>
            <GameButton label="Begin your adventure" onPress={() => router.push('/choose-archetype')} />
            <GameText variant="label" color="#CFC8F5" style={styles.center}>
              Prototype · activity is simulated for now
            </GameText>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.night,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.five,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  hero: {
    gap: Spacing.three,
    alignItems: 'center',
  },
  crests: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  crestBubble: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.85)',
    boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
  },
  crestIcon: {
    fontSize: 26,
    lineHeight: 32,
  },
  center: {
    textAlign: 'center',
  },
  title: {
    textShadowColor: 'rgba(245, 184, 61, 0.6)',
    textShadowRadius: 18,
  },
  pillars: {
    gap: Spacing.two,
  },
  pillar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderRadius: Radius.medium,
    padding: Spacing.three,
  },
  pillarIcon: {
    fontSize: 26,
    lineHeight: 32,
  },
  pillarText: {
    flex: 1,
  },
  actions: {
    gap: Spacing.three,
  },
});
