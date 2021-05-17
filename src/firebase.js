import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  
        apiKey: "AIzaSyBlFZCY75ebqLtDQoJ6VXYwpzw599mARWo",
        authDomain: "instagram-clone-975c0.firebaseapp.com",
        projectId: "instagram-clone-975c0",
        storageBucket: "instagram-clone-975c0.appspot.com",
        messagingSenderId: "20009469991",
        appId: "1:20009469991:web:dd41ea60a8a7d24ef86602",
        measurementId: "G-1RKF2GNJ72"
 });
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage} ;