// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
console.log("test commit");
console.log("API Key: ", import.meta.env.VITE_APP_FIREBASE_API_KEY);
console.log("Auth Domain: ", import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN);
console.log("Project ID: ", import.meta.env.VITE_APP_FIREBASE_PROJECT_ID);
console.log("Storage Bucket: ", import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET);
console.log("Messaging Sender ID: ", import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID);
console.log("App ID: ", import.meta.env.VITE_APP_FIREBASE_APP_ID);
console.log("Measurement ID: ", import.meta.env.VITE_APP_MEASUREMENT_ID);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID
};

console.log("firebaseConfig", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);  // Initialize Firestore
const storage = getStorage(app);

export { auth, app, db, storage };  // Export Firestore
