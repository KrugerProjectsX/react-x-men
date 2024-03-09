// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDExK8L2FwgwAaUkI-qMksVHYAhk7fvuGM",
  authDomain: "flats-7773d.firebaseapp.com",
  projectId: "flats-7773d",
  storageBucket: "flats-7773d.appspot.com",
  messagingSenderId: "745595547638",
  appId: "1:745595547638:web:f36952b443b5b999b0e1d7",
  measurementId: "G-PQ6XRGDLCN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);
