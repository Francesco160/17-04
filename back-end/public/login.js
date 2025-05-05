document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "http://localhost:3001/homepage"; // Vai alla homepage
    } else {
      alert(data.message || "Login fallito");
    }
  } catch (err) {
    console.error("Errore di login:", err);
    alert("Errore durante il login");
  }
});
