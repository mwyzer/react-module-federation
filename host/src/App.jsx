import { lazy } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import RemoteBoundary from "./RemoteBoundary";
import Home from "./Home";

// Komponen-komponen ini TIDAK ada di bundle host — diunduh saat runtime
// dari remoteEntry.js milik masing-masing aplikasi.
const ProductList = lazy(() => import("products/ProductList"));
const ProductDetail = lazy(() => import("products/ProductDetail"));
const Cart = lazy(() => import("cart/Cart"));
const CartBadge = lazy(() => import("cart/CartBadge"));

export default function App() {
  return (
    <div className="shell">
      <header className="shell__header">
        <NavLink to="/" className="shell__brand">🛍️ MF Shop</NavLink>
        <nav className="shell__nav">
          <NavLink to="/" end>Beranda</NavLink>
          <NavLink to="/products">Produk</NavLink>
          <NavLink to="/cart">
            Keranjang
            <RemoteBoundary name="cart" fallback={<span>…</span>}>
              <CartBadge />
            </RemoteBoundary>
          </NavLink>
        </nav>
      </header>

      <main className="shell__main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={
              <Layout title="Daftar Produk">
                <RemoteBoundary name="products">
                  <ProductList basePath="/products" />
                </RemoteBoundary>
              </Layout>
            }
          />
          <Route
            path="/products/:id"
            element={
              <Layout title="Detail Produk">
                <RemoteBoundary name="products">
                  <ProductDetail basePath="/products" />
                </RemoteBoundary>
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout title="Keranjang Belanja">
                <RemoteBoundary name="cart">
                  <Cart />
                </RemoteBoundary>
              </Layout>
            }
          />
          <Route path="*" element={<Layout title="404">Halaman tidak ditemukan.</Layout>} />
        </Routes>
      </main>

      <footer className="shell__footer">
        Host :3000 · products :3001 · cart :3002 — Webpack 5 Module Federation
      </footer>
    </div>
  );
}

function Layout({ title, children }) {
  return (
    <>
      <h1 className="shell__title">{title}</h1>
      {children}
    </>
  );
}
