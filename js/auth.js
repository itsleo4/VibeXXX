// firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your actual Firebase config (already correct)
const firebaseConfig = {
  apiKey: "AIzaSyCc9N4rRu5-pjvOPDq78FUzQ2Bh2fuHyQ8",
  authDomain: "vibexxx-500c6.firebaseapp.com",
  projectId: "vibexxx-500c6",
  storageBucket: "vibexxx-500c6.appspot.com", // ⬅️ FIXED this typo (was `firebasestorage.app`)
  messagingSenderId: "880697212397",
  appId: "1:880697212397:web:b47c4b1d1dadcb6e5bbbe4"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// 🧠 Export for use in other files (like auth.js)
export { auth, db };
