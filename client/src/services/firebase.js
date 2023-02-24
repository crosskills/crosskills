import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
require('dotenv').config()
// const dotenv = require('dotenv');

console.log(process.env.FIREBASE_PROJECT_ID)

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MESUREMENT_ID

    // apiKey: "AIzaSyBv_UAdnWtZP3MmGEHG14Q2vdtQfKotl1s",
    // authDomain: "crosskills-638ae.firebaseapp.com",
    // projectId: "crosskills-638ae",
    // storageBucket: "crosskills-638ae.appspot.com",
    // messagingSenderId: "970789966139",
    // appId: "1:970789966139:web:980a2ab1ae7753d64a671e",
    // measurementId: "G-NSBB6SZR3P"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const database = getFirestore(app);