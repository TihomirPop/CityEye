// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUY11RGhx0bJVxMRphkwgtBbxobSDtDTo",
  authDomain: "cityeyen.firebaseapp.com",
  projectId: "cityeyen",
  storageBucket: "cityeyen.appspot.com",
  messagingSenderId: "626523382367",
  appId: "1:626523382367:web:0ec4c9e116a038e7b2f1ea",
  measurementId: "G-BQFTKR0F87",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);