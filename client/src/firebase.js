// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webbuilder-81968.firebaseapp.com",
  projectId: "webbuilder-81968",
  storageBucket: "webbuilder-81968.firebasestorage.app",
  messagingSenderId: "200516263913",
  appId: "1:200516263913:web:f1b3bc106c8dd4a45b7578"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}
