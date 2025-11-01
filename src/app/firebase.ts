import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV5OH3Skb-C9lYFGLJqzQP25tIYQFkqkk",
  authDomain: "appincoanca.firebaseapp.com",
  projectId: "appincoanca",
  storageBucket: "appincoanca.firebasestorage.app",
  messagingSenderId: "822633961445",
  appId: "1:822633961445:web:d21e5447f148fe9ac2410c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);