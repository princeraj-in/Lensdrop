import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyCnAt8cj1OMsD4390663ApYS6wlYs-oPWY",
  authDomain: "lensdrop-325dd.firebaseapp.com",
  projectId: "lensdrop-325dd",
  storageBucket: "lensdrop-325dd.firebasestorage.app",
  messagingSenderId: "1002219967167",
  appId: "1:1002219967167:web:528d912d9af8abb310ec0a",
  measurementId: "G-XHMDZ8NB30"
};

// Initialize Firebase app safely (avoid duplicate app initialization)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
