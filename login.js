function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "goon" && pass === "1234") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "videos.html"; // Redireciona para os vídeos
  } else {
    document.getElementById("login-error").style.display = "block";
  }
}
