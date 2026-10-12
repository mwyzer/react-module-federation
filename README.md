# React Module Federation — MF Shop

Contoh micro-frontend React 18 dengan **Webpack 5 Module Federation**: satu aplikasi **host** yang memuat komponen dari dua aplikasi **remote** saat runtime.

```
┌──────────────────────── host :3000 (shell, routing, layout) ────────────────────────┐
│                                                                                     │
│   import("products/ProductList")            import("cart/Cart"), ("cart/CartBadge") │
│              │                                          │                           │
└──────────────┼──────────────────────────────────────────┼───────────────────────────┘
               ▼                                          ▼
   remote-products :3001                         remote-cart :3002
   expose: ProductList, ProductDetail            expose: Cart, CartBadge, cartStore
               │                                          ▲
               └──── window CustomEvent "mf:add-to-cart" ─┘
```

## Menjalankan

```bash
npm install
npm start
```

Buka http://localhost:3000. Tiap remote juga bisa dibuka sendiri (mode standalone) di :3001 dan :3002.

## Struktur

| Folder | Peran |
| --- | --- |
| `shared.webpack.js` | Config webpack bersama + daftar `shared` singleton (react, react-dom, react-router-dom) |
| `host/` | Shell: header, routing, `RemoteBoundary` (Suspense + ErrorBoundary) |
| `remote-products/` | Katalog & detail produk |
| `remote-cart/` | Keranjang, badge jumlah item, dan store (`useSyncExternalStore` + localStorage) |
| `.claude/skills/add-remote/` | Skill Claude Code untuk menambah remote baru (lihat [Claude Code Skill](#claude-code-skill-skillmd)) |

## Konsep yang didemonstrasikan

- **Async boundary** — `index.js` hanya berisi `import("./bootstrap")` agar shared dependency sempat dinegosiasikan.
- **Shared singleton** — hanya satu instance React/Router di halaman.
- **Lazy remote + fallback** — `React.lazy(() => import("cart/Cart"))` dibungkus `RemoteBoundary`; matikan salah satu remote dan host tetap jalan dengan pesan error lokal.
- **Komunikasi antar-remote** — products mengirim `CustomEvent`, cart mendengarkan. Tidak ada import langsung antar-remote, jadi tim bisa deploy terpisah.
- **State bersama via expose** — host memakai `cart/CartBadge` yang membaca store yang sama dengan `cart/Cart`.

## Build production

```bash
PRODUCTS_URL=https://products.example.com CART_URL=https://cart.example.com npm run build
```

Hasil ada di `*/dist`. Deploy tiap folder `dist` ke host statis masing-masing (remote wajib mengizinkan CORS untuk `remoteEntry.js`).

## Claude Code Skill (`SKILL.md`)

Repo ini menyertakan satu *project skill* untuk [Claude Code](https://claude.com/claude-code):
[`.claude/skills/add-remote/SKILL.md`](.claude/skills/add-remote/SKILL.md).

### Apa itu skill?

Skill adalah paket instruksi yang bisa dipakai ulang oleh Claude, mirip **reusable component** di React:

| React component | Claude Code skill |
| --- | --- |
| Ditulis sekali, dipakai di banyak halaman | Ditulis sekali, dipakai di banyak sesi |
| Dipanggil dengan nama: `<Cart />` | Dipanggil dengan nama: `/add-remote` |
| Menerima `props` | Menerima argumen: `/add-remote wishlist 3003` |
| `React.lazy()` memuat kode saat dibutuhkan | Isi skill baru dimuat saat relevan; sebelumnya Claude hanya melihat `description` |

Bedanya, komponen berisi **kode** yang dijalankan browser, sedangkan skill berisi **instruksi bahasa alami**
(SOP) yang dibaca dan diikuti Claude. Hasilnya adalah cara kerja yang konsisten, bukan UI.

### Struktur `SKILL.md`

```markdown
---
name: add-remote                 # nama perintah → /add-remote
description: Menambah remote ... # dipakai Claude untuk memutuskan kapan skill relevan
argument-hint: <nama-remote> [port]
---

# Isi instruksi (Markdown)
Argumen tersedia sebagai $ARGUMENTS.
1. Langkah pertama ...
2. Langkah kedua ...
```

- **Frontmatter** (`name`, `description`, `argument-hint`) selalu terbaca oleh Claude, jadi buat `description`
  yang spesifik tentang *kapan* skill harus dipakai.
- **Body** hanya dimuat saat skill dipanggil, jadi boleh panjang dan detail.
- Lokasi `.claude/skills/<nama>/SKILL.md` membuat skill berlaku untuk proyek ini saja dan ikut ter-commit ke git,
  sehingga seluruh tim mendapat skill yang sama. Skill pribadi untuk semua proyek disimpan di `~/.claude/skills/`.

### Skill `add-remote`

Menambah micro-frontend baru dengan pola yang sama seperti remote yang sudah ada:

1. Membuat `remote-<nama>/` (config webpack, async boundary, mode standalone, CSS berprefix `mf-<nama>__`).
2. Mendaftarkannya di `package.json` root (workspaces, script `start` & `build`).
3. Menyambungkannya ke host lewat `remotes` + env var `<NAMA>_URL`, dipakai dengan `React.lazy` + `RemoteBoundary`.
4. Menjaga aturan komunikasi: remote tidak saling import, aksi dikirim lewat `CustomEvent`.
5. Memperbarui README ini.
6. Verifikasi dengan `npm run build` dan cek di browser.

Cara pakai — buka folder repo di Claude Code, lalu:

```
/add-remote wishlist 3003
```

atau cukup minta, misalnya "buatkan remote baru untuk wishlist"; Claude akan memakai skill ini secara otomatis.

### Membuat skill sendiri

1. Buat folder `.claude/skills/<nama-skill>/`.
2. Tulis `SKILL.md` dengan frontmatter `name` dan `description`, lalu langkah-langkahnya.
3. (Opsional) Tambahkan file pendukung di folder yang sama, mis. template atau script, dan rujuk dari `SKILL.md`.
4. Mulai sesi Claude Code baru agar skill terbaca.
