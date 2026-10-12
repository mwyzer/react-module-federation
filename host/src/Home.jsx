import { lazy } from "react";
import { Link } from "react-router-dom";
import RemoteBoundary from "./RemoteBoundary";

const ProductList = lazy(() => import("products/ProductList"));
const Cart = lazy(() => import("cart/Cart"));

export default function Home() {
  return (
    <>
      <section className="hero">
        <span className="hero__tag">host / shell</span>
        <h1>Micro-frontend dengan Module Federation</h1>
        <p>
          Halaman ini adalah <b>host</b>. Kotak hijau berasal dari remote <b>products</b>, kotak merah muda dari
          remote <b>cart</b>. Masing-masing dibangun, dijalankan, dan bisa di-deploy terpisah — tetapi berbagi
          satu instance React.
        </p>
        <Link to="/products" className="hero__cta">Lihat produk →</Link>
      </section>

      <div className="home-grid">
        <RemoteBoundary name="products">
          <ProductList basePath="/products" />
        </RemoteBoundary>
        <RemoteBoundary name="cart">
          <Cart />
        </RemoteBoundary>
      </div>
    </>
  );
}
