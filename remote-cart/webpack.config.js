const createConfig = require("../shared.webpack");

module.exports = createConfig({
  dir: __dirname,
  port: 3002,
  federation: {
    name: "cart",
    filename: "remoteEntry.js",
    exposes: {
      "./Cart": "./src/Cart.jsx",
      "./CartBadge": "./src/CartBadge.jsx",
      "./cartStore": "./src/cartStore.js",
    },
  },
});
