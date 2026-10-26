import { StyleSheet, View, type ViewProps } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/theme';

/** A raised parchment card. */
export function Panel({ style, ...rest }: ViewProps) {
  return <View style={[styles.panel, style]} {...rest} />;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: Palette.white,
    borderRadius: Radius.large,
    borderWidth: 2,
    borderColor: Palette.parchmentBorder,
    borderBottomWidth: 5,
    padding: Spacing.three,
    gap: Spacing.three,
  },
});
