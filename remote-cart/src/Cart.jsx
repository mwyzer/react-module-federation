import { cartStore, useCart, formatRupiah } from "./cartStore";
import "./cart.css";

export default function Cart() {
  const { items, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mf-cart mf-cart--empty">
        <span className="mf-cart__tag">remote: cart</span>
        <p>Keranjang masih kosong.</p>
      </div>
    );
  }

  return (
    <div className="mf-cart">
      <span className="mf-cart__tag">remote: cart</span>
      <ul className="mf-cart__list">
        {items.map((item) => (
          <li key={item.id} className="mf-cart__item">
            <div>
              <strong>{item.name}</strong>
              <small>{formatRupiah(item.price)}</small>
            </div>
            <div className="mf-cart__qty">
              <button onClick={() => cartStore.decrement(item.id)} aria-label="Kurangi">−</button>
              <span>{item.qty}</span>
              <button onClick={() => cartStore.add(item)} aria-label="Tambah">+</button>
              <button className="mf-cart__remove" onClick={() => cartStore.remove(item.id)}>Hapus</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mf-cart__footer">
        <span>Total</span>
        <strong>{formatRupiah(total)}</strong>
      </div>
      <button className="mf-cart__clear" onClick={cartStore.clear}>Kosongkan keranjang</button>
    </div>
  );
}
