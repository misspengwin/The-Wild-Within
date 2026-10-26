import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Palette, Radius } from '@/constants/theme';

export interface ProgressBarProps {
  /** 0..1 */
  progress: number;
  color: string;
  height?: number;
  trackColor?: string;
  /** Diagonal stripes, used to mark simulated progress. */
  striped?: boolean;
}

export function ProgressBar({
  progress,
  color,
  height = 14,
  trackColor = Palette.track,
  striped = false,
}: ProgressBarProps) {
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={[styles.track, { height, backgroundColor: trackColor, borderRadius: height / 2 }]}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: `${percent}%`,
            backgroundColor: color,
            borderRadius: height / 2,
            transitionProperty: 'width',
            transitionDuration: 500,
            transitionTimingFunction: 'ease-out',
          },
          striped && styles.striped,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: Radius.pill,
  },
  fill: {
    height: '100%',
  },
  striped: {
    experimental_backgroundImage:
      'repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 6px, rgba(255,255,255,0) 6px, rgba(255,255,255,0) 12px)',
  },
});
