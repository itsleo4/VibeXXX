// js/auth.js
// Import Firebase modules directly using their CDN URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithCustomToken, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// YOUR FIREBASE CONFIGURATION - EMBEDDED DIRECTLY
const firebaseConfig = {
    apiKey: "AIzaSyCc9N4rRu5-pjvOPDq78FUzQ2Bh2fuHyQ8",
    authDomain: "vibexxx-500c6.firebaseapp.com",
    projectId: "vibexxx-500c6", // <--- THIS IS YOUR PROJECT ID
    storageBucket: "vibexxx-500c6.appspot.com", // Corrected storageBucket
    messagingSenderId: "880697212397",
    appId: "1:880697212397:web:b47c4b1d1dadcb6e5bbbe4"
};

// The appId variable used for Firestore paths (should be your projectId)
const appId = firebaseConfig.projectId;

// The initialAuthToken is specific to the Canvas environment; set to null for general use
const initialAuthToken = null; // Set to null unless you have a specific custom token for your environment

// Initialize Firebase app, auth, and firestore instances
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to show custom modal (EXPORTED)
export function showModal(message) {
    const modalElement = document.getElementById('customModal');
    const modalMessageElement = document.getElementById('modalMessage');
    if (modalElement && modalMessageElement) {
        modalMessageElement.textContent = message;
        modalElement.classList.remove('hidden');
    }
}

// Function to hide custom modal (EXPORTED)
export function hideModal() {
    const modalElement = document.getElementById('customModal');
    if (modalElement) {
        modalElement.classList.add('hidden');
    }
}

// Firebase Authentication state listener
// This listener updates localStorage and dispatches a custom event
// so main.js can react to login/logout changes.
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userEmail", user.email || 'Anonymous User'); // Will be actual email if logged in
        localStorage.setItem("userId", user.uid);

        try {
            // Fetch user profile data from Firestore
            const userDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/profile/data`);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                localStorage.setItem("userRole", userData.role || "free");
                localStorage.setItem("username", userData.username || user.email); // Store username
            } else {
                // If profile data doesn't exist (e.g., new email user without profile), set default role
                localStorage.setItem("userRole", "free");
                localStorage.setItem("username", user.email || 'User'); // Default username
            }
        } catch (error) {
            console.error("Error fetching user profile in auth state change:", error);
            showModal(`Error fetching user profile: ${error.message}`); // Show modal for this error too
            localStorage.setItem("userRole", "free");
            localStorage.setItem("username", user.email || 'User');
        }
    } else {
        // User is signed out
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");
    }
    // Dispatch a custom event to notify main.js (or any other script) about auth state change
    window.dispatchEvent(new Event('authstatechanged'));
});

// Initial authentication attempt on page load (only custom token if available, no anonymous)
document.addEventListener("DOMContentLoaded", async () => {
    try {
        if (initialAuthToken) {
            // This path is usually for Canvas environment's internal auth
            await signInWithCustomToken(auth, initialAuthToken);
        }
        // Removed the else block with signInAnonymously(auth);
    } catch (error) {
        console.error("Firebase Auth initialization error:", error);
        showModal(`Authentication initialization error: ${error.message}`);
    }
});

/**
 * Registers a new user with email and password, and stores additional profile data in Firestore.
 * @param {string} username - The desired username.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<boolean>} - True if registration is successful, false otherwise.
 */
export async function registerUser(username, email, password) { // EXPORTED
    try {
        // Check if username or email already exists in Firestore
        const usersRef = collection(db, `artifacts/${appId}/users`);
        const qEmail = query(usersRef, where("email", "==", email));
        const qUsername = query(usersRef, where("username", "==", username));

        const [emailSnap, usernameSnap] = await Promise.all([getDocs(qEmail), getDocs(qUsername)]);

        if (!emailSnap.empty) {
            showModal("Email already registered. Please use a different email or log in.");
            return false;
        }
        if (!usernameSnap.empty) {
            showModal("Username already taken. Please choose a different username.");
            return false;
        }

        // Create user with Firebase Authentication (handles password hashing)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user data (username, role) in Firestore
        // The path is artifacts/{appId}/users/{user.uid}/profile/data
        await setDoc(doc(db, `artifacts/${appId}/users/${user.uid}/profile/data`), {
            username: username,
            email: email,
            role: "free", // Default role for new users
            createdAt: new Date(),
        });

        showModal("Registration successful! You are now logged in."); // This modal will show, then redirect
        return true;
    } catch (error) {
        console.error("Error during registration:", error);
        showModal(`Registration failed: ${error.message}`);
        return false;
    }
}

/**
 * Logs in an existing user with email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<boolean>} - True if login is successful, false otherwise.
 */
export async function loginUser(email, password) { // EXPORTED
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showModal("Login successful!");
        return true;
    } catch (error) {
        console.error("Error during login:", error);
        showModal(`Login failed: ${error.message}`);
        return false;
    }
}

/**
 * Logs out the current user.
 * @returns {Promise<boolean>} - True if logout is successful, false otherwise.
 */
export async function logoutUser() { // EXPORTED
    try {
        await signOut(auth);
        showModal("Logged out successfully!");
        return true;
    } catch (error) {
        console.error("Error during logout:", error);
        showModal(`Logout failed: ${error.message}`);
        return false;
    }
}
