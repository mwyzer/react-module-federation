// Store keranjang sederhana tanpa library eksternal.
// Karena modul ini di-expose lewat Module Federation, host dan remote lain
// mendapat instance yang SAMA (dimuat dari container "cart" yang sama).
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "mf-cart";
const listeners = new Set();

let items = [];
try {
  items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
} catch {
  items = [];
}

function emit() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
  listeners.forEach((l) => l());
}

export const cartStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return items;
  },
  add(product) {
    const found = items.find((i) => i.id === product.id);
    items = found
      ? items.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      : [...items, { ...product, qty: 1 }];
    emit();
  },
  decrement(id) {
    items = items
      .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
      .filter((i) => i.qty > 0);
    emit();
  },
  remove(id) {
    items = items.filter((i) => i.id !== id);
    emit();
  },
  clear() {
    items = [];
    emit();
  },
};

// Komunikasi lintas micro-frontend yang loosely-coupled:
// remote lain cukup dispatch CustomEvent tanpa perlu import store ini.
if (typeof window !== "undefined" && !window.__mfCartListener) {
  window.__mfCartListener = true;
  window.addEventListener("mf:add-to-cart", (e) => cartStore.add(e.detail));
}

export function useCart() {
  const list = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot);
  const count = list.reduce((n, i) => n + i.qty, 0);
  const total = list.reduce((n, i) => n + i.qty * i.price, 0);
  return { items: list, count, total };
}

export const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
