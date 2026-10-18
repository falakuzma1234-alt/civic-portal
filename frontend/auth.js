const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      password: document.getElementById("password").value,
    };

    try {
      const response = await fetch(API_URL + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        alert("Registration ho gaya! Ab login karo.");
        window.location.href = "login.html";
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Server se connect nahi ho paya");
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    try {
      const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        if (result.user.role === "admin") {
          window.location.href = "admin.html";
        } else if (result.user.role === "official") {
          window.location.href = "official.html";
        } else {
          window.location.href = "dashboard.html";
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Server se connect nahi ho paya");
    }
  });
}