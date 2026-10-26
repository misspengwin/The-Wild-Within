import { StyleSheet, View } from 'react-native';

import { RESOURCE_INFO } from '@/constants/resources';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { getQuestTarget } from '@/game/quests';
import type { ResourceId } from '@/models/character';
import type { QuestDefinition, QuestProgress } from '@/models/quest';

import { GameButton } from './ui/game-button';
import { GameText } from './ui/game-text';
import { ProgressBar } from './ui/progress-bar';
import { SimulatedBadge } from './ui/simulated-badge';

export interface QuestCardProps {
  quest: QuestDefinition;
  progress: QuestProgress;
  accentColor: string;
  onClaim: () => void;
}

export function QuestCard({ quest, progress, accentColor, onClaim }: QuestCardProps) {
  const target = getQuestTarget(quest);
  const isReady = progress.status === 'ready';
  const isClaimed = progress.status === 'claimed';

  return (
    <View
      style={[
        styles.card,
        isReady && { borderColor: Palette.gold, backgroundColor: '#FFF3D4' },
        isClaimed && styles.claimed,
      ]}>
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: isClaimed ? Palette.track : `${accentColor}22` }]}>
          <GameText style={styles.iconText}>{isClaimed ? '✅' : quest.icon}</GameText>
        </View>
        <View style={styles.headerText}>
          <GameText variant="heading">{quest.title}</GameText>
          <GameText variant="label" color={Palette.inkSoft}>
            {quest.objective}
          </GameText>
        </View>
      </View>

      {!isClaimed && (
        <GameText variant="body" color={Palette.inkSoft} style={styles.story}>
          {quest.story}
        </GameText>
      )}

      {!isClaimed && (
        <View style={styles.progress}>
          <View style={styles.progressRow}>
            <GameText variant="label">
              {progress.progressMinutes} / {target} min
            </GameText>
            {progress.usedSimulatedData && <SimulatedBadge label="Simulated progress" />}
          </View>
          <ProgressBar
            progress={progress.progressMinutes / target}
            color={isReady ? Palette.gold : accentColor}
            striped={progress.usedSimulatedData}
          />
        </View>
      )}

      <View style={styles.rewards}>
        <GameText variant="caption" color={Palette.inkSoft}>
          {isClaimed ? 'Claimed' : 'Rewards'}
        </GameText>
        <RewardChip text={`✨ ${quest.reward.xp} XP`} />
        {(Object.entries(quest.reward.resources) as [ResourceId, number][]).map(([id, amount]) => (
          <RewardChip key={id} text={`${RESOURCE_INFO[id].icon} ${amount}`} />
        ))}
      </View>

      {isReady && <GameButton label="Claim reward" onPress={onClaim} />}
    </View>
  );
}

function RewardChip({ text }: { text: string }) {
  return (
    <View style={styles.chip}>
      <GameText variant="label">{text}</GameText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderRadius: Radius.large,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: Palette.parchmentBorder,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  claimed: {
    opacity: 0.7,
    borderBottomWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
    lineHeight: 34,
  },
  headerText: {
    flex: 1,
    gap: Spacing.half,
  },
  story: {
    fontStyle: 'italic',
  },
  progress: {
    gap: Spacing.two,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  rewards: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    backgroundColor: Palette.parchment,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Palette.parchmentBorder,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
  },
});
