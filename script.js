const backend = "https://gloopet-backend.onrender.com"; // change if different backend URL

// --- LOGIN PAGE ---
if (document.getElementById("loginBtn")) {
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    const res = await fetch(`${backend}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      window.location = "shop.html";
    } else {
      message.textContent = data.error || "Incorrect email or password";
    }
  });

  document.getElementById("signupBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    const res = await fetch(`${backend}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      window.location = "shop.html";
    } else {
      message.textContent = data.error || "Signup failed";
    }
  });
}

// --- SHOP PAGE ---
if (document.getElementById("buyPack")) {
  const coinsEl = document.getElementById("coins");
  const resultEl = document.getElementById("result");
  const blobsEl = document.getElementById("blobs");

  async function loadData() {
    const token = localStorage.getItem("token");
    if (!token) return (window.location = "index.html");

    const res = await fetch(`${backend}/userdata`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      coinsEl.textContent = data.user.coins;
      blobsEl.innerHTML = "";
      for (let blob in data.user.blobs) {
        blobsEl.innerHTML += `<div><img src="https://i.imgur.com/B1kFw6I.png" width="60"><p>${blob} x${data.user.blobs[blob]}</p></div>`;
      }
    }
  }

  document.getElementById("buyPack").addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${backend}/buy-pack`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.success) {
      resultEl.textContent = `You got: ${data.blob}`;
      loadData();
    } else {
      resultEl.textContent = data.error;
    }
  });

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location = "index.html";
  });

  loadData();
}
