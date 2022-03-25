// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBFsmyWkG96m_NeL3PayIkUZM9yI0IHqwg",
//     authDomain: "resox-45ef1.firebaseapp.com",
//     projectId: "resox-45ef1",
//     storageBucket: "resox-45ef1.appspot.com",
//     messagingSenderId: "150486001574",
//     appId: "1:150486001574:web:ac8a6a4767ebb4ce9ad167"
// };

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBAE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID
// };

const firebaseConfig = {
    apiKey: "AIzaSyABPsqWSi5aQdf6S1JKCARCcVGCNIA6Hi0",
    authDomain: "bhook-e6bb8.firebaseapp.com",
    projectId: "bhook-e6bb8",
    storageBucket: "bhook-e6bb8.appspot.com",
    messagingSenderId: "463287620100",
    appId: "1:463287620100:web:065432a3759354665ddb51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }