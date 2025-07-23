// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = !!user.username;

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
  localStorage.removeItem("user");
  alert("Logged out!");
  location.reload();
}
