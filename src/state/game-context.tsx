import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { simulatedActivityProvider } from '@/activity';
import * as engine from '@/game/engine';
import type { ActivityCategory, ActivitySession } from '@/models/activity';
import type { ArchetypeId } from '@/models/archetype';
import type { GameEvent, GameState } from '@/models/game-state';
import type { QuestId } from '@/models/quest';
import { clearGameState, loadGameState, saveGameState } from '@/storage/game-storage';

interface GameContextValue {
  /** False until the saved game has been loaded from storage. */
  hydrated: boolean;
  state: GameState;
  /** Events from the most recent action, for celebrations and toasts. */
  recentEvents: GameEvent[];
  dismissEvents: () => void;
  chooseArchetype: (archetypeId: ArchetypeId) => void;
  simulateActivity: (category: ActivityCategory, durationMinutes: number) => void;
  claimQuest: (questId: QuestId) => void;
  resetGame: () => Promise<void>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<GameState>(engine.createInitialGameState);
  const [recentEvents, setRecentEvents] = useState<GameEvent[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadGameState().then((saved) => {
      if (cancelled) return;
      if (saved) setState(saved);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrated) saveGameState(state);
  }, [hydrated, state]);

  function applyResult(result: engine.GameResult) {
    setState(result.state);
    if (result.events.length > 0) setRecentEvents(result.events);
  }

  function ingest(sessions: ActivitySession[]) {
    applyResult(engine.ingestSessions(state, sessions));
  }

  const value: GameContextValue = {
    hydrated,
    state,
    recentEvents,
    dismissEvents: () => setRecentEvents([]),
    chooseArchetype: (archetypeId) => {
      setState(engine.createCharacter(state, archetypeId, new Date()));
    },
    simulateActivity: (category, durationMinutes) => {
      ingest([simulatedActivityProvider.simulateSession({ category, durationMinutes })]);
    },
    claimQuest: (questId) => {
      applyResult(engine.claimQuest(state, questId, new Date()));
    },
    resetGame: async () => {
      await clearGameState();
      setState(engine.createInitialGameState());
      setRecentEvents([]);
    },
  };

  return <GameContext value={value}>{children}</GameContext>;
}

export function useGame(): GameContextValue {
  const context = use(GameContext);
  if (!context) throw new Error('useGame must be used inside <GameProvider>');
  return context;
}
