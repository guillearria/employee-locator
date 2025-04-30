import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import Constants from 'expo-constants';

// Type definition for Firebase config
interface FirebaseConfig extends FirebaseOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Firebase configuration from Expo Constants
const firebaseConfig: FirebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.API_KEY as string,
  authDomain: Constants.expoConfig?.extra?.AUTH_DOMAIN as string,
  projectId: Constants.expoConfig?.extra?.PROJECT_ID as string,
  storageBucket: Constants.expoConfig?.extra?.STORAGE_BUCKET as string,
  messagingSenderId: Constants.expoConfig?.extra?.MESSAGING_SENDER_ID as string,
  appId: Constants.expoConfig?.extra?.APP_ID as string
};

// Validate required configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Missing required Firebase configuration. Please check your app.config.js or app.json');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database, firebaseConfig }; 