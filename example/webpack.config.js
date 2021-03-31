const path = require("path");
const webpack = require("@stackup/webpack");

module.exports = webpack.pipeline([
  // Set your entrypoint
  webpack.entry("./src/index.tsx"),

  // Output to `dist/`
  webpack.output({
    path: path.join(__dirname, "dist"),
    publicPath: "/",
  }),

  // Build JavaScript/Typescript with Babel
  webpack.babel(),

  // Compile CSS with PostCSS
  webpack.postcss(),

  // Allow importing SVG files as React components
  webpack.svg(),

  // Load JPG and PNG as plain ol' files
  webpack.files({ test: /\.(jpg|png)$/ }),

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
        port: 3000,
        contentBase: "./dist",
        historyApiFallback: {
          disableDotRule: true,
        },
      },
    }),
  }),
]);
