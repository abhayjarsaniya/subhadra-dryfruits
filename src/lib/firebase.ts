import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  linkWithCredential,
  linkWithPopup,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  User,
  PhoneAuthProvider,
  ConfirmationResult,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    process.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyCqfx8ciKl_TPXuG6YDoIWQxgCkffO2rGo",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    process.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "subhadra-dryfruits.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.VITE_FIREBASE_PROJECT_ID ||
    "subhadra-dryfruits",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "subhadra-dryfruits.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    "25982608407",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    process.env.VITE_FIREBASE_APP_ID ||
    "1:25982608407:web:682f0a6c422434046b2852",
};

// Singleton Firebase initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithPhoneNumber,
  linkWithCredential,
  linkWithPopup,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  PhoneAuthProvider,
};
export type { User, ConfirmationResult };
