const createConfig = require("../shared.webpack");

// URL remote bisa di-override saat build untuk production, mis:
//   PRODUCTS_URL=https://products.example.com npm run build -w host
const PRODUCTS_URL = process.env.PRODUCTS_URL || "http://localhost:3001";
const CART_URL = process.env.CART_URL || "http://localhost:3002";

module.exports = createConfig({
  dir: __dirname,
  port: 3000,
  // Host memakai path absolut supaya nested route (mis. /products/p1) tetap memuat bundle dengan benar.
  publicPath: "/",
  federation: {
    name: "host",
    remotes: {
      products: `products@${PRODUCTS_URL}/remoteEntry.js`,
      cart: `cart@${CART_URL}/remoteEntry.js`,
    },
  },
});
