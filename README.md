<h1 align="center">@stackup/webpack</h1>

<div align="center">

![Build](https://github.com/rzane/webpack/workflows/Build/badge.svg)
![Version](https://img.shields.io/npm/v/@stackup/webpack)
![License](https://img.shields.io/npm/l/@stackup/webpack)

</div>

Functions that you can compose to build the perfect Webpack configuration. These functions bake in best practices, so you can stop copy-pasting them from the internet!

## Install

    $ yarn add @stackup/webpack --dev

## Usage

```javascript
const pkg = require("./package.json");
const path = require("path");
const webpack = require("@stackup/webpack");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = webpack.pipeline([
  // Set your entrypoint
  webpack.entry("./src/index.tsx"),

  // Output to `dist/`
  webpack.output({
    path: path.join(__dirname, "dist"),
    publicPath: "/",
  }),

  // Build JavaScript with babel
  webpack.babel(),

  // Compile CSS with PostCSS
  webpack.postcss(),

  // Load SVG and PNG files as plain ol' files.
  webpack.files({ test: /\.(svg|png)$/ }),

  // Build an HTML file and bake in all of the necessary references.
  webpack.html(),

  // Create a vendor chunk to optimize your bundle!
  webpack.vendor(),

  // Minify JavaScript and CSS in production
  webpack.minify(),

  // Enable GZIP compression
  webpack.gzip(),

  // Merge in environment-specific configuration
  webpack.mode({
    development: webpack.merge({
      devServer: {
        contentBase: "./dist",
        port: pkg.devServer.port,
        historyApiFallback: {
          disableDotRule: true,
        },
      },
    }),
  }),
]);
```
