import { Link, useParams } from "react-router-dom";
import { products, formatRupiah, addToCart } from "./data";
import "./products.css";

export default function ProductDetail({ basePath = "/products" }) {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <section className="mf-products">
        <span className="mf-products__tag">remote: products</span>
        <p>Produk tidak ditemukan. <Link to={basePath}>Kembali</Link></p>
      </section>
    );
  }

  return (
    <section className="mf-products mf-products__detail">
      <span className="mf-products__tag">remote: products</span>
      <div className="mf-products__detail-emoji">{product.emoji}</div>
      <div>
        <h2>{product.name}</h2>
        <p className="mf-products__price">{formatRupiah(product.price)}</p>
        <p>{product.desc}</p>
        <button onClick={() => addToCart(product)}>+ Tambah ke keranjang</button>
        <p><Link to={basePath}>← Kembali ke daftar produk</Link></p>
      </div>
    </section>
  );
}
