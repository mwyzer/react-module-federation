const createConfig = require("../shared.webpack");

module.exports = createConfig({
  dir: __dirname,
  port: 3001,
  federation: {
    name: "products",
    filename: "remoteEntry.js",
    exposes: {
      "./ProductList": "./src/ProductList.jsx",
      "./ProductDetail": "./src/ProductDetail.jsx",
    },
  },
});
