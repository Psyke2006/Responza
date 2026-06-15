import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Interface representing a trusted contact's structure in Firestore.
 */
export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  smsEnabled: boolean;
  createdAt: any; // Firestore FieldValue or Timestamp
}

/**
 * Interface for inputting/creating a new trusted contact.
 */
export type ContactInput = Omit<TrustedContact, 'id' | 'createdAt'>;

/**
 * Adds a new trusted contact for the currently authenticated user.
 * Generates a unique contact ID and stores the contact in Firestore.
 * 
 * Path: users/{uid}/trustedContacts/{contactId}
 * 
 * @param contact - The contact details to add (name, phone, relationship, isPrimary, smsEnabled).
 * @returns A promise that resolves to the created TrustedContact object.
 * @throws An error if the user is not authenticated or the Firestore operation fails.
 */
export async function addContact(contact: ContactInput): Promise<TrustedContact> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to add a trusted contact.');
  }

  try {
    const contactsCollectionRef = collection(db, 'users', currentUser.uid, 'trustedContacts');
    const newDocRef = doc(contactsCollectionRef); // Generates a unique document reference & ID

    const contactData: TrustedContact = {
      id: newDocRef.id,
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      isPrimary: contact.isPrimary,
      smsEnabled: contact.smsEnabled,
      createdAt: serverTimestamp()
    };

    await setDoc(newDocRef, contactData);
    return contactData;
  } catch (error) {
    console.error('Error in addContact:', error);
    throw error;
  }
}

/**
 * Updates an existing trusted contact for the currently authenticated user.
 * 
 * Path: users/{uid}/trustedContacts/{contactId}
 * 
 * @param contactId - The unique ID of the contact to update.
 * @param updates - A partial contact object containing the fields to update.
 * @returns A promise that resolves when the update completes.
 * @throws An error if the user is not authenticated or the Firestore operation fails.
 */
export async function updateContact(
  contactId: string, 
  updates: Partial<ContactInput>
): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to update a trusted contact.');
  }

  try {
    const contactDocRef = doc(db, 'users', currentUser.uid, 'trustedContacts', contactId);
    await updateDoc(contactDocRef, updates);
  } catch (error) {
    console.error('Error in updateContact:', error);
    throw error;
  }
}

/**
 * Deletes a trusted contact for the currently authenticated user.
 * 
 * Path: users/{uid}/trustedContacts/{contactId}
 * 
 * @param contactId - The unique ID of the contact to delete.
 * @returns A promise that resolves when deletion is successful.
 * @throws An error if the user is not authenticated or the Firestore operation fails.
 */
export async function deleteContact(contactId: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to delete a trusted contact.');
  }

  try {
    const contactDocRef = doc(db, 'users', currentUser.uid, 'trustedContacts', contactId);
    await deleteDoc(contactDocRef);
  } catch (error) {
    console.error('Error in deleteContact:', error);
    throw error;
  }
}

/**
 * Retrieves all trusted contacts for the currently authenticated user.
 * 
 * Path: users/{uid}/trustedContacts
 * 
 * @returns A promise that resolves to an array of TrustedContact objects.
 * @throws An error if the user is not authenticated or the Firestore operation fails.
 */
export async function getContacts(): Promise<TrustedContact[]> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to fetch trusted contacts.');
  }

  try {
    const contactsCollectionRef = collection(db, 'users', currentUser.uid, 'trustedContacts');
    const querySnapshot = await getDocs(contactsCollectionRef);
    
    const contacts: TrustedContact[] = [];
    querySnapshot.forEach((docSnap) => {
      contacts.push(docSnap.data() as TrustedContact);
    });

    return contacts;
  } catch (error) {
    console.error('Error in getContacts:', error);
    throw error;
  }
}

/**
 * Retrieves the primary trusted contact for the currently authenticated user.
 * 
 * Path: users/{uid}/trustedContacts (filtered where isPrimary is true)
 * 
 * @returns A promise that resolves to the primary TrustedContact, or null if none is marked as primary.
 * @throws An error if the user is not authenticated or the Firestore operation fails.
 */
export async function getPrimaryContact(): Promise<TrustedContact | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to fetch the primary contact.');
  }

  try {
    const contactsCollectionRef = collection(db, 'users', currentUser.uid, 'trustedContacts');
    const q = query(contactsCollectionRef, where('isPrimary', '==', true), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as TrustedContact;
    }

    return null;
  } catch (error) {
    console.error('Error in getPrimaryContact:', error);
    throw error;
  }
}
