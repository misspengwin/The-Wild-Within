/**
 * The boundary between the game and wherever activity data comes from.
 *
 * Planned implementations:
 * - SimulatedActivityProvider (this milestone): generates fake, unverified sessions.
 * - AppleHealthKitProvider (future, iOS): reads workouts and step counts from HealthKit.
 *   Requires a development build (not Expo Go), the HealthKit entitlement and
 *   NSHealthShareUsageDescription, configured through a config plugin in app.json.
 * - HealthConnectProvider (future, Android): reads ExerciseSession and Steps
 *   records from Health Connect. Also requires a development build and
 *   permission declarations configured through a config plugin.
 *
 * Game logic only ever sees `ActivitySession` objects, so swapping or combining
 * providers does not change any game rules.
 */
import type { ActivitySession, ActivitySource } from '@/models/activity';

export type ActivityPermissionStatus = 'granted' | 'denied' | 'undetermined' | 'unavailable';

export interface ActivityQuery {
  start: Date;
  end: Date;
}

export interface ActivityProvider {
  readonly source: ActivitySource;
  readonly displayName: string;
  /** Whether data from this provider comes from a trusted health platform. */
  readonly isVerifiedSource: boolean;

  /** Whether this provider can run on the current device and build. */
  isAvailable(): Promise<boolean>;
  getPermissionStatus(): Promise<ActivityPermissionStatus>;
  requestPermissions(): Promise<ActivityPermissionStatus>;

  /** Sessions that started within the query range. May include ones the game already has. */
  getSessions(query: ActivityQuery): Promise<ActivitySession[]>;
}
