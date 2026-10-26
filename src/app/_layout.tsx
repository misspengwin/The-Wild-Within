import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { Palette } from '@/constants/theme';
import { GameProvider, useGame } from '@/state/game-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GameProvider>
      <RootNavigator />
    </GameProvider>
  );
}

function RootNavigator() {
  const { hydrated, state } = useGame();
  const hasCharacter = state.character !== null;

  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync();
  }, [hydrated]);

  // Keep the splash screen up until the saved game is loaded.
  if (!hydrated) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Palette.parchment } }}>
      <Stack.Protected guard={!hasCharacter} redirectTo="/dashboard">
        <Stack.Screen name="index" />
        <Stack.Screen name="choose-archetype" />
      </Stack.Protected>
      <Stack.Protected guard={hasCharacter} redirectTo="/">
        <Stack.Screen name="dashboard" />
      </Stack.Protected>
    </Stack>
  );
}
