document.addEventListener("DOMContentLoaded", async () => {
    try {
        let response = await fetch('content.json');
        let data = await response.json();

        // Yönetim Ekibini Sitede Göster
        let yonetimContainer = document.querySelector('.yonetim-listesi, #yonetim-alani');
        if (yonetimContainer && data.yonetim) {
            yonetimContainer.innerHTML = data.yonetim.map(y => `
                <div class="yonetim-kart">
                    <img src="${y.avatar || 'default.png'}" alt="Avatar">
                    <div>
                        <h3>${y.isim}</h3>
                        <p>${y.rol}</p>
                    </div>
                </div>
            `).join('');
        }

        // Üyeleri Sitede Göster
        let uyeContainer = document.querySelector('.uye-listesi, #uye-alani');
        if (uyeContainer && data.uyeler) {
            uyeContainer.innerHTML = data.uyeler.map(u => `
                <div class="uye-kart">
                    <img src="${u.avatar || 'default.png'}" alt="Avatar">
                    <span>${u.isim} (${u.rol})</span>
                </div>
            `).join('');
        }

        // Projeleri Sitede Göster
        let projeContainer = document.querySelector('.proje-listesi, #proje-alani');
        if (projeContainer && data.projeler) {
            projeContainer.innerHTML = data.projeler.map(p => `
                <div class="proje-kart">
                    <img src="${p.gorsel}" alt="Proje Görseli">
                    <h3>${p.isim}</h3>
                    <p>${p.tanitim}</p>
                    <small>Amaç: ${p.amac}</small>
                </div>
            `).join('');
        }

    } catch (error) {
        console.error("Veriler yüklenirken hata oluştu:", error);
    }
});
