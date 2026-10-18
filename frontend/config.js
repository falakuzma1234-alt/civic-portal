const API_URL = "/api";

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

function requireRole(role) {
  const user = getUser();
  if (!getToken() || !user || user.role !== role) {
    window.location.href = "login.html";
  }
}