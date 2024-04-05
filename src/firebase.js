// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCk2AnYbRwQcrEDALVioiLcx1uEgQDIpqs",
  authDomain: "flats-bf328.firebaseapp.com",
  projectId: "flats-bf328",
  storageBucket: "flats-bf328.appspot.com",
  messagingSenderId: "177307629688",
  appId: "1:177307629688:web:d731b4e34f240075c6158d",
  measurementId: "G-H5GCBHBG86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);
