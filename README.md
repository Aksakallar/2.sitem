# 🚀 Personal Portfolio Website

Modern ve interaktif bir kişisel portfolio web sitesi. React, Framer Motion ve Styled Components kullanılarak geliştirilmiş, profesyonel bir tasarıma sahip tek sayfalık bir uygulama.

![React](https://img.shields.io/badge/React-17.0.2-blue)
![Styled Components](https://img.shields.io/badge/Styled_Components-5.3.0-pink)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-4.1.17-purple)
![React Router](https://img.shields.io/badge/React_Router-5.2.0-red)

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Proje Yapısı](#proje-yapısı)
- [Sayfalar](#sayfalar)
- [Deployment](#deployment)

## ✨ Özellikler

- 🎨 **Modern ve Şık Tasarım**: Styled Components ile özelleştirilebilir tema yapısı
- 🌊 **Akıcı Animasyonlar**: Framer Motion ile profesyonel geçiş efektleri
- 📱 **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- ⚡ **Hızlı ve Performanslı**: React'ın bileşen tabanlı mimarisi
- 🎯 **Parçacık Efektleri**: TSParticles ile etkileşimli arka plan
- 🎭 **Karanlık Tema Desteği**: Göz yormayan arayüz
- 🔄 **SPA (Single Page Application)**: Sayfa yenilenmeden gezinme

## 🛠️ Teknolojiler

### Ana Teknolojiler
- **React** (17.0.2) - UI geliştirme
- **React Router DOM** (5.2.0) - Sayfa yönlendirme
- **Styled Components** (5.3.0) - CSS-in-JS styling
- **Framer Motion** (4.1.17) - Animasyon ve geçişler

### Ek Kütüphaneler
- **React TSParticles** (1.37.1) - Parçacık animasyonları
- **Normalize.css** (8.0.1) - CSS normalizasyonu
- **Cross-env** (7.0.3) - Ortam değişkenleri yönetimi

## 📦 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/Aksakallar/2.sitem.git
cd 2.sitem
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm start
```

4. Tarayıcınızda `http://localhost:3000` adresine gidin.

## 🚀 Kullanım

### Geliştirme Modu
```bash
npm start
```
Geliştirme sunucusunu başlatır. Değişiklikler otomatik olarak yüklenir.

### Production Build
```bash
npm run build
```
Optimize edilmiş production build'i `build/` klasörüne oluşturur.

### Test
```bash
npm test
```
Test süitini interaktif watch modunda çalıştırır.

## 📁 Proje Yapısı

```
2.sitem/
├── public/              # Statik dosyalar
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/      # Ana bileşenler
│   │   ├── Main.js           # Ana sayfa
│   │   ├── AboutPage.js      # Hakkımda sayfası
│   │   ├── BlogPage.js       # Blog listesi
│   │   ├── BlogDetail.js     # Blog detay sayfası
│   │   ├── WorkPage.js       # Projeler sayfası
│   │   ├── MySkillsPage.js   # Yetenekler sayfası
│   │   ├── Themes.js         # Tema konfigürasyonları
│   │   └── AllSvgs.js        # SVG ikonlar
│   ├── subComponents/   # Alt bileşenler
│   │   ├── LogoComponent.js  # Logo
│   │   ├── PowerButton.js    # Güç butonu (Home)
│   │   ├── SocialIcons.js    # Sosyal medya ikonları
│   │   ├── Sesbar.js         # Ses kontrolü
│   │   ├── Card.js           # Proje kartları
│   │   └── AnaTitle.js       # Başlık bileşeni
│   ├── data/            # Veri dosyaları
│   │   ├── BlogData.js       # Blog verileri
│   │   └── WorkData.js       # Proje verileri
│   ├── config/          # Konfigürasyon dosyaları
│   │   ├── particlesjs-config.json
│   │   └── particlesjs-config-light.json
│   ├── assets/          # Medya dosyaları
│   │   ├── Images/
│   │   └── audio/
│   ├── App.js           # Ana uygulama bileşeni
│   ├── GlobalStyles.js  # Global stiller
│   └── index.js         # Giriş noktası
├── build/               # Production build
├── package.json
└── README.md
```

## 📄 Sayfalar

### 🏠 Ana Sayfa (Main)
- Hoş geldiniz ekranı
- Parçacık animasyonları
- Navigasyon linkleri
- Profil gösterimi

### 👤 Hakkımda (About)
- Kişisel bilgiler
- Kariyer yolculuğu
- Hedefler ve vizyoner
- Uzay temalı animasyonlar

### 📝 Blog
- Blog yazıları listesi
- Kategoriye göre filtreleme
- Detaylı blog görüntüleme
- React, SASS, UI Design konularında içerikler

### 💼 Projeler (Work)
- Gerçekleştirilen projeler
- Proje kartları
- Demo ve GitHub linkleri
- Teknoloji etiketleri

### 🎯 Yetenekler (Skills)
- Teknik yetenekler
- Kullanılan teknolojiler
- Yetkinlik seviyeleri

## 🎨 Özelleştirme

### Tema Değiştirme
`src/components/Themes.js` dosyasında tema renklerini özelleştirebilirsiniz:

```javascript
export const lightTheme = {
  body: "#FCF6F4",
  text: "#000000",
  fontFamily: "'Source Sans Pro', sans-serif",
  // ... diğer tema değişkenleri
}
```

### İçerik Güncelleme

**Blog Eklemek:**
`src/data/BlogData.js` dosyasına yeni blog nesnesi ekleyin:

```javascript
{
  id: 2,
  name: "Yeni Blog Başlığı",
  tags: ["react", "javascript"],
  date: "Aralık 6, 2025",
  imgSrc: "resim-url",
  link: "",
  description: `İçerik...`
}
```

**Proje Eklemek:**
`src/data/WorkData.js` dosyasına yeni proje ekleyin:

```javascript
{
  id: 2,
  name: "Proje Adı",
  description: "Açıklama",
  tags: ["react", "node"],
  demo: "demo-url",
  github: "github-url"
}
```

## 🔍 SEO Kontrol Çizelgesi

### Temel SEO Ayarları

| Özellik | Durum | Dosya |
|---------|-------|-------|
| Dil etiketi (lang="tr") | ✅ | `public/index.html` |
| Meta Description | ✅ | `public/index.html` |
| Meta Keywords | ✅ | `public/index.html` |
| Meta Author | ✅ | `public/index.html` |
| Meta Robots | ✅ | `public/index.html` |
| Canonical URL | ✅ | `public/index.html` |
| Viewport | ✅ | `public/index.html` |
| Title | ✅ | `public/index.html` |

### Open Graph (Facebook/LinkedIn)

| Özellik | Durum | Değer |
|---------|-------|-------|
| og:type | ✅ | website |
| og:url | ✅ | https://mehmetasker.com/ |
| og:title | ✅ | Mehmet Asker \| Kişisel Gelişim, Yaşam Koçluğu & Yazılım |
| og:description | ✅ | Tamamlandı |
| og:image | ⚠️ | `og-image.jpg` oluşturulmalı (1200x630 px) |
| og:locale | ✅ | tr_TR |
| og:site_name | ✅ | Mehmet Asker |

### Twitter Card

| Özellik | Durum | Değer |
|---------|-------|-------|
| twitter:card | ✅ | summary_large_image |
| twitter:url | ✅ | https://mehmetasker.com/ |
| twitter:title | ✅ | Tamamlandı |
| twitter:description | ✅ | Tamamlandı |
| twitter:image | ⚠️ | `og-image.jpg` oluşturulmalı (1200x630 px) |

### Structured Data (JSON-LD)

| Özellik | Durum | Değer |
|---------|-------|-------|
| @type | ✅ | Person |
| name | ✅ | Mehmet Asker |
| url | ✅ | https://mehmetasker.com |
| jobTitle | ✅ | Yaşam Koçu, Yazar, Yazılım Geliştirici |
| knowsAbout | ✅ | 9 alan tanımlı |
| sameAs | ✅ | Facebook, X (Twitter), Instagram |

### SEO Dosyaları

| Dosya | Durum | Açıklama |
|-------|-------|----------|
| `robots.txt` | ✅ | Sitemap referansı ve crawl-delay mevcut |
| `sitemap.xml` | ✅ | 5 sayfa tanımlı |
| `manifest.json` | ✅ | PWA ayarları, Türkçe |
| `og-image.jpg` | ❌ | 1200x630 px oluşturulmalı |

### Yayın Öncesi Yapılacaklar

- [ ] `og-image.jpg` dosyası oluştur (1200x630 px) ve `public/` klasörüne ekle
- [ ] Google Search Console'a siteyi ekle
- [ ] Sitemap.xml'i Google Search Console'a gönder
- [x] JSON-LD `sameAs` alanına sosyal medya linklerini ekle
- [ ] PageSpeed Insights ile performans testi yap
- [ ] Rich Results Test ile structured data doğrula

---

## 🌐 Deployment

### Netlify ile Deploy
Bu proje Netlify'da deploy edilmek üzere yapılandırılmıştır:

1. `build/` klasörünü deploy edin
2. `_redirects` dosyası SPA yönlendirmelerini yönetir

### Build Komutu
```bash
npm run build
```

### Yayın Dizini
```
build/
```

## 🔧 Sorun Giderme

### OpenSSL Hatası
Proje, eski Node.js sürümleriyle uyumluluk için `cross-env NODE_OPTIONS=--openssl-legacy-provider` kullanır.

### Port Zaten Kullanımda
Farklı bir port kullanmak için:
```bash
PORT=3001 npm start
```

## 📝 Lisans

Bu proje kişisel kullanım içindir.

## 👨‍💻 Geliştirici

**Aksakallar**
- GitHub: [@Aksakallar](https://github.com/Aksakallar)
- Repository: [2.sitem](https://github.com/Aksakallar/2.sitem)

## 🙏 Teşekkürler

Bu proje, modern web geliştirme teknolojilerini kullanarak oluşturulmuş bir portfolio sitesidir. React ekosistemi ve açık kaynak topluluğuna teşekkürler.

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
