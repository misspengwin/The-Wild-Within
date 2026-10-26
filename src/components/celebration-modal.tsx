import { Modal, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { RESOURCE_INFO } from '@/constants/resources';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { QUESTS } from '@/game/quests';
import type { ResourceId } from '@/models/character';
import type { GameEvent } from '@/models/game-state';

import { GameButton } from './ui/game-button';
import { GameText } from './ui/game-text';
import { SimulatedBadge } from './ui/simulated-badge';

interface CelebrationContent {
  icon: string;
  title: string;
  lines: string[];
  simulated: boolean;
}

/** Turns a batch of game events into one celebratory message. */
function describe(events: GameEvent[]): CelebrationContent | null {
  const levelUp = events.findLast((e) => e.type === 'level-up');
  const claimed = events.find((e) => e.type === 'quest-claimed');
  const ready = events.filter((e) => e.type === 'quest-ready');
  const rewarded = events.filter((e) => e.type === 'activity-rewarded');

  const lines: string[] = [];
  const xp = rewarded.reduce((sum, e) => sum + e.xp, 0);
  const energy = rewarded.reduce((sum, e) => sum + e.energy, 0);
  if (xp > 0) lines.push(`+${xp} XP  ·  +${energy} Energy`);
  if (claimed) {
    lines.push(`+${claimed.reward.xp} XP`);
    for (const [id, amount] of Object.entries(claimed.reward.resources) as [ResourceId, number][]) {
      lines.push(`+${amount} ${RESOURCE_INFO[id].icon} ${RESOURCE_INFO[id].label}`);
    }
  }
  for (const e of ready) lines.push(`Quest complete: ${QUESTS[e.questId].title}!`);

  const simulated = rewarded.some((e) => e.simulated);

  if (levelUp) return { icon: '🌟', title: `Level ${levelUp.level}!`, lines, simulated };
  if (claimed) return { icon: '🎁', title: 'Treasure claimed!', lines, simulated };
  if (ready.length > 0) return { icon: '🏆', title: 'Quest complete!', lines, simulated };
  if (rewarded.length > 0) return { icon: '✨', title: 'Adventure fueled!', lines, simulated };
  return null;
}

export function CelebrationModal({ events, onDismiss }: { events: GameEvent[]; onDismiss: () => void }) {
  const content = describe(events);
  if (!content) return null;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <Animated.View entering={ZoomIn.springify()} style={styles.card}>
          <GameText style={styles.icon}>{content.icon}</GameText>
          <GameText variant="title" style={styles.center}>
            {content.title}
          </GameText>
          {content.lines.map((line) => (
            <GameText key={line} variant="heading" color={Palette.inkSoft} style={styles.center}>
              {line}
            </GameText>
          ))}
          {content.simulated && (
            <View style={styles.badge}>
              <SimulatedBadge label="From simulated activity" />
            </View>
          )}
          <GameButton label="Onward!" onPress={onDismiss} style={styles.button} />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 14, 48, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Palette.parchment,
    borderRadius: Radius.large,
    borderWidth: 3,
    borderColor: Palette.gold,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  icon: {
    fontSize: 64,
    lineHeight: 76,
  },
  center: {
    textAlign: 'center',
  },
  badge: {
    marginTop: Spacing.one,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: Spacing.three,
  },
});
