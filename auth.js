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
    console.log("auth.js: Firebase app initialized.");
} else {
    console.log("auth.js: Firebase app already initialized.");
}

// Explicitly attach auth and db to the window object for global access
window.auth = firebase.auth();
window.db = firebase.firestore();
console.log("auth.js: Firebase Auth and Firestore instances attached to window object.");

// Helper function for showing modals
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');
const closeModalButton = document.getElementById('closeModal');

if (modal && closeModalButton) {
    closeModalButton.addEventListener('click', () => {
        hideModal();
    });
    console.log("auth.js: Modal elements found and close listener attached.");
} else {
    console.log("auth.js: Modal elements not found on this page.");
}

// Make showModal and hideModal globally accessible
window.showModal = function(message) {
    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
        console.log("auth.js: Modal shown with message:", message);
    }
};

window.hideModal = function() {
    if (modal) {
        modal.classList.add('hidden');
        console.log("auth.js: Modal hidden.");
    }
};

// --- Centralized Form Submission Handlers ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("auth.js: DOMContentLoaded event fired.");

    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log("auth.js: Login form found, attaching listener.");
        loginForm.removeAttribute('action'); // Ensure no 'action' attribute causes page reload
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission (page reload)
            console.log('auth.js: Login form submitted. e.preventDefault() called.');

            const email = loginForm.loginEmail.value.trim();
            const password = loginForm.loginPassword.value;

            if (!email || !password) {
                window.showModal("Please enter email and password.");
                console.log('auth.js: Validation failed: Email or password missing.');
                return;
            }

            try {
                console.log('auth.js: Attempting login with:', email);
                await window.auth.signInWithEmailAndPassword(email, password);
                window.showModal("Login successful!");
                loginForm.reset();
                console.log('auth.js: Login successful, redirecting to index.html');
                setTimeout(() => { window.location.href = 'index.html'; }, 1500);
            } catch (error) {
                console.error("auth.js: Login error:", error);
                window.showModal(`Login failed: ${error.message}`);
            }
        });
    } else {
        console.log("auth.js: Login form not found on this page.");
    }

    // Register Form Handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log("auth.js: Register form found, attaching listener.");
        registerForm.removeAttribute('action'); // Ensure no 'action' attribute causes page reload
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission (page reload)
            console.log('auth.js: Register form submitted. e.preventDefault() called.');

            const username = registerForm.username.value.trim();
            const email = registerForm.email.value.trim();
            const password = registerForm.password.value;

            if (!username || !email || !password) {
                window.showModal("Please fill in all fields.");
                console.log('auth.js: Validation failed: Fields missing.');
                return;
            }

            try {
                console.log('auth.js: Attempting registration with:', email, 'and username:', username);
                const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                await window.db.collection('users').doc(user.uid).set({
                    email: user.email,
                    username: username,
                    registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
                    unlocked_access: false,
                    subscriptionEndDate: null
                });
                console.log("auth.js: User document created for:", user.uid);
                window.showModal("Registration successful! You can now log in.");
                registerForm.reset();
                console.log('auth.js: Registration successful, redirecting to login.html');
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);
            } catch (error) {
                console.error("auth.js: Registration error:", error);
                window.showModal(`Registration failed: ${error.message}`);
            }
        });
    } else {
        console.log("auth.js: Register form not found on this page.");
    }

    // Logout Buttons Handler
    const logoutButtons = document.querySelectorAll('.btn-logout');
    if (logoutButtons.length > 0) {
        console.log("auth.js: Logout buttons found, attaching listeners.");
        logoutButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log("auth.js: Logout button clicked. e.preventDefault() called.");
                try {
                    await window.auth.signOut();
                    console.log("auth.js: User logged out.");
                    // Redirect to index.html after logout
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error("auth.js: Logout error:", error);
                    window.showModal(`Logout failed: ${error.message}`);
                }
            });
        });
    } else {
        console.log("auth.js: No logout buttons found on this page.");
    }
});


// --- Update UI based on Auth State (show/hide login/logout buttons) ---
window.auth.onAuthStateChanged(user => {
    console.log("auth.js: onAuthStateChanged callback fired. User:", user ? user.uid : "None");
    const loginLinks = document.querySelectorAll('.login-link');
    const registerLinks = document.querySelectorAll('.register-link');
    const logoutButtons = document.querySelectorAll('.btn-logout');

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
