export const products = [
  { id: "p1", name: "Kopi Arabika Gayo", price: 85000, emoji: "☕", desc: "Biji kopi arabika single origin dari dataran tinggi Gayo, Aceh." },
  { id: "p2", name: "Teh Hijau Puncak", price: 42000, emoji: "🍵", desc: "Daun teh hijau pilihan dari perkebunan Puncak, Bogor." },
  { id: "p3", name: "Cokelat Bali 70%", price: 65000, emoji: "🍫", desc: "Dark chocolate dari kakao fermentasi Jembrana, Bali." },
  { id: "p4", name: "Madu Hutan Sumbawa", price: 120000, emoji: "🍯", desc: "Madu liar murni dari hutan Sumbawa, NTB." },
  { id: "p5", name: "Keripik Tempe Malang", price: 25000, emoji: "🥠", desc: "Keripik tempe renyah khas Malang, Jawa Timur." },
  { id: "p6", name: "Sambal Roa Manado", price: 55000, emoji: "🌶️", desc: "Sambal ikan roa asap khas Manado yang pedas gurih." },
];

export const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

// Remote ini TIDAK meng-import store dari remote cart. Ia hanya mengirim event,
// sehingga kedua tim bisa deploy secara independen.
export function addToCart(product) {
  const { id, name, price } = product;
  window.dispatchEvent(new CustomEvent("mf:add-to-cart", { detail: { id, name, price } }));
}
