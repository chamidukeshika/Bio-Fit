// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; 
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGn3w7HB6mZWORaeOzX_g3vcVNpjbbeEE",
  authDomain: "fitconnect-9862a.firebaseapp.com",
  projectId: "fitconnect-9862a",
  storageBucket: "fitconnect-9862a.appspot.com",
  messagingSenderId: "885955355532",
  appId: "1:885955355532:web:6278d212422fb09cdaaca9",
  measurementId: "G-TKPC4BN2M6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
export { auth, provider };