import { 
  startSensorMonitoring, 
  stopSensorMonitoring, 
  subscribeToSensorEvents, 
  detectImpact, 
  detectInactivity 
} from './sensors';

/**
 * Configuration schema for the multi-stage fall detection state machine.
 */
export interface FallDetectionConfig {
  /** Lower bound threshold in g's indicating free-fall (acceleration drop) (default: 0.5g). */
  freefallThresholdG: number;
  /** Maximum time window in milliseconds to observe an impact after the free-fall begins (default: 500ms). */
  freefallWindowMs: number;
  /** Upper bound threshold in g's indicating impact shock (default: 2.2g). */
  impactThresholdG: number;
  /** Duration in degrees representing the minimum change in body orientation to classify as a fall (default: 30 degrees). */
  orientationChangeAngle: number;
  /** Acceleration deviation threshold from gravity to qualify as inactivity (default: 0.08g). */
  inactivityThresholdG: number;
  /** Duration in milliseconds that the user must remain motionless to confirm a fall (default: 5000ms). */
  inactivityDurationMs: number;
}

export const DEFAULT_FALL_CONFIG: FallDetectionConfig = {
  freefallThresholdG: 0.5,
  freefallWindowMs: 500,
  impactThresholdG: 2.2,
  orientationChangeAngle: 30,
  inactivityThresholdG: 0.08,
  inactivityDurationMs: 5000,
};

/**
 * States of the fall detection state machine.
 */
enum FallState {
  MONITORING,
  FREEFALL,
  INACTIVITY_CHECK,
}

/**
 * Callbacks structure for the emergency detection service.
 */
export interface EmergencyCallbacks {
  onFallDetected: () => void;
  onImpactDetected: () => void;
}

let fallUnsub: (() => void) | null = null;
let impactUnsub: (() => void) | null = null;

/**
 * Helper function to calculate the angular difference (in degrees) between two 3D vectors.
 * Used to detect body orientation shifts after an impact.
 */
function getAngleDifference(
  v1: { x: number; y: number; z: number },
  v2: { x: number; y: number; z: number }
): number {
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);

  if (mag1 === 0 || mag2 === 0) return 0;

  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const cosTheta = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));

  return (Math.acos(cosTheta) * 180) / Math.PI;
}

/**
 * Sets up a state machine to detect falls.
 * 
 * Flow:
 * 1. [MONITORING]: Keeps track of recent device orientation. Watches for acceleration magnitude to drop below freefallThresholdG (e.g. 0.5g).
 * 2. [FREEFALL]: Triggers on drop. Watches for a corresponding impact spike above impactThresholdG (e.g. 2.2g) within freefallWindowMs.
 * 3. [INACTIVITY_CHECK]: Triggers on impact. Waits for inactivityDurationMs. If user moves significantly, it resets to MONITORING.
 *    If inactivity duration finishes without motion, it compares the pre-fall orientation to the post-fall orientation.
 *    If the angle of difference exceeds orientationChangeAngle, a fall is confirmed and onFallDetected is triggered.
 * 
 * @param onFallDetected - Callback fired when a fall is detected and confirmed.
 * @param config - Configurable thresholds and intervals for fall detection.
 * @returns A function to unsubscribe the fall detection listener.
 */
