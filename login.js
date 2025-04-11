// Gerir login/logout e botão fixo

// Login handler
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "goon" && pass === "1234") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "videos.html";
  } else {
    const error = document.getElementById("login-error");
    if (error) error.style.display = "block";
  }
}

// Botão fixo no topo
window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("fixed-login-btn");
  const isLoggedIn = localStorage.getItem("loggedIn");

  if (isLoggedIn === "true") {
    btn.textContent = "Sair";
    btn.onclick = () => {
      localStorage.removeItem("loggedIn");
      window.location.href = "login.html";
    };
  } else {
    btn.textContent = "Login";
    btn.onclick = () => {
      window.location.href = "login.html";
    };
  }
});
