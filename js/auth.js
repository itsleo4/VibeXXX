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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global modal elements and functions (defined here to be accessible by other modules)
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');
const closeModalButton = document.getElementById('closeModal');

// Check if modal and closeModalButton exist before adding event listeners
if (modal && closeModalButton) {
    closeModalButton.addEventListener('click', () => {
        hideModal();
    });
}

export function showModal(message) {
    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
    }
}

export function hideModal() {
    if (modal) {
        modal.classList.add('hidden');
    }
}


/**
 * Registers a new user with email and password and creates a user document in Firestore.
 * @param {string} username - The desired username.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<boolean>} - True if registration is successful, false otherwise.
 */
export async function registerUser(username, email, password) { // EXPORTED
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            createdAt: new Date(),
            userRole: "basic", // Default role
            unlocked_access: false // Default to no pro access
        });

        console.log("User registered and data saved:", user.uid);
        showModal("Registration successful! Please log in.");
        return true;
    } catch (error) {
        console.error("Error during registration:", error);
        let errorMessage = "Registration failed: An unknown error occurred.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Registration failed: Email is already in use.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "Registration failed: Password is too weak (min 6 characters).";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Registration failed: Invalid email format.";
        }
        showModal(errorMessage);
        return false;
    }
}

/**
 * Logs in an existing user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<boolean>} - True if login is successful, false otherwise.
 */
export async function loginUser(email, password) { // EXPORTED
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user data from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userUID", user.uid);
            localStorage.setItem("username", userData.username || user.email);
            localStorage.setItem("userRole", userData.userRole || "basic");
            // Store unlocked_access status
            localStorage.setItem("unlockedAccess", userData.unlocked_access ? "true" : "false");
            console.log("User logged in successfully:", userData.username);
            showModal("Logged in successfully!");
        } else {
            // If user document doesn't exist (shouldn't happen with registerUser),
            // log them out or set default basic access.
            console.warn("User document not found for UID:", user.uid);
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userUID", user.uid);
            localStorage.setItem("username", user.email);
            localStorage.setItem("userRole", "basic");
            localStorage.setItem("unlockedAccess", "false");
            showModal("Logged in successfully (basic access).");
        }
        return true;
    }
    // IMPORTANT: Catch specific Firebase Auth errors for better messages
    catch (error) {
        console.error("Error during login:", error);
        let errorMessage = "Login failed: An unknown error occurred.";
        if (error.code === 'auth/invalid-email') {
            errorMessage = "Login failed: Invalid email format.";
        } else if (error.code === 'auth/user-disabled') {
            errorMessage = "Login failed: Your account has been disabled.";
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = "Login failed: No user found with this email.";
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = "Login failed: Incorrect password.";
        } else if (error.code === 'auth/invalid-credential') { // This is the one you're seeing
            errorMessage = "Login failed: Invalid credentials. Please check your email and password.";
        }
        showModal(errorMessage);
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
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userUID");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
        localStorage.removeItem("unlockedAccess");
        showModal("Logged out successfully!");
        return true;
    } catch (error) {
        console.error("Error during logout:", error);
        showModal(`Logout failed: ${error.message}`);
        return false;
    }
}

// Export auth and db instances for direct use in other modules if needed
export { auth, db };