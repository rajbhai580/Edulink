// PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0nZJS1G2IFUD-R2TEvdcWdPdbU1Cara8",
  authDomain: "edulink-7b650.firebaseapp.com",
  databaseURL: "https://edulink-7b650-default-rtdb.firebaseio.com",
  projectId: "edulink-7b650",
  storageBucket: "edulink-7b650.firebasestorage.app",
  messagingSenderId: "412672033575",
  appId: "1:412672033575:web:2aca2a6f4895d9cbcc9f02"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
