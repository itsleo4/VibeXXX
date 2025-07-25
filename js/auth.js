// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyCc9N4rRu5-pjvOPDq78FUzQ2Bh2fuHyQ8",
    authDomain: "vibexxx-500c6.firebaseapp.com",
    projectId: "vibexxx-500c6",
    storageBucket: "vibexxx-500c6.firebasestorage.app",
    messagingSenderId: "880697212397",
    appId: "1:880697212397:web:b47c4b1d1dadcb6e5bbbe4"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore(); // Initialize Firestore

// Helper function for showing modals (copy-pasted for self-containment)
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');
const closeModalButton = document.getElementById('closeModal');

if (modal && closeModalButton) {
    closeModalButton.addEventListener('click', () => {
        hideModal();
    });
}

function showModal(message) {
    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
    }
}

function hideModal() {
    if (modal) {
        modal.classList.add('hidden');
    }
}

// --- Registration Logic (kept for consistency, but form submission handled in register.html) ---
// This function is now called by register.html's inline script
async function registerUser(username, email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await db.collection('users').doc(user.uid).set({
            email: user.email,
            username: username, // Save username
            registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
            unlocked_access: false,
            subscriptionEndDate: null
        });
        console.log("User document created for:", user.uid);
        return true; // Indicate success
    } catch (error) {
        console.error("Registration error:", error);
        showModal(`Registration failed: ${error.message}`);
        return false; // Indicate failure
    }
}

// --- Login Logic (kept for consistency, but form submission handled in login.html) ---
// This function is now called by login.html's inline script
async function loginUser(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        return true; // Indicate success
    } catch (error) {
        console.error("Login error:", error);
        showModal(`Login failed: ${error.message}`);
        return false; // Indicate failure
    }
}

// --- Logout Logic (for general use across pages if needed) ---
// This part might be duplicated in main.js or specific pages, keep it here for core auth.
// The logout button is now part of the header in relevant pages.
document.addEventListener('DOMContentLoaded', () => {
    const logoutButtons = document.querySelectorAll('.logout-link'); // Select all elements with this class
    logoutButtons.forEach(button => {
        if (button) { // Added null check for safety
            button.addEventListener('click', async (e) => {
                e.preventDefault(); // Prevent default link behavior if it's an anchor
                try {
                    await auth.signOut();
                    console.log("User logged out.");
                    window.location.href = 'index.html'; // Redirect to home page
                } catch (error) {
                    console.error("Logout error:", error);
                    showModal(`Logout failed: ${error.message}`);
                }
            });
        }
    });
});


// --- Update UI based on Auth State (e.g., show/hide login/logout buttons) ---
auth.onAuthStateChanged(user => {
    // Select all elements with these classes across the entire document
    const loginLinks = document.querySelectorAll('.login-link');
    const registerLinks = document.querySelectorAll('.register-link');
    const logoutButtons = document.querySelectorAll('.logout-link');

    if (user) {
        // User is logged in
        loginLinks.forEach(link => link.classList.add('hidden'));
        registerLinks.forEach(link => link.classList.add('hidden'));
        logoutButtons.forEach(button => button.classList.remove('hidden'));
    } else {
        // User is logged out
        loginLinks.forEach(link => link.classList.remove('hidden'));
        registerLinks.forEach(link => link.classList.remove('hidden'));
        logoutButtons.forEach(button => button.classList.add('hidden'));
    }
});
