import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ==========================================
// PASTE YOUR FIREBASE CONFIGURATION HERE
// ==========================================
// You can get these values from the Firebase Console:
// 1. Go to Project Settings (gear icon in the sidebar).
// 2. Scroll down to the "Your apps" section.
// 3. Select your app (or click "Add app" -> Web if you haven't created one).
// 4. Copy the `firebaseConfig` object and paste it below:
const firebaseConfig = {
  apiKey: "AIzaSyC7EVbYDeIT8S1ISJgABWl_Yy-k2C4CmDw",
  authDomain: "responza-a8c58.firebaseapp.com",
  projectId: "responza-a8c58",
  storageBucket: "responza-a8c58.firebasestorage.app",
  messagingSenderId: "593077850261",
  appId: "1:593077850261:web:af5a5539bb0a13d0818b9c",
  measurementId: "G-34BFM42DD9"
};

// Initialize Firebase App
// Check if a Firebase app is already initialized to avoid errors during hot reloading/Fast Refresh
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication with AsyncStorage persistence
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch {
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

// Export auth and db for use throughout the application
export { app, auth, db };

