import { StyleSheet, Text, View } from 'react-native';

import type { Archetype } from '@/models/archetype';

/** Circular archetype emblem with a gradient ring. */
export function Crest({ archetype, size = 72 }: { archetype: Archetype; size?: number }) {
  const { primary, secondary } = archetype.colors;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          experimental_backgroundImage: `linear-gradient(145deg, ${secondary}, ${primary})`,
        },
      ]}>
      <View
        style={[
          styles.inner,
          { width: size * 0.78, height: size * 0.78, borderRadius: size * 0.39, borderColor: secondary },
        ]}>
        <Text style={{ fontSize: size * 0.42 }}>{archetype.crest}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 2,
  },
});
