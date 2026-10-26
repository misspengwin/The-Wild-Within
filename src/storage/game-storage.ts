import AsyncStorage from '@react-native-async-storage/async-storage';

import { GAME_STATE_VERSION, type GameState } from '@/models/game-state';

const STORAGE_KEY = 'movement-rpg/game-state';

/** Returns the saved game, or null if there is none or it can't be read. */
export async function loadGameState(): Promise<GameState | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GameState>;
    // Future versions should migrate older saves here instead of discarding them.
    if (parsed.version !== GAME_STATE_VERSION) return null;
    return parsed as GameState;
  } catch (error) {
    console.warn('Failed to load saved game', error);
    return null;
  }
}

export async function saveGameState(state: GameState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save game', error);
  }
}

export async function clearGameState(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
