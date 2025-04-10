function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "goon" && pass === "1234") {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("private-content").style.display = "block";
  } else {
    document.getElementById("login-error").style.display = "block";
  }
}
