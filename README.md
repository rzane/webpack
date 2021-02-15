<h1 align="center">@stackup/webpack</h1>

<div align="center">

![Build](https://github.com/rzane/webpack/workflows/Build/badge.svg)
![Version](https://img.shields.io/npm/v/@stackup/webpack)
![License](https://img.shields.io/npm/l/@stackup/webpack)

</div>

Functions that you can compose to build the perfect Webpack configuration. These functions bake in best practices, so you can stop copy-pasting them from the internet!

[**View the API documentation here**](docs/API.md)

- [Install](#install)
- [Usage](#usage)
  - [Step 1: Add scripts](#step-1-add-scripts)
  - [Step 2: Configure Babel](#step-2-configure-babel)
  - [Step 3: Configure Webpack](#step-3-configure-webpack)
- [Guides](#guides)
  - [Enabling TypeScript](#enabling-typescript)
  - [Polyfill missing browser features](#polyfill-missing-browser-features)
  - [Enabling Fast Refresh](#enabling-fast-refresh)

## Install

    $ yarn add @stackup/webpack --dev

## Usage

#### Step 1: Add scripts

Add the following to your `package.json`.

```jsonc
{
  // ...
  "scripts": {
    "start": "webpack serve",
    "build": "webpack --env production"
  }
  // ...
}
```

After adding this configuration, you can run:

- `yarn start` to start the development server
- `yarn build` to create a production build

#### Step 2: Configure Babel

This library ships with a Babel preset to get you up and running quickly.

To configure Babel, add the following to your `package.json`:

```jsonc
{
  // ...
  "babel": {
    "presets": ["@stackup/webpack/babel-preset"]
  }
  // ...
}
```

#### Step 3: Configure Webpack

This library provides a set of functions that can be composed to generate a production-ready webpack configuration file.

[You can get started by copying the example here.](example/webpack.config.js)

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

  // More configuration goes here...
]);
```

## Guides

#### Enabling TypeScript

To use TypeScript, just install it:

    $ yarn add typescript --dev

Then, create a `tsconfig.json` file:

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

#### Polyfill missing browser features

First, specify which browsers you want your application to support in your `package.json`:

```jsonc
{
  // ...
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
  // ...
}
```

Next, insert the following line at the very top of your entrypoint:

```javascript
import "core-js/stable";
```

The Babel preset that ships with `@stackup/webpack` will translate that import to a bunch of smaller imports based on your browserlist and the features that you application actually depends on. So, after compilation, it might look something like this:

```javascript
import "core-js/modules/es.array.unscopables.flat";
import "core-js/modules/es.array.unscopables.flat-map";
```

#### Enabling Fast Refresh

_Note: This feature is experimental._

To support fast refresh for React applications, you'll need to update your Babel configuration:

```jsonc
{
  // ...
  "babel": {
    "presets": [["@stackup/webpack/babel-preset", { "refresh": true }]]
  }
  // ...
}
```

Then, you'll need to enable fast refresh in your webpack configuration:

```javascript
import * as webpack from "@stackup/webpack";

module.exports = webpack.pipeline([
  // ...
  webpack.refresh(),
  // ...
]);
```
