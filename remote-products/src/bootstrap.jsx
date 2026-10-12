import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ProductList from "./ProductList";

// Mode standalone untuk development remote secara terpisah.
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <div style={{ maxWidth: 960, margin: "40px auto", fontFamily: "system-ui", padding: "0 16px" }}>
      <p style={{ color: "#888" }}>Remote <b>products</b> berjalan standalone di :3001</p>
      <ProductList />
    </div>
  </BrowserRouter>
);
