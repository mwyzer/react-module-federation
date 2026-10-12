---
name: add-remote
description: Menambah remote micro-frontend baru ke proyek Module Federation ini (host + remote-*). Pakai saat user minta membuat remote, micro-app, atau micro-frontend baru, atau menyambungkan remote baru ke host.
argument-hint: <nama-remote> [port]
---

# Menambah remote baru

Argumen: `$ARGUMENTS` → `<nama>` (huruf kecil, tanpa spasi, mis. `wishlist`) dan `[port]` opsional.

Kalau `<nama>` tidak diberikan, tanyakan ke user. Kalau port tidak diberikan, pakai port berikutnya
setelah port tertinggi yang sudah ada di `*/webpack.config.js` (host 3000, products 3001, cart 3002, …).
Pastikan nama dan port belum dipakai remote lain.

Di bawah ini `<nama>` = nama remote, `<Nama>` = PascalCase, `<NAMA>` = UPPER_CASE, `<port>` = port.

## 1. Buat folder `remote-<nama>/`

Ikuti pola `remote-cart/` (pola paling sederhana). File yang wajib ada:

- `remote-<nama>/package.json`
  ```json
  {
    "name": "remote-<nama>",
    "private": true,
    "scripts": {
      "start": "webpack serve --mode development",
      "build": "webpack --mode production",
      "serve": "npx serve dist -l <port> --cors"
    }
  }
  ```
  Jangan menambah `dependencies` di sini — semua dependency ada di `package.json` root (npm workspaces).

- `remote-<nama>/webpack.config.js`
  ```js
  const createConfig = require("../shared.webpack");

  module.exports = createConfig({
    dir: __dirname,
    port: <port>,
    federation: {
      name: "<nama>",
      filename: "remoteEntry.js",
      exposes: {
        "./<Nama>": "./src/<Nama>.jsx",
      },
    },
  });
  ```
  Jangan set `publicPath` — remote harus memakai default `"auto"` dari `shared.webpack.js`.
  `federation.name` wajib identifier JS yang valid (tanpa tanda hubung).

- `remote-<nama>/public/index.html` — salin dari `remote-cart/public/index.html`, ganti `<title>` menjadi `Remote: <Nama>`.

- `remote-<nama>/src/index.js` — **hanya** berisi `import("./bootstrap");` (async boundary; tanpa ini shared singleton gagal dengan error "Shared module is not available for eager consumption").

- `remote-<nama>/src/bootstrap.jsx` — render komponen yang di-expose secara standalone, dengan catatan
  `Remote <b><nama></b> berjalan standalone di :<port>`. Bungkus dengan `<BrowserRouter>` jika komponennya memakai `react-router-dom`.

- `remote-<nama>/src/<Nama>.jsx` + `remote-<nama>/src/<nama>.css`
  Ikuti konvensi visual yang ada: kontainer dengan border dashed berwarna unik dan label
  `remote: <nama>` di pojok kiri atas (lihat `.mf-cart__tag` / `.mf-products__tag`).
  Beri prefix class `mf-<nama>__` agar CSS tidak bentrok dengan remote lain.
  Pilih warna yang belum dipakai (biru = host, hijau = products, pink = cart).

## 2. Daftarkan di root `package.json`

- Tambah `"remote-<nama>"` ke array `workspaces`.
- Tambah ke script `start` (concurrently): nama di `-n`, warna di `-c`, dan `\"npm:start -w remote-<nama>\"`.
- Tambah `-w remote-<nama>` ke script `build` **sebelum** `-w host`.

## 3. Sambungkan ke host

Di `host/webpack.config.js`:
```js
const <NAMA>_URL = process.env.<NAMA>_URL || "http://localhost:<port>";
// ...
remotes: {
  // ...remote yang sudah ada
  <nama>: `<nama>@${<NAMA>_URL}/remoteEntry.js`,
},
```

Di host, muat komponen **selalu** lewat `React.lazy` dan bungkus dengan `RemoteBoundary`:
```jsx
const <Nama> = lazy(() => import("<nama>/<Nama>"));
// ...
<RemoteBoundary name="<nama>">
  <<Nama> />
</RemoteBoundary>
```
Jika remote butuh halaman sendiri, tambahkan `<Route>` di `host/src/App.jsx` (pakai komponen `Layout`)
dan `<NavLink>` di header.

## 4. Aturan komunikasi

- Remote **tidak boleh** meng-import modul dari remote lain secara langsung.
- Untuk mengirim aksi ke remote lain, pakai `window.dispatchEvent(new CustomEvent("mf:<aksi>", { detail }))`
  seperti `addToCart` di `remote-products/src/data.js`.
- Kalau host perlu state dari remote ini, expose modul store/komponen kecil (seperti `cart/CartBadge`).

## 5. Update README

Tambahkan remote baru ke diagram, tabel Struktur, dan contoh env var di bagian "Build production" di `README.md`.

## 6. Verifikasi

1. Jalankan `npm install` (agar workspace baru ter-link).
2. Jalankan `npm run build` — semua app harus `compiled successfully`.
3. Kalau browser tersedia: jalankan `npm start`, buka `http://localhost:3000`, pastikan komponen remote
   tampil di host, lalu buka `http://localhost:<port>` untuk mode standalone.
   Restart dev server setiap kali file `webpack.config.js` berubah.

Laporkan ke user: nama & port remote, modul yang di-expose, di mana dipakai di host, dan hasil build.
