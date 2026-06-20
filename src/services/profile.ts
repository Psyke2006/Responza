import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from './firebase';

export interface MedicalInfo {
  bloodType: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  medicalInfo?: MedicalInfo;
  emergencyNote?: string;
  safePin?: string;
  distressPin?: string;
  subscription?: string;
  createdAt: any;
}

/**
 * Fetches the user profile document from Firestore for the currently authenticated user.
 * 
 * Path: users/{uid}
 * 
 * @returns A promise resolving to the UserProfile or null if not signed in or not found.
 */
export async function getProfile(): Promise<UserProfile | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to get profile.');
  }

  try {
    const docRef = doc(db, 'users', currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw error;
  }
}

/**
 * Updates the blood type field inside users/{uid}/medicalInfo/bloodType.
 * 
 * @param bloodType - The new blood type (e.g. "O+", "A-").
 */
export async function updateBloodType(bloodType: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to update blood type.');
  }

  try {
    const docRef = doc(db, 'users', currentUser.uid);
    await updateDoc(docRef, {
      'medicalInfo.bloodType': bloodType
    });
  } catch (error) {
    console.error('Error in updateBloodType:', error);
    throw error;
  }
}

/**
 * Updates the emergencyNote field inside users/{uid}.
 * 
 * @param note - The text for the emergency note.
 */
export async function updateEmergencyNote(note: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to update emergency note.');
  }

  try {
    const docRef = doc(db, 'users', currentUser.uid);
    await updateDoc(docRef, {
      emergencyNote: note
    });
  } catch (error) {
    console.error('Error in updateEmergencyNote:', error);
    throw error;
  }
}

/**
 * Updates safePin and distressPin fields inside users/{uid}.
 * 
 * @param safePin - The new 4-digit safe PIN.
 * @param distressPin - The new 4-digit distress PIN.
 */
export async function updatePins(safePin: string, distressPin: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to update PINs.');
  }

  try {
    const docRef = doc(db, 'users', currentUser.uid);
    await updateDoc(docRef, {
      safePin,
      distressPin
    });
  } catch (error) {
    console.error('Error in updatePins:', error);
    throw error;
  }
}

/**
 * Signs out the currently authenticated user from Firebase Auth.
 */
export async function signOutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error in signOutUser:', error);
    throw error;
  }
}
