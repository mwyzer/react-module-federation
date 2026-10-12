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
