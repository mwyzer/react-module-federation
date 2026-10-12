// Konfigurasi webpack dasar yang dipakai bersama oleh host & semua remote.
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

// Library yang di-share sebagai singleton supaya hanya ada SATU instance React
// di halaman, walaupun kode berasal dari beberapa aplikasi berbeda.
const shared = {
  react: { singleton: true, requiredVersion: deps.react },
  "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
  "react-router-dom": { singleton: true, requiredVersion: deps["react-router-dom"] },
};

module.exports = function createConfig({ dir, port, federation, publicPath = "auto" }) {
  return (_env, argv) => ({
    entry: path.join(dir, "src/index.js"),
    mode: argv.mode || "development",
    devtool: argv.mode === "production" ? false : "eval-cheap-module-source-map",
    output: {
      path: path.join(dir, "dist"),
      // Remote memakai "auto" agar chunk dimuat relatif terhadap URL remoteEntry.js.
      publicPath,
      clean: true,
    },
    resolve: { extensions: [".js", ".jsx"] },
    devServer: {
      port,
      historyApiFallback: true,
      headers: { "Access-Control-Allow-Origin": "*" },
      client: { overlay: { warnings: false } },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }]],
            },
          },
        },
        { test: /\.css$/, use: ["style-loader", "css-loader"] },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({ ...federation, shared }),
      new HtmlWebpackPlugin({ template: path.join(dir, "public/index.html") }),
    ],
  });
};
