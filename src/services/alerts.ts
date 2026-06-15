import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { getLocationPayload } from './location';

/**
 * Supported alert types.
 */
export type AlertType = 'SOS' | 'FALL' | 'IMPACT' | 'INACTIVITY';

/**
 * Status of the alert.
 */
export type AlertStatus = 'ACTIVE' | 'CANCELLED' | 'RESOLVED';

/**
 * Interface representing an alert document structure in Firestore.
 */
export interface Alert {
  alertId: string;
  userId: string;
  type: AlertType;
  status: AlertStatus;
  latitude: number;
  longitude: number;
  mapLink: string;
  timestamp: number;
  contactsNotified: boolean;
}

/**
 * Creates a new emergency alert. Retrieves the current user, obtains their 
 * current location payload, and creates a document in the 'alerts' collection.
 * 
 * Path: alerts/{alertId}
 * 
 * @param type - The type of alert ('SOS', 'FALL', 'IMPACT', 'INACTIVITY').
 * @returns A promise that resolves to the created Alert object.
 * @throws An error if the user is not authenticated or if retrieving location/creating the alert fails.
 */
export async function createAlert(type: AlertType): Promise<Alert> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to trigger an emergency alert.');
  }

  try {
    const locationPayload = await getLocationPayload();

    const alertsCollectionRef = collection(db, 'alerts');
    const newAlertDocRef = doc(alertsCollectionRef); // Auto-generates unique ID

    const alertData: Alert = {
      alertId: newAlertDocRef.id,
      userId: currentUser.uid,
      type,
      status: 'ACTIVE',
      latitude: locationPayload.latitude,
      longitude: locationPayload.longitude,
      mapLink: locationPayload.mapLink,
      timestamp: locationPayload.timestamp,
      contactsNotified: false
    };

    await setDoc(newAlertDocRef, alertData);
    return alertData;
  } catch (error) {
    console.error('Error in createAlert:', error);
    throw error;
  }
}

/**
 * Retrieves all alerts triggered by the currently authenticated user.
 * Sorted locally by timestamp in descending order (most recent first).
 * 
 * Path: alerts/{alertId}
 * 
 * @returns A promise that resolves to an array of Alert objects.
 * @throws An error if the user is not authenticated or if query fails.
 */
export async function getUserAlerts(): Promise<Alert[]> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to retrieve alerts.');
  }

  try {
    const alertsCollectionRef = collection(db, 'alerts');
    const q = query(alertsCollectionRef, where('userId', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);

    const alerts: Alert[] = [];
    querySnapshot.forEach((docSnap) => {
      alerts.push(docSnap.data() as Alert);
    });

    // Sort in-memory descending by timestamp to avoid requiring composite indexes
    return alerts.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error in getUserAlerts:', error);
    throw error;
  }
}

/**
 * Cancels an active alert by updating its status to CANCELLED.
 * 
 * @param alertId - The unique ID of the alert to cancel.
 * @returns A promise that resolves when the update is complete.
 * @throws An error if the update fails.
 */
export async function cancelAlert(alertId: string): Promise<void> {
  try {
    const alertDocRef = doc(db, 'alerts', alertId);
    await updateDoc(alertDocRef, {
      status: 'CANCELLED'
    });
  } catch (error) {
    console.error(`Error in cancelAlert for alert ID ${alertId}:`, error);
    throw error;
  }
}

/**
 * Resolves an active alert by updating its status to RESOLVED.
 * 
 * @param alertId - The unique ID of the alert to resolve.
 * @returns A promise that resolves when the update is complete.
 * @throws An error if the update fails.
 */
export async function resolveAlert(alertId: string): Promise<void> {
  try {
    const alertDocRef = doc(db, 'alerts', alertId);
    await updateDoc(alertDocRef, {
      status: 'RESOLVED'
    });
  } catch (error) {
    console.error(`Error in resolveAlert for alert ID ${alertId}:`, error);
    throw error;
  }
}
