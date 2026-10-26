import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivitySimulator } from '@/components/activity-simulator';
import { CelebrationModal } from '@/components/celebration-modal';
import { Crest } from '@/components/crest';
import { QuestCard } from '@/components/quest-card';
import { ResourceRow } from '@/components/resource-row';
import { StatMeter } from '@/components/stat-meter';
import { GameButton } from '@/components/ui/game-button';
import { GameText } from '@/components/ui/game-text';
import { Panel } from '@/components/ui/panel';
import { SimulatedBadge } from '@/components/ui/simulated-badge';
import { MaxContentWidth, Palette, Radius, Spacing } from '@/constants/theme';
import { getArchetype } from '@/game/archetypes';
import { getDailySummary } from '@/game/engine';
import { getLevelInfo, MAX_ENERGY } from '@/game/progression';
import { QUEST_ORDER, QUESTS } from '@/game/quests';
import { useGame } from '@/state/game-context';

export default function DashboardScreen() {
  const { state, recentEvents, dismissEvents, simulateActivity, claimQuest, resetGame } = useGame();
  const character = state.character;
  // The root layout only shows this screen when a character exists.
  if (!character) return null;

  const archetype = getArchetype(character.archetypeId);
  const level = getLevelInfo(character.totalXp);
  const today = getDailySummary(state, new Date());
  const readyCount = QUEST_ORDER.filter((id) => state.quests[id]?.status === 'ready').length;

  function confirmReset() {
    Alert.alert('Start a new adventure?', 'This erases your character and all progress on this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Erase & restart', style: 'destructive', onPress: () => resetGame() },
    ]);
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View
          style={[
            styles.hero,
            {
              experimental_backgroundImage: `linear-gradient(160deg, ${archetype.colors.primary}, ${archetype.colors.secondary})`,
            },
          ]}>
          <SafeAreaView edges={['top']} style={styles.heroInner}>
            <View style={styles.heroRow}>
              <Crest archetype={archetype} size={84} />
              <View style={styles.heroText}>
                <GameText variant="caption" color="rgba(255,255,255,0.85)">
                  {archetype.epithet}
                </GameText>
                <GameText variant="title" color={Palette.white}>
                  {archetype.name}
                </GameText>
                <GameText variant="label" color="rgba(255,255,255,0.9)">
                  {archetype.activityFocus}
                </GameText>
              </View>
              <View style={styles.levelBadge} accessible accessibilityLabel={`Level ${level.level}`}>
                <GameText variant="caption" color={Palette.goldDeep}>
                  Lvl
                </GameText>
                <GameText variant="title" color={Palette.ink}>
                  {level.level}
                </GameText>
              </View>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <Panel>
            <StatMeter
              icon="✨"
              label="Experience"
              valueText={`${level.xpIntoLevel} / ${level.xpForNextLevel} XP`}
              progress={level.progress}
              color={Palette.xp}
            />
            <StatMeter
              icon="⚡"
              label="Energy"
              valueText={`${character.energy} / ${MAX_ENERGY}`}
              progress={character.energy / MAX_ENERGY}
              color={Palette.energy}
            />
            <ResourceRow resources={character.resources} />
          </Panel>

          <Panel>
            <View style={styles.sectionHeader}>
              <GameText variant="heading">Today’s Journey</GameText>
              {today.simulatedMinutes > 0 && <SimulatedBadge />}
            </View>
            <StatMeter
              icon="👟"
              label="Active minutes"
              valueText={`${today.minutes} / ${today.goalMinutes} min`}
              progress={today.progress}
              color={Palette.daily}
              striped={today.simulatedMinutes > 0}
            />
            <View style={styles.dailyStats}>
              <DailyStat label="Sessions" value={today.sessionCount} />
              <DailyStat label="Steps" value={today.steps.toLocaleString()} />
              <DailyStat label="Simulated min" value={today.simulatedMinutes} highlight />
            </View>
            {today.progress >= 1 && (
              <GameText variant="label" color={Palette.goldDeep}>
                🌟 Daily goal reached! Your hero rests well tonight.
              </GameText>
            )}
          </Panel>

          <View style={styles.sectionHeader}>
            <GameText variant="title">Quests</GameText>
            {readyCount > 0 && (
              <View style={styles.readyPill}>
                <GameText variant="label">{readyCount} ready to claim</GameText>
              </View>
            )}
          </View>
          {QUEST_ORDER.map((id) => {
            const progress = state.quests[id];
            if (!progress) return null;
            return (
              <QuestCard
                key={id}
                quest={QUESTS[id]}
                progress={progress}
                accentColor={archetype.colors.primary}
                onClaim={() => claimQuest(id)}
              />
            );
          })}

          <ActivitySimulator archetype={archetype} onSimulate={simulateActivity} />

          <SafeAreaView edges={['bottom']}>
            <GameButton label="Start a new adventure" variant="ghost" onPress={confirmReset} />
          </SafeAreaView>
        </View>
      </ScrollView>

      <CelebrationModal events={recentEvents} onDismiss={dismissEvents} />
    </View>
  );
}

function DailyStat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <View style={[styles.dailyStat, highlight && styles.dailyStatSimulated]}>
      <GameText variant="heading" color={highlight ? Palette.simulated : Palette.ink}>
        {value}
      </GameText>
      <GameText variant="caption" color={highlight ? Palette.simulated : Palette.inkSoft} numberOfLines={1}>
        {label}
      </GameText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.parchment,
  },
  scroll: {
    paddingBottom: Spacing.four,
  },
  hero: {
    borderBottomLeftRadius: Radius.large + 8,
    borderBottomRightRadius: Radius.large + 8,
  },
  heroInner: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  heroText: {
    flex: 1,
    gap: Spacing.half,
  },
  levelBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.gold,
    borderWidth: 3,
    borderColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
  },
  body: {
    padding: Spacing.three,
    gap: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  readyPill: {
    backgroundColor: Palette.gold,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  dailyStats: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  dailyStat: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Palette.parchment,
    borderRadius: Radius.medium,
    borderWidth: 1.5,
    borderColor: Palette.parchmentBorder,
    paddingVertical: Spacing.two,
  },
  dailyStatSimulated: {
    backgroundColor: Palette.simulatedTint,
    borderColor: Palette.simulated,
    borderStyle: 'dashed',
  },
});
