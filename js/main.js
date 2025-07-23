// js/main.js
// Import authentication functions from auth.js
import { registerUser, loginUser, logoutUser } from './auth.js';

document.addEventListener("DOMContentLoaded", () => {
    // Get references to the registration and login forms
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    /**
     * Updates the visibility of navigation links and the welcome message
     * based on the current authentication status and user role stored in localStorage.
     */
    const updateNavLinks = () => {
        const isLoggedIn = localStorage.getItem("loggedIn") === "true";
        const userRole = localStorage.getItem("userRole");
        const username = localStorage.getItem("username"); // Get username from localStorage

        const loginLink = document.querySelector(".login-link");
        const registerLink = document.querySelector(".register-link");
        const logoutLink = document.querySelector(".logout-link");
        const savedLink = document.querySelector(".saved-link");
        const proLink = document.querySelector(".pro-link");
        const welcomeMessageSection = document.getElementById("welcomeMessage"); // The hero section

        // Toggle visibility of navigation links
        if (loginLink) loginLink.style.display = isLoggedIn ? "none" : "inline-block";
        if (registerLink) registerLink.style.display = isLoggedIn ? "none" : "inline-block";
        if (logoutLink) logoutLink.style.display = isLoggedIn ? "inline-block" : "none";
        if (savedLink) savedLink.style.display = isLoggedIn ? "inline-block" : "none";

        if (proLink) {
            proLink.style.display = (isLoggedIn && userRole === "pro") ? "inline-block" : "none";
        }

        // Update the welcome message in the hero section
        if (welcomeMessageSection) {
            if (isLoggedIn) {
                welcomeMessageSection.innerHTML = `
                    <h2 class="text-4xl font-bold mb-4 text-pink-400">Welcome, ${username || 'User'}!</h2>
                    <p class="text-lg text-gray-300 mb-6">Enjoy exclusive NSFW content – Free and Pro categories available.</p>
                    <a href="membership.html" class="cta inline-block mt-4 px-6 py-3 bg-pink-600 text-white font-bold rounded-lg shadow-lg hover:bg-pink-700 transition duration-300">Become a Pro Member</a>
                `;
            } else {
                welcomeMessageSection.innerHTML = `
                    <h2 class="text-4xl font-bold mb-4 text-pink-400">Welcome to VibeXXX</h2>
                    <p class="text-lg text-gray-300 mb-6">Enjoy exclusive NSFW content – Free and Pro categories available.</p>
                    <a href="membership.html" class="cta inline-block mt-4 px-6 py-3 bg-pink-600 text-white font-bold rounded-lg shadow-lg hover:bg-pink-700 transition duration-300">Become a Pro Member</a>
                `;
            }
        }
    };

    // Initial update of navigation links when the DOM is loaded
    updateNavLinks();

    // Listen for the custom 'authstatechanged' event dispatched by auth.js
    // This ensures UI updates whenever the Firebase authentication state changes.
    window.addEventListener('authstatechanged', updateNavLinks);

    // Handle Register Form Submission
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Prevent default form submission
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!username || !email || !password) {
                window.showModal("Please fill in all fields."); // Use the global modal function
                return;
            }

            // Call the registerUser function from auth.js
            const success = await registerUser(username, email, password);
            if (success) {
                // If registration was successful, redirect to the homepage
                // The authstatechanged listener will handle UI updates after successful login
                window.location.href = "index.html";
            }
        });
    }

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Prevent default form submission
            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            if (!email || !password) {
                window.showModal("Please enter email and password."); // Use the global modal function
                return;
            }

            // Call the loginUser function from auth.js
            const success = await loginUser(email, password);
            if (success) {
                // If login was successful, redirect to the homepage
                // The authstatechanged listener will handle UI updates
                window.location.href = "index.html";
            }
        });
    }

    // Global logout function (called from index.html's onclick)
    window.logout = async () => {
        const success = await logoutUser(); // Call the logoutUser function from auth.js
        if (success) {
            // Reload the page to reflect the logged-out state and update UI
            location.reload();
        }
    };

    // Placeholder for video grid content (from your original main.js)
    const videoGrid = document.getElementById("videoGrid");
    if (videoGrid) {
        // Example: Add some placeholder videos
        videoGrid.innerHTML = `
            <div class="video-card bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <img src="https://placehold.co/300x200/222/FFF?text=Video+1" alt="Video 1" class="w-full h-40 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-white">Free Video Title 1</h3>
                    <p class="text-gray-400 text-sm">Description of free video content.</p>
                </div>
            </div>
            <div class="video-card bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <img src="https://placehold.co/300x200/222/FFF?text=Video+2" alt="Video 2" class="w-full h-40 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-white">Free Video Title 2</h3>
                    <p class="text-gray-400 text-sm">Description of free video content.</p>
                </div>
            </div>
            <div class="video-card bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <img src="https://placehold.co/300x200/222/FFF?text=Video+3" alt="Video 3" class="w-full h-40 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-white">Free Video Title 3</h3>
                    <p class="text-gray-400 text-sm">Description of free video content.</p>
                </div>
            </div>
        `;
    }
});
