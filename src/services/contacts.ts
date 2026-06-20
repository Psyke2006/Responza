import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Interface representing a trusted contact's structure in Firestore.
 */
export interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  enabled: boolean;
  createdAt: any; // Firestore Timestamp
}

/**
 * Input format for creating/updating a contact.
 */
export type ContactInput = Omit<Contact, 'id' | 'createdAt'>;

/**
 * Adds a new contact under users/{uid}/contacts/{contactId}
 * 
 * @param uid - The user's UID.
 * @param contact - The contact input data.
 * @returns A promise resolving to the created Contact object.
 */
export async function addContact(uid: string, contact: ContactInput): Promise<Contact> {
  if (!uid) {
    throw new Error('User UID is required to add a contact.');
  }
  
  try {
    const contactsCollectionRef = collection(db, 'users', uid, 'contacts');
    const newDocRef = doc(contactsCollectionRef); // Generates a unique ID
    
    const contactData: Contact = {
      id: newDocRef.id,
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      enabled: contact.enabled !== undefined ? contact.enabled : true,
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
 * Retrieves all contacts under users/{uid}/contacts
 * 
 * @param uid - The user's UID.
 * @returns A promise resolving to an array of Contact objects.
 */
export async function getContacts(uid: string): Promise<Contact[]> {
  if (!uid) {
    throw new Error('User UID is required to fetch contacts.');
  }

  try {
    const contactsCollectionRef = collection(db, 'users', uid, 'contacts');
    const querySnapshot = await getDocs(contactsCollectionRef);
    
    const contacts: Contact[] = [];
    querySnapshot.forEach((docSnap) => {
      contacts.push(docSnap.data() as Contact);
    });
    
    // Sort locally by createdAt (oldest first) to ensure consistent order
    contacts.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeA - timeB;
    });

    return contacts;
  } catch (error) {
    console.error('Error in getContacts:', error);
    throw error;
  }
}

/**
 * Updates a contact under users/{uid}/contacts/{contactId}
 * 
 * @param uid - The user's UID.
 * @param contactId - The ID of the contact to update.
 * @param data - The partial contact data to update.
 * @returns A promise resolving when the update is complete.
 */
export async function updateContact(
  uid: string, 
  contactId: string, 
  data: Partial<ContactInput>
): Promise<void> {
  if (!uid || !contactId) {
    throw new Error('User UID and Contact ID are required to update a contact.');
  }

  try {
    const docRef = doc(db, 'users', uid, 'contacts', contactId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error in updateContact:', error);
    throw error;
  }
}

/**
 * Deletes a contact under users/{uid}/contacts/{contactId}
 * 
 * @param uid - The user's UID.
 * @param contactId - The ID of the contact to delete.
 * @returns A promise resolving when the deletion is complete.
 */
export async function deleteContact(uid: string, contactId: string): Promise<void> {
  if (!uid || !contactId) {
    throw new Error('User UID and Contact ID are required to delete a contact.');
  }

  try {
    const docRef = doc(db, 'users', uid, 'contacts', contactId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error in deleteContact:', error);
    throw error;
  }
}

/**
 * Toggles a contact's enabled field under users/{uid}/contacts/{contactId}
 * 
 * @param uid - The user's UID.
 * @param contactId - The ID of the contact to toggle.
 * @param enabled - The new enabled status.
 * @returns A promise resolving when the toggle update is complete.
 */
export async function toggleContact(
  uid: string, 
  contactId: string, 
  enabled: boolean
): Promise<void> {
  if (!uid || !contactId) {
    throw new Error('User UID and Contact ID are required to toggle a contact.');
  }

  try {
    const docRef = doc(db, 'users', uid, 'contacts', contactId);
    await updateDoc(docRef, { enabled });
  } catch (error) {
    console.error('Error in toggleContact:', error);
    throw error;
  }
}
