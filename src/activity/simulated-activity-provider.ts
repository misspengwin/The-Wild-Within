import { ACTIVITY_CATEGORIES, type ActivityCategory, type ActivitySession } from '@/models/activity';

import type { ActivityPermissionStatus, ActivityProvider, ActivityQuery } from './activity-provider';

export interface SimulateOptions {
  category: ActivityCategory;
  durationMinutes: number;
  /** When the simulated session ends. Defaults to now. */
  endedAt?: Date;
}

/**
 * Prototype-only provider. Sessions it creates are always `source: 'simulated'`
 * and `verified: false`, and must never be presented as real physical activity.
 */
export class SimulatedActivityProvider implements ActivityProvider {
  readonly source = 'simulated' as const;
  readonly displayName = 'Simulated activity (prototype)';
  readonly isVerifiedSource = false;

  private sessions: ActivitySession[] = [];

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async getPermissionStatus(): Promise<ActivityPermissionStatus> {
    return 'granted';
  }

  async requestPermissions(): Promise<ActivityPermissionStatus> {
    return 'granted';
  }

  async getSessions({ start, end }: ActivityQuery): Promise<ActivitySession[]> {
    return this.sessions.filter((s) => {
      const startedAt = new Date(s.startedAt);
      return startedAt >= start && startedAt <= end;
    });
  }

  /** Creates a fake session for testing the game loop. */
  simulateSession({ category, durationMinutes, endedAt = new Date() }: SimulateOptions): ActivitySession {
    const startedAt = new Date(endedAt.getTime() - durationMinutes * 60_000);
    const stepsPerMinute = ACTIVITY_CATEGORIES[category].simulatedStepsPerMinute;
    const session: ActivitySession = {
      id: `sim-${endedAt.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      category,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      durationMinutes,
      steps: stepsPerMinute > 0 ? Math.round(stepsPerMinute * durationMinutes) : undefined,
      source: 'simulated',
      verified: false,
    };
    this.sessions.push(session);
    return session;
  }
}
