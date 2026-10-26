import { StyleSheet, View } from 'react-native';

// Fixed positions (percent of screen) so the sky looks the same every launch.
const STARS = [
  [8, 6, 3], [22, 14, 2], [38, 4, 4], [55, 11, 2], [71, 5, 3], [88, 13, 2],
  [14, 24, 2], [30, 30, 3], [62, 22, 2], [80, 28, 4], [93, 36, 2], [5, 40, 3],
  [46, 38, 2], [70, 44, 2], [20, 52, 2], [86, 56, 3], [10, 66, 2], [52, 62, 2],
] as const;

/** Decorative night-sky background for the welcome screen. */
export function Starfield() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.sky} />
      {STARS.map(([left, top, size], i) => (
        <View
          key={i}
          style={[
            styles.star,
            { left: `${left}%`, top: `${top}%`, width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ))}
      <View style={[styles.hill, styles.hillBack]} />
      <View style={[styles.hill, styles.hillFront]} />
    </View>
  );
}

const styles = StyleSheet.create({
  sky: {
    ...StyleSheet.absoluteFill,
    experimental_backgroundImage: 'linear-gradient(180deg, #1B1640 0%, #3A2C7A 55%, #E07A5F 100%)',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFF6D8',
    opacity: 0.85,
  },
  hill: {
    position: 'absolute',
    borderTopLeftRadius: 9999,
    borderTopRightRadius: 9999,
  },
  hillBack: {
    bottom: -120,
    left: '-30%',
    width: '120%',
    height: 300,
    backgroundColor: '#2F6B4F',
  },
  hillFront: {
    bottom: -160,
    right: '-35%',
    width: '130%',
    height: 300,
    backgroundColor: '#3E8E5A',
  },
});