export function detectFall(
  onFallDetected: () => void,
  config: FallDetectionConfig = DEFAULT_FALL_CONFIG
): () => void {
  let state = FallState.MONITORING;
  let freefallTimestamp = 0;
  let inactivityStartTimestamp = 0;

  // Rolling buffer to keep track of stable orientation right before a fall starts
  const orientationHistory: { x: number; y: number; z: number }[] = [];
  const HISTORY_LIMIT = 5; // 500ms history at 100ms interval

  let vPre = { x: 0, y: 0, z: 0 };

  return subscribeToSensorEvents((data) => {
    // Record current raw coordinates in history
    orientationHistory.push({ x: data.x, y: data.y, z: data.z });
    if (orientationHistory.length > HISTORY_LIMIT) {
      orientationHistory.shift();
    }

    const now = Date.now();

    switch (state) {
      case FallState.MONITORING:
        // Free fall phase: acceleration dropping significantly below gravity (1.0g)
        if (data.accelerationMagnitude < config.freefallThresholdG) {
          // Average the recent history to get a stable pre-fall posture vector
          if (orientationHistory.length > 0) {
            const sum = orientationHistory.reduce((acc, val) => ({
              x: acc.x + val.x,
              y: acc.y + val.y,
              z: acc.z + val.z
            }), { x: 0, y: 0, z: 0 });

            vPre = {
              x: sum.x / orientationHistory.length,
              y: sum.y / orientationHistory.length,
              z: sum.z / orientationHistory.length
            };
          } else {
            vPre = { x: data.x, y: data.y, z: data.z };
          }

          state = FallState.FREEFALL;
          freefallTimestamp = now;
        }
        break;

      case FallState.FREEFALL:
        // If too much time passes before the impact spike, abort back to normal monitoring
        if (now - freefallTimestamp > config.freefallWindowMs) {
          state = FallState.MONITORING;
          break;
        }

        // Impact phase: check for high impact spike
        if (data.accelerationMagnitude >= config.impactThresholdG) {
          state = FallState.INACTIVITY_CHECK;
          inactivityStartTimestamp = now;
        }
        break;

      case FallState.INACTIVITY_CHECK:
        const accelDeviation = Math.abs(data.accelerationMagnitude - 1.0);
        // Active if acceleration deviates or rotation rate is high (above default 0.2 rad/s threshold)
        const isActive = accelDeviation > config.inactivityThresholdG || data.rotation > 0.2;

        if (isActive) {
          // User recovered or stood up: reset to monitoring
          state = FallState.MONITORING;
        } else if (now - inactivityStartTimestamp >= config.inactivityDurationMs) {
          // Inactivity confirmed. Check if device orientation changed (horizontal fall position).
          const vPost = { x: data.x, y: data.y, z: data.z };
          const angleDiff = getAngleDifference(vPre, vPost);

          if (angleDiff >= config.orientationChangeAngle) {
            console.log(`[Detection Service] Fall Confirmed! Orientation angle shift: ${angleDiff.toFixed(1)}° (Threshold: ${config.orientationChangeAngle}°)`);
            onFallDetected();
          }

          state = FallState.MONITORING;
        }
        break;
    }
  });
}

/**
 * Detects an impact emergency event.
 * 
 * @param onImpactDetected - Callback triggered when an impact occurs.
 * @param threshold - Optional impact threshold override in g's.
 * @returns A function to unsubscribe the impact emergency listener.
 */
export function detectImpactEmergency(
  onImpactDetected: () => void,
  threshold?: number
): () => void {
  return detectImpact(onImpactDetected, threshold);
}

/**
 * Detects an inactivity emergency event.
 * 
 * @param onInactivityDetected - Callback triggered when prolonged inactivity occurs.
 * @param inactivityThresholdG - Optional motion threshold deviation override in g's.
 * @param durationMs - Optional duration override in milliseconds.
 * @returns A function to unsubscribe the inactivity emergency listener.
 */
export function detectInactivityEmergency(
  onInactivityDetected: () => void,
  inactivityThresholdG?: number,
  durationMs?: number
): () => void {
  return detectInactivity(onInactivityDetected, inactivityThresholdG, durationMs);
}

/**
 * Starts all emergency detection listeners (Fall, Impact, Inactivity).
 * Automatically initializes underlying sensors if they are not active.
 * 
 * @param callbacks - Event callbacks to handle detected emergencies.
 * @param config - Optional configuration overrides for thresholds.
 */
export function startEmergencyDetection(
  callbacks: EmergencyCallbacks,
  config?: {
    fall?: FallDetectionConfig;
    impactThreshold?: number;
  }
): void {
  console.log("[DETECTION] startEmergencyDetection invoked");
  // Reset any active subscriptions to prevent memory leaks
  stopEmergencyDetection();

  // Start the physical sensor listener
  startSensorMonitoring();

  fallUnsub = detectFall(callbacks.onFallDetected, config?.fall);
  impactUnsub = detectImpactEmergency(callbacks.onImpactDetected, config?.impactThreshold);
}

/**
 * Stops all emergency detection listeners and turns off device sensor monitoring.
 */
export function stopEmergencyDetection(): void {
  console.log("[DETECTION] stopEmergencyDetection invoked");
  if (fallUnsub) {
    console.log("[DETECTION CLEANUP] Removing fall listener");
    fallUnsub();
    fallUnsub = null;
  }
  if (impactUnsub) {
    console.log("[DETECTION CLEANUP] Removing impact listener");
    impactUnsub();
    impactUnsub = null;
  }

  // Turn off the underlying Accelerometer & Gyroscope hardware listeners
  stopSensorMonitoring();
}
