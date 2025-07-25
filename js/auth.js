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
        console.log("Login form found, attaching listener.");
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission (page reload)
            console.log('Login form submitted.');

            const email = loginForm.loginEmail.value.trim();
            const password = loginForm.loginPassword.value;

            if (!email || !password) {
                showModal("Please enter email and password.");
                console.log('Validation failed: Email or password missing.');
                return;
            }

            try {
                console.log('Attempting login with:', email);
                await auth.signInWithEmailAndPassword(email, password);
                showModal("Login successful!");
                loginForm.reset();
                console.log('Login successful, redirecting to index.html');
                setTimeout(() => { window.location.href = 'index.html'; }, 1500);
            } catch (error) {
                console.error("Login error:", error);
                showModal(`Login failed: ${error.message}`);
            }
        });
    } else {
        console.log("Login form not found on this page.");
    }

    // Register Form Handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log("Register form found, attaching listener.");
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission (page reload)
            console.log('Register form submitted.');

            const username = registerForm.username.value.trim();
            const email = registerForm.email.value.trim();
            const password = registerForm.password.value;

            if (!username || !email || !password) {
                showModal("Please fill in all fields.");
                console.log('Validation failed: Fields missing.');
                return;
            }

            try {
                console.log('Attempting registration with:', email, 'and username:', username);
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                await db.collection('users').doc(user.uid).set({
                    email: user.email,
                    username: username,
                    registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
                    unlocked_access: false,
                    subscriptionEndDate: null
                });
                console.log("User document created for:", user.uid);
                showModal("Registration successful! You can now log in.");
                registerForm.reset();
                console.log('Registration successful, redirecting to login.html');
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);
            } catch (error) {
                console.error("Registration error:", error);
                showModal(`Registration failed: ${error.message}`);
            }
        });
    } else {
        console.log("Register form not found on this page.");
    }

    // Logout Buttons Handler
    const logoutButtons = document.querySelectorAll('.logout-link');
    if (logoutButtons.length > 0) {
        console.log("Logout buttons found, attaching listeners.");
        logoutButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log("Logout button clicked.");
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
    } else {
        console.log("No logout buttons found on this page.");
    }
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
