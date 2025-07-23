// js/auth.js
// Import Firebase modules directly using their CDN URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Access global variables provided by index.html
const firebaseConfig = JSON.parse(window.__firebase_config);
const appId = window.__app_id;
const initialAuthToken = window.__initial_auth_token;

// Initialize Firebase app, auth, and firestore instances
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to show custom modal
export function showModal(message) { // EXPORTED
    const modalElement = document.getElementById('customModal');
    const modalMessageElement = document.getElementById('modalMessage');
    if (modalElement && modalMessageElement) {
        modalMessageElement.textContent = message;
        modalElement.classList.remove('hidden');
    }
}

// Function to hide custom modal
export function hideModal() { // EXPORTED
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
        localStorage.setItem("userEmail", user.email || 'Anonymous User');
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
                // If profile data doesn't exist (e.g., anonymous user or new email user without profile), set default role
                localStorage.setItem("userRole", "free");
                localStorage.setItem("username", user.email || 'User'); // Default username
            }
        } catch (error) {
            console.error("Error fetching user profile in auth state change:", error);
            // Fallback in case of Firestore error
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

// Initial authentication attempt on page load (for custom token)
document.addEventListener("DOMContentLoaded", async () => {
    try {
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            // Sign in anonymously if no custom token, to allow Firestore access based on rules
            await signInAnonymously(auth);
        }
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
export async function registerUser(username, email, password) {
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
        await setDoc(doc(db, `artifacts/${appId}/users/${user.uid}/profile/data`), {
            username: username,
            email: email,
            role: "free", // Default role for new users
            createdAt: new Date(),
        });

        showModal("Registration successful! You are now logged in.");
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
export async function loginUser(email, password) {
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
export async function logoutUser() {
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
