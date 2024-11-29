// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBoTNFlAEYBI65AgD4BB0m9vx42iXyuis8",
  authDomain: "student-manage-ca1d4.firebaseapp.com",
  projectId: "student-manage-ca1d4",
  storageBucket: "student-manage-ca1d4.firebasestorage.app",
  messagingSenderId: "261768463447",
  appId: "1:261768463447:web:f01856635ff4c82e1fcf12",
  measurementId: "G-1TTGS99P9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app;
