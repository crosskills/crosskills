import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
require('dotenv').config()



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API,
    authDomain: "crosskills-638ae.firebaseapp.com",
    projectId: "crosskills-638ae",
    storageBucket: "crosskills-638ae.appspot.com",
    messagingSenderId: "970789966139",
    appId: "1:970789966139:web:980a2ab1ae7753d64a671e",
    measurementId: "G-NSBB6SZR3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);