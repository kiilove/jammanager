// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4fE75ZMZHXUtVKYrcZFdYdCkVH7XdYWY",
  authDomain: "jncore-asset.firebaseapp.com",
  projectId: "jncore-asset",
  storageBucket: "jncore-asset.appspot.com",
  messagingSenderId: "1007869965123",
  appId: "1:1007869965123:web:3c9a77de769beab56675f6",
  measurementId: "G-CXQM2Q6R5F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
