document.addEventListener("DOMContentLoaded", async () => {
    // 1. Verileri GitHub'dan Çek ve Ekrana Bas
    try {
        let response = await fetch('content.json');
        let data = await response.json();

        // Yönetim Ekibini Göster
        let yonetimContainer = document.getElementById('yonetim-alani');
        if (yonetimContainer && data.yonetim) {
            yonetimContainer.innerHTML = data.yonetim.map(y => `
                <div class="kart">
                    <img src="${y.avatar || 'default.png'}" alt="Avatar" width="50" style="border-radius:50%;">
                    <div>
                        <h3>${y.isim}</h3>
                        <p>${y.rol}</p>
                    </div>
                </div>
            `).join('');
        }

        // Üyeleri Göster
        let uyeContainer = document.getElementById('uye-alani');
        if (uyeContainer && data.uyeler) {
            uyeContainer.innerHTML = data.uyeler.map(u => `
                <div class="kart">
                    <img src="${u.avatar || 'default.png'}" alt="Avatar" width="40" style="border-radius:50%;">
                    <span>${u.isim} (${u.rol})</span>
                </div>
            `).join('');
        }

        // Projeleri Göster
        let projeContainer = document.getElementById('proje-alani');
        if (projeContainer && data.projeler) {
            projeContainer.innerHTML = data.projeler.map(p => `
                <div class="kart proje-karti">
                    <img src="${p.gorsel}" alt="Proje" width="100%">
                    <h3>${p.isim}</h3>
                    <p>${p.tanitim}</p>
                    <small>Amaç: ${p.amac}</small>
                </div>
            `).join('');
        }

    } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
    }

    // 2. Sitedeki Tuşların Çalışması (Tıklama Olayları)
    const bilgiKutusu = document.getElementById('bilgi-kutusu');

    const btnDuyuru = document.getElementById('btn-duyuru');
    if (btnDuyuru) {
        btnDuyuru.addEventListener('click', () => {
            bilgiKutusu.innerText = "📢 En güncel duyurular için Discord sunucumuzu takip edin!";
            bilgiKutusu.classList.remove('gizli');
        });
    }

    const btnKurallar = document.getElementById('btn-kurallar');
    if (btnKurallar) {
        btnKurallar.addEventListener('click', () => {
            bilgiKutusu.innerText = "📜 Kurallar: 1. Saygı esastır. 2. Din/Siyaset yasaktır.";
            bilgiKutusu.classList.remove('gizli');
        });
    }

    const btnIletisim = document.getElementById('btn-iletisim');
    if (btnIletisim) {
        btnIletisim.addEventListener('click', () => {
            bilgiKutusu.innerText = "📞 İletişim için HÜKÜM Studio Discord sunucusuna gelebilirsiniz.";
            bilgiKutusu.classList.remove('gizli');
        });
    }
});
