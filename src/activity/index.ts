import { SimulatedActivityProvider } from './simulated-activity-provider';

export type { ActivityPermissionStatus, ActivityProvider, ActivityQuery } from './activity-provider';
export { SimulatedActivityProvider } from './simulated-activity-provider';

/**
 * The single simulated provider for the prototype. When HealthKit and Health
 * Connect providers exist, pick one here with `Platform.OS` and keep the
 * simulator available only in development builds.
 */
export const simulatedActivityProvider = new SimulatedActivityProvider();
