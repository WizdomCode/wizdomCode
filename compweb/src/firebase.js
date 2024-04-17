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
  apiKey: "AIzaSyBkelHeCoh_4mtL1kglImNe478C_FGMRG8",
  authDomain: "cp-learner.firebaseapp.com",
  projectId: "cp-learner",
  storageBucket: "cp-learner.appspot.com",
  messagingSenderId: "616791896554",
  appId: "1:616791896554:web:66aeb6ef021dd3f06a0293",
  measurementId: "G-XZPP8VSXBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);  // Initialize Firestore


export { auth, app, db };  // Export Firestore