import { createRoot } from "react-dom/client";
import Cart from "./Cart";
import { cartStore } from "./cartStore";
import "./cart.css";

// Mode standalone: remote bisa dikembangkan & dites tanpa host.
cartStore.add({ id: "demo", name: "Produk Demo", price: 50000 });

createRoot(document.getElementById("root")).render(
  <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "system-ui" }}>
    <p style={{ color: "#888" }}>Remote <b>cart</b> berjalan standalone di :3002</p>
    <Cart />
  </div>
);
