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
