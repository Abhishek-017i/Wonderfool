// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnUu6RsOTcy94ylBToAq36tI8O_8gg8hQ",
  authDomain: "wonderfool-17.firebaseapp.com",
  projectId: "wonderfool-17",
  storageBucket: "wonderfool-17.firebasestorage.app",
  messagingSenderId: "787297261070",
  appId: "1:787297261070:web:d5448ba5bf880d784b0e5f",
  measurementId: "G-XKFXFX9PFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);