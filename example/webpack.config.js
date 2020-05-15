const path = require("path");
const webpack = require("@stackup/webpack");

module.exports = webpack.pipeline([
  webpack.entry("./src/index.tsx"),
  webpack.output({ path: path.join(__dirname, "dist"), publicPath: "/" }),
  webpack.babel(),
  webpack.postcss(),
  webpack.svg(),
  webpack.files({ test: /\.png$/ }),
  webpack.html(),
  webpack.vendor(),
  webpack.minify(),
  webpack.gzip(),
  webpack.favicons({
    name: "My App",
    logo: "./src/images/example.png",
    backgroundColor: "#ffffff",
    themeColor: "#6c63ff",
  }),
  webpack.mode({
    development: webpack.merge({
      devServer: {
        port: 3000,
        contentBase: "./dist",
        historyApiFallback: {
          disableDotRule: true,
        },
      },
    }),
  }),
]);
