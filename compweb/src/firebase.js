// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhBKfkEq4JXt07hPVnfvblXU4JLJrVYZM",
  authDomain: "competitiveprogrammingweb.firebaseapp.com",
  projectId: "competitiveprogrammingweb",
  storageBucket: "competitiveprogrammingweb.appspot.com",
  messagingSenderId: "82343751298",
  appId: "1:82343751298:web:b2bb67dcb323194bd64e9b",
  measurementId: "G-GN4FZSEJS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);  // Initialize Firestore


export { auth, app, db };  // Export Firestore