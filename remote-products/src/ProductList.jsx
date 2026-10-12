import { useState } from "react";
import { Link } from "react-router-dom";
import { products, formatRupiah, addToCart } from "./data";
import "./products.css";

export default function ProductList({ basePath = "/products" }) {
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState(null);
  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  const handleAdd = (p) => {
    addToCart(p);
    setAdded(p.id);
    setTimeout(() => setAdded(null), 900);
  };

  return (
    <section className="mf-products">
      <span className="mf-products__tag">remote: products</span>
      <input
        className="mf-products__search"
        placeholder="Cari produk…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mf-products__grid">
        {filtered.map((p) => (
          <article key={p.id} className="mf-products__card">
            <Link to={`${basePath}/${p.id}`} className="mf-products__emoji">{p.emoji}</Link>
            <h3><Link to={`${basePath}/${p.id}`}>{p.name}</Link></h3>
            <p>{formatRupiah(p.price)}</p>
            <button onClick={() => handleAdd(p)} disabled={added === p.id}>
              {added === p.id ? "✓ Ditambahkan" : "+ Keranjang"}
            </button>
          </article>
        ))}
        {filtered.length === 0 && <p className="mf-products__empty">Produk tidak ditemukan.</p>}
      </div>
    </section>
  );
}
