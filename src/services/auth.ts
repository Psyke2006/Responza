import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  User,
  UserCredential,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp, 
  DocumentData 
} from 'firebase/firestore';
import { auth, db } from './firebase';

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error during resetPassword:', error);
    throw error;
  }
}


/**
 * Creates a new user account with Firebase Authentication and stores additional user
 * information in Firestore.
 * 
 * @param email - The email address for the user.
 * @param password - The secure password for the user.
 * @param name - The full name of the user.
 * @returns A promise that resolves to the UserCredential from Firebase Auth.
 * @throws An error if user creation or profile creation fails.
 */
export async function signUp(email: string, password: string, name: string): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a matching profile document in Firestore 'users' collection
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name,
      email,
      createdAt: serverTimestamp()
    });

    return userCredential;
  } catch (error) {
    console.error('Error during signUp:', error);
    throw error;
  }
}

/**
 * Authenticates a user with email and password using Firebase Authentication.
 * 
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves to the UserCredential.
 * @throws An error if authentication fails.
 */
export async function signIn(email: string, password: string): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error during signIn:', error);
    throw error;
  }
}

/**
 * Signs out the currently authenticated user.
 * 
 * @returns A promise that resolves when sign-out is successful.
 * @throws An error if sign-out fails.
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error during signOut:', error);
    throw error;
  }
}

/**
 * Retrieves the currently authenticated Firebase Authentication user object.
 * This is a synchronous check that reads from the internal state of Firebase Auth.
 * 
 * @returns The Firebase User object if signed in, otherwise null.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Reads and returns the custom user profile document from Firestore for the currently
 * authenticated user.
 * 
 * @returns A promise that resolves to the user's Firestore document data if found, or null if no user is signed in or the document doesn't exist.
 * @throws An error if fetching the document fails.
 */
export async function getCurrentUserProfile(): Promise<DocumentData | null> {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return null;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data();
    }

    return null;
  } catch (error) {
    console.error('Error during getCurrentUserProfile:', error);
    throw error;
  }
}
