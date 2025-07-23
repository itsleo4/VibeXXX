document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // Register
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!username || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      const userData = { username, email, password, role: "free" };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("loggedIn", "true");

      alert("Registration successful!");
      window.location.href = "index.html";
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (storedUser.email === email && storedUser.password === password) {
        localStorage.setItem("loggedIn", "true");
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        alert("Invalid email or password.");
      }
    });
  }
});
