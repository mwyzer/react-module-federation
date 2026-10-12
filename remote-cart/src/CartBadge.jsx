import { useCart } from "./cartStore";

export default function CartBadge() {
  const { count } = useCart();
  return (
    <span
      style={{
        display: "inline-grid",
        placeItems: "center",
        minWidth: 20,
        height: 20,
        padding: "0 6px",
        borderRadius: 10,
        background: count ? "#e11d48" : "#94a3b8",
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {count}
    </span>
  );
}
