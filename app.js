const API_BASE = "https://discord-role-manager--eyopasa803.replit.app";

// ---------- Sol Menü ve Tıklama Fonksiyonları ----------
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

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
    overlay.classList.toggle("hidden");
  });
}

if (overlay) {
  overlay.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    overlay.classList.add("hidden");
  });
}

// ---------- Site Kontrol Şifreli Giriş ve Yönetim ----------
async function login() {
  const password = document.getElementById("passwordInput").value;
  const resultEl = document.getElementById("loginResult");
  
  // Örnek basit yetki kontrolü (Dilersen kendi Replit backendine bağlayabilirsin)
  if (password === "hukum1453" || password === "admin") {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("rolControlPanel").classList.remove("hidden");
    resultEl.textContent = "Giriş başarılı! Artık siteyi yönetebilirsin şefim.";
    resultEl.className = "rk-result ok";
  } else {
    resultEl.textContent = "Hatalı Yönetim Şifresi!";
    resultEl.className = "rk-result err";
  }
}

// ---------- Site Kontrol Sekmeleri ----------
document.querySelectorAll(".rk-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".rk-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    document.querySelectorAll(".rk-tabpanel").forEach(p => p.classList.remove("active"));
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
  });
});

// Duyuru Ekleme Fonksiyonu
function siteyeDuyuruEkle() {
  const baslik = document.getElementById("yeniDuyuruBaslik").value;
  const icerik = document.getElementById("yeniDuyuruIcerik").value;
  const container = document.getElementById("duyuruContainer");

  if (!baslik || !icerik) {
    alert("Lütfen başlık ve içerik gir şefim.");
    return;
  }

  const newPost = document.createElement("div");
  newPost.className = "post-card";
  newPost.innerHTML = `<h3>📢 ${baslik}</h3><p>${icerik}</p>`;
  container.prepend(newPost);

  document.getElementById("yeniDuyuruBaslik").value = "";
  document.getElementById("yeniDuyuruIcerik").value = "";
  alert("Duyuru başarıyla siteye eklendi!");
}

// İcraat Ekleme Fonksiyonu
function siteyeIcraatEkle() {
  const baslik = document.getElementById("yeniIcraatBaslik").value;
  const icerik = document.getElementById("yeniIcraatIcerik").value;
  const container = document.getElementById("icraatContainer");

  if (!baslik || !icerik) {
    alert("Lütfen başlık ve içerik gir şefim.");
    return;
  }

  const newPost = document.createElement("div");
  newPost.className = "post-card";
  newPost.innerHTML = `<h3>🏛️ ${baslik}</h3><p>${icerik}</p>`;
  container.prepend(newPost);

  document.getElementById("yeniIcraatBaslik").value = "";
  document.getElementById("yeniIcraatIcerik").value = "";
  alert("İcraat başarıyla siteye eklendi!");
}

// OSINT Panel Web Simülasyonu
function calistirOsint() {
  const val = document.getElementById("osintInput").value.trim();
  const resEl = document.getElementById("osintResult");
  if (!val) {
    resEl.textContent = "Lütfen sorgulanacak bir değer girin.";
    resEl.className = "rk-result err";
    return;
  }
  resEl.innerHTML = `🔍 <strong>${val}</strong> için veriler taranıyor...<br>✅ Durum: Aktif ve Güvenli Sorgulama Tamamlandı.`;
  resEl.className = "rk-result ok";
}

async function loadUserRoles() {
  const userId = document.getElementById("alUserId").value.trim();
  const listEl = document.getElementById("alRoleList");
  if (!userId) {
    alert("Geçerli bir Discord ID gir.");
    return;
  }
  listEl.innerHTML = `<p>ID: ${userId} için roller sorgulanıyor...</p>`;
}
