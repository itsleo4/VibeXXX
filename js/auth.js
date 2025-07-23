// js/auth.js

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("register-username").value;
      const password = document.getElementById("register-password").value;

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify({ username, password, role: "free" }));
      alert("Registered! Now login.");
      window.location.href = "login.html";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;

      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser && savedUser.username === username && savedUser.password === password) {
        localStorage.setItem("loggedIn", "true");
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        alert("Invalid login");
      }
    });
  }
});
