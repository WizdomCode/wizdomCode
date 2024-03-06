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
  apiKey: "AIzaSyD-MzUZciDtK8vTguD-N3MFBx52T1E8oY8",
  authDomain: "competitveprogrammingweb.firebaseapp.com",
  projectId: "competitveprogrammingweb",
  storageBucket: "competitveprogrammingweb.appspot.com",
  messagingSenderId: "308681160429",
  appId: "1:308681160429:web:4b081a38a3a08f1c133ee4",
  measurementId: "G-6S6FCLMCWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);  // Initialize Firestore


export { auth, app, db };  // Export Firestore