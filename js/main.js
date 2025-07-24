// js/main.js
// Import authentication functions from auth.js
import { registerUser, loginUser, logoutUser } from './auth.js';

document.addEventListener("DOMContentLoaded", () => {
    // Get references to the registration and login forms
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const logoutLink = document.querySelector(".logout-link"); // Get the logout link element

    /**
     * Updates the visibility of navigation links and the welcome message
     * based on the current authentication status and user role stored in localStorage.
     */
    const updateNavLinks = () => {
        const isLoggedIn = localStorage.getItem("loggedIn") === "true";
        const userRole = localStorage.getItem("userRole");
        const username = localStorage.getItem("username"); // Get username from localStorage
        const unlockedAccess = localStorage.getItem("unlockedAccess") === "true"; // Get unlocked access status

        const loginLink = document.querySelector(".login-link");
        const registerLink = document.querySelector(".register-link");
        const savedLink = document.querySelector(".saved-link");
        const proLink = document.querySelector(".pro-link");
        const welcomeMessageSection = document.getElementById("welcomeMessage"); // The hero section
        const welcomeUserText = document.getElementById("welcomeUserText"); // The span for username

        // Toggle visibility of navigation links
        if (loginLink) loginLink.style.display = isLoggedIn ? "none" : "inline-block";
        if (registerLink) registerLink.style.display = isLoggedIn ? "none" : "inline-block";
        if (logoutLink) logoutLink.style.display = isLoggedIn ? "inline-block" : "none";

        // "Saved" and "Pro Videos" links only visible when logged in
        if (savedLink) savedLink.style.display = isLoggedIn ? "inline-block" : "none";
        // Pro link is visible if logged in and has unlocked access
        if (proLink) proLink.style.display = isLoggedIn && unlockedAccess ? "inline-block" : "none";


        // Update welcome message
        if (welcomeMessageSection) {
            if (isLoggedIn && username) {
                welcomeMessageSection.innerHTML = `
                    <h2 class="text-5xl font-extrabold text-white mb-4 leading-tight">Welcome, <span class="text-pink-500">${username}!</span></h2>
                    <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Explore a world of exclusive videos and connect with a vibrant community.</p>
                    <a href="unlocked_videos.html" class="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg">Go to Pro Videos!</a>
                `;
            } else {
                // Revert to original welcome message if not logged in
                welcomeMessageSection.innerHTML = `
                    <h2 class="text-5xl font-extrabold text-white mb-4 leading-tight">Welcome to <span class="text-pink-500">VibeXXX</span></h2>
                    <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Your ultimate destination for premium adult content. Explore a world of exclusive videos and connect with a vibrant community.</p>
                    <a href="register.html" class="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg">Join Free Now!</a>
                `;
            }
        }
    };

    // Initial update when the page loads
    updateNavLinks();

    // Event listener for registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!username || !email || !password) {
                // Assuming showModal is available globally or imported
                showModal("Please fill in all fields.");
                return;
            }

            const success = await registerUser(username, email, password);
            if (success) {
                window.location.href = 'login.html'; // Redirect to login page after successful registration
            }
        });
    }

    // Event listener for login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                showModal("Please enter email and password.");
                return;
            }

            const success = await loginUser(email, password);
            if (success) {
                // After successful login, update navigation and redirect to index
                updateNavLinks();
                window.location.href = 'index.html';
            }
        });
    }

    // Event listener for logout link click
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const success = await logoutUser();
            if (success) {
                // After successful logout, update navigation and redirect to index
                updateNavLinks();
                window.location.href = 'index.html';
            }
        });
    }

    // Ensure the modal functions are globally available if they are used by inline event handlers
    // or other scripts not using modules. This is a common pattern for older HTML structures.
    // However, with type="module" scripts, it's better to import them directly if needed.
    // If showModal/hideModal are still undefined errors in the console,
    // consider making them truly global or importing them where they are used.
    // For now, assuming they are imported/defined via auth.js and accessible.
});