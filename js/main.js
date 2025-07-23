// js/main.js

document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loginLink = document.querySelector(".login-link");
  const registerLink = document.querySelector(".register-link");
  const logoutLink = document.querySelector(".logout-link");
  const savedLink = document.querySelector(".saved-link");
  const proLink = document.querySelector(".pro-link");

  if (isLoggedIn) {
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    logoutLink.style.display = "inline-block";
    savedLink.style.display = "inline-block";

    // If user is a Pro member, show Pro section
    if (user.role === "pro") {
      proLink.style.display = "inline-block";
    }
  } else {
    loginLink.style.display = "inline-block";
    registerLink.style.display = "inline-block";
    logoutLink.style.display = "none";
    savedLink.style.display = "none";
    proLink.style.display = "none";
  }
});

function logout() {
  localStorage.removeItem("loggedIn");
  alert("Logged out!");
  location.reload();
}

// Placeholder for login/logout logic (coming in Phase 2)
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("user");

  if (isLoggedIn) {
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("registerBtn").style.display = "none";
    document.getElementById("logoutBtn").style.display = "inline-block";
  }

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
  });
});
