const API_BASE = "https://discord-role-manager--eyopasa803.replit.app";

// ---------- Sol menü ----------
const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const menuToggle = document.getElementById("menuToggle");

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    const target = item.dataset.target;
    pages.forEach(p => p.classList.toggle("active", p.id === target));
    sideMenu.classList.remove("open");
    overlay.classList.add("hidden");
  });
});

menuToggle.addEventListener("click", () => {
  sideMenu.classList.toggle("open");
  overlay.classList.toggle("hidden");
});
overlay.addEventListener("click", () => {
  sideMenu.classList.remove("open");
  overlay.classList.add("hidden");
});

// ---------- Şifreli giriş (Site Kontrol) ----------
async function checkSession() {
  try {
    const res = await fetch(`${API_BASE}/api/me`, { credentials: "include" });
    const data = await res.json();
    if (data.loggedIn) {
      document.getElementById("loginBox").classList.add("hidden");
      document.getElementById("rolControlPanel").classList.remove("hidden");
    }
  } catch {
    // Bağlantı hatası durumunda sessiz kal
  }
}
checkSession();

async function login() {
  const password = document.getElementById("passwordInput").value;
  const resultEl = document.getElementById("loginResult");
  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById("loginBox").classList.add("hidden");
      document.getElementById("rolControlPanel").classList.remove("hidden");
    } else {
      resultEl.textContent = data.message;
      resultEl.className = "rk-result err";
    }
  } catch {
    resultEl.textContent = "Sunucuya ulaşılamadı. Backend adresini kontrol edin.";
    resultEl.className = "rk-result err";
  }
}

// ---------- Site Kontrol sekmeleri ----------
document.querySelectorAll(".rk-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".rk-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    document.querySelectorAll(".rk-tabpanel").forEach(p => p.classList.remove("active"));
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
  });
});

function showResult(msg, ok) {
  const el = document.getElementById("rkResult");
  el.textContent = msg;
  el.className = "rk-result " + (ok ? "ok" : "err");
}

let selectedRoleId = null;

async function loadUserRoles(mode) {
  const userId = document.getElementById(`${mode}UserId`).value.trim();
  if (!/^\d{15,20}$/.test(userId)) {
    showResult("Geçerli bir Discord ID gir.", false);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/roles/${userId}`, { credentials: "include" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showResult(err.message || "Kullanıcı rolleri alınamadı.", false);
      return;
    }
    const data = await res.json();

    const listEl = document.getElementById(`${mode}RoleList`);
    listEl.innerHTML = "";
    selectedRoleId = null;

    const source = mode === "al"
      ? data.memberRoles
      : data.allServerRoles.filter(r => !data.memberRoles.some(m => m.id === r.id));

    if (source.length === 0) {
      listEl.innerHTML = `<p class="panel-note">${mode === "al" ? "Kullanıcının rolü yok." : "Kullanıcıda eksik rol yok."}</p>`;
      return;
    }

    source.forEach(role => {
      const row = document.createElement("div");
      row.className = "role-row";
      row.innerHTML = `<span class="role-dot" style="background:${role.color || '#888'}"></span><span>${role.name}</span>`;
      row.addEventListener("click", () => {
        document.querySelectorAll(`#${mode}RoleList .role-row`).forEach(r => r.classList.remove("selected"));
        row.classList.add("selected");
        selectedRoleId = role.id;
        document.getElementById(`${mode}ConfirmBtn`).classList.remove("hidden");
      });
      listEl.appendChild(row);
    });
  } catch {
    showResult("Sunucuya ulaşılamadı.", false);
  }
}

document.getElementById("alConfirmBtn").addEventListener("click", async () => {
  const userId = document.getElementById("alUserId").value.trim();
  if (!selectedRoleId) return;
  await postAction("/api/role/remove", { userId, roleId: selectedRoleId });
});

document.getElementById("verConfirmBtn").addEventListener("click", async () => {
  const userId = document.getElementById("verUserId").value.trim();
  if (!selectedRoleId) return;
  await postAction("/api/role/add", { userId, roleId: selectedRoleId });
});

async function postAction(path, body) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    showResult(data.message, res.ok);
  } catch {
    showResult("İşlem başarısız, sunucuya ulaşılamadı.", false);
  }
}

async function loadCurrentRank(mode) {
  const userId = document.getElementById("terfiUserId").value.trim();
  if (!/^\d{15,20}$/.test(userId)) {
    showResult("Geçerli bir Discord ID gir.", false);
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/api/rank/${userId}`, { credentials: "include" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showResult(err.message || "Rütbe bilgisi alınamadı.", false);
      return;
    }
    const data = await res.json();
    const box = document.getElementById("terfiCurrent");
    box.innerHTML = `
      <div>Mevcut rütbe: <strong>${data.currentRank ? data.currentRank.name : "Yok"}</strong></div>
      <div>Bir üst rütbe: <strong>${data.nextRank ? data.nextRank.name : "En üst rütbede"}</strong></div>
    `;
    document.getElementById("terfiConfirmBtn").classList.toggle("hidden", !data.nextRank);
  } catch {
    showResult("Sunucuya ulaşılamadı.", false);
  }
}

document.getElementById("terfiConfirmBtn").addEventListener("click", async () => {
  const userId = document.getElementById("terfiUserId").value.trim();
  await postAction("/api/rank/promote", { userId });
});
