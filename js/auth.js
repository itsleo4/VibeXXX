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

// --- Centralized Form Submission Handlers ---
document.addEventListener('DOMContentLoaded', () => {
    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.loginEmail.value.trim();
            const password = loginForm.loginPassword.value;

            if (!email || !password) {
                showModal("Please enter email and password.");
                return;
            }

            try {
                await auth.signInWithEmailAndPassword(email, password);
                showModal("Login successful!");
                loginForm.reset();
                setTimeout(() => { window.location.href = 'index.html'; }, 1500);
            } catch (error) {
                console.error("Login error:", error);
                showModal(`Login failed: ${error.message}`);
            }
        });
    }

    // Register Form Handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = registerForm.username.value.trim();
            const email = registerForm.email.value.trim();
            const password = registerForm.password.value;

            if (!username || !email || !password) {
                showModal("Please fill in all fields.");
                return;
            }

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                await db.collection('users').doc(user.uid).set({
                    email: user.email,
                    username: username,
                    registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
                    unlocked_access: false,
                    subscriptionEndDate: null
                });
                showModal("Registration successful! You can now log in.");
                registerForm.reset();
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);
            } catch (error) {
                console.error("Registration error:", error);
                showModal(`Registration failed: ${error.message}`);
            }
        });
    }

    // Logout Buttons Handler
    const logoutButtons = document.querySelectorAll('.logout-link');
    logoutButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await auth.signOut();
                console.log("User logged out.");
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Logout error:", error);
                showModal(`Logout failed: ${error.message}`);
            }
        });
    });
});


// --- Update UI based on Auth State (show/hide login/logout buttons) ---
auth.onAuthStateChanged(user => {
    const loginLinks = document.querySelectorAll('.login-link');
    const registerLinks = document.querySelectorAll('.register-link');
    const logoutButtons = document.querySelectorAll('.logout-link');

    if (user) {
        loginLinks.forEach(link => link.classList.add('hidden'));
        registerLinks.forEach(link => link.classList.add('hidden'));
        logoutButtons.forEach(button => button.classList.remove('hidden'));
    } else {
        loginLinks.forEach(link => link.classList.remove('hidden'));
        registerLinks.forEach(link => link.classList.remove('hidden'));
        logoutButtons.forEach(button => button.classList.add('hidden'));
    }
});
