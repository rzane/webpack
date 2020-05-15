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

  // Load SVG and PNG files as plain ol' files.
  webpack.files({ test: /\.(jpg|png)$/ }),

  // Build an HTML file and bake in all of the necessary references.
  webpack.html(),

  // Create a vendor chunk to optimize your bundle!
  webpack.vendor(),

  // Minify JavaScript and CSS in production
  webpack.minify(),

  // Enable GZIP compression
  webpack.gzip(),

  // Generate favicons and a web app manifest.json
  webpack.favicons({
    name: "My App",
    logo: "src/assets/logo.png",
    backgroundColor: "#ffffff",
    themeColor: "#6c63ff",
  }),

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
```

## Babel

To compile modern JavaScript, you'll first need to install Babel:

    $ yarn add @babel/core @babel/preset-env core-js --dev

Next, you'll need to create a `.babelrc.js` file:

```javascript
module.exports = (api) => {
  const env = {
    /**
     * Import polyfills from core-js v3 as needed
     */
    useBuiltIns: "entry",
    corejs: { versions: 3 },

    /**
     * Setting `modules: false` enables ES modules, which is required
     * for tree-shaking. However, Jest doesn't support ES modules.
     *
     * NOTE: The environment check must happen before enabling caching.
     */
    modules: api.env("test") ? "commonjs" : false,
  };

  /**
   * Enable caching
   */
  api.cache(true);

  /**
   * Return our configuration
   */
  return {
    presets: [["@babel/preset-env", env]],
  };
};
```

## TypeScript

To build TypeScript applications, follow the instructions in the Babel section.

You'll also need to install the Babel preset for TypeScript:

    $ yarn add @babel/preset-typescript --dev

Then, add the preset to your Babel configuration:

```diff
- presets: [["@babel/preset-env", env]],
+ presets: [["@babel/preset-env", env], "@babel/preset-typescript"],
```

Finally, create a `tsconfig.json` file:

```json
{
  "include": ["src", "types"],
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "esnext"],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

The `target`, `module`, `moduleResolution`, and `jsx` are especially important.
Those settings above instruct TypeScript to let Babel do the heavy lifting.

## React

To build React applications, follow the instructions in the Babel section.

You'll also need to install the Babel preset for React:

    $ yarn add @babel/preset-react --dev

Then, add the preset to your Babel configuration:

```diff
- presets: [["@babel/preset-env", env]],
+ presets: [["@babel/preset-env", env], "@babel/preset-react"],
```
