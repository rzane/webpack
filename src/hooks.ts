import { HotModuleReplacementPlugin } from "webpack";
import { merge as _merge } from "webpack-merge";
import CompressionPlugin from "compression-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { getVendorName, VENDOR_CONFIG } from "./vendor";
import {
  Configuration,
  Entry,
  FaviconOptions,
  FilesOptions,
  HTMLOptions,
  Hook,
  Mode,
  ModeOptions,
  OutputOptions,
  Plugin,
  Rule,
  PostCSSOptions,
} from "./types";

const assert = (test: any, message: string) => {
  if (!test) {
    throw new Error(message);
  }
};

/**
 * Add custom configuration to your Webpack config.
 * @public
 * @example
 * merge({
 *   module: {
 *     rules: [{ test: /\.txt$/, use: 'raw-loader' }],
 *   },
 * })
 */
export const merge = (config: Configuration): Hook => (previousConfig) => {
  return _merge(previousConfig, config);
};

/**
 * Provide environment-specific configuration.
 * @public
 * @example
 * mode({
 *   development: merge({ devtool: "cheap-module-source-map" })
 * })
 */
export const mode = (options: ModeOptions): Hook => (config) => {
  return [options.default, options[config.mode as Mode]]
    .filter((hook): hook is Hook => typeof hook !== "undefined")
    .reduce((acc, fn) => fn(acc), config);
};

/**
 * Configure the webpack entrypoint or entrypoints.
 *
 * See the [Webpack documentation](https://webpack.js.org/concepts/entry-points/)
 * for more information.
 *
 * @public
 * @example <caption>A single entrypoint</caption>
 * entry("src/index.ts")
 * @example <caption>Multiple entrypoints</caption>
 * entry(["src/index.ts", "src/admin.ts"])
 * @example <caption>Multiple named entrypoints</caption>
 * entry({
 *   main: "src/index.ts",
 *   admin: "src/admin.ts"
 * })
 */
export const entry = (entry: string | string[] | Entry): Hook => {
  return merge({ entry });
};

/**
 * Set the output directory
 *
 * See the [Webpack documentation](https://webpack.js.org/concepts/output/)
 * for more information.
 *
 * @public
 * @example
 * output({
 *   path: path.join(__dirname, "dist"),
 *   publicPath: "/",
 * })
 */
export const output = (options: OutputOptions): Hook => {
  assert(options.path, "`output` expects a `path` property");

  return mode({
    development: merge({
      output: {
        publicPath: options.publicPath,
        filename: "assets/js/[name].js",
        chunkFilename: "assets/js/[name].chunk.js",
      },
    }),
    production: merge({
      output: {
        path: options.path,
        publicPath: options.publicPath,
        filename: "assets/js/[name].[contenthash:8].js",
        chunkFilename: "assets/js/[name].[contenthash:8].chunk.js",
      },
    }),
  });
};

/**
 * Add a new rule
 * @public
 * @example
 * rule({
 *   test: /\.txt$/,
 *   use: "raw-loader"
 * })
 */
export const rule = (rule: Rule): Hook => {
  return merge({ module: { rules: [rule] } });
};

/**
 * Add a new plugin
 * @public
 * @example
 * plugin(new BannerPlugin({ banner: "Hello!" }))
 */
export const plugin = (plugin: Plugin): Hook => {
  return merge({ plugins: [plugin] });
};

/**
 * Build JavaScript and TypeScript with Babel
 * @public
 * @example
 * babel()
 */
export const babel = (): Hook => {
  return merge({
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: { cacheDirectory: true },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".mjs", ".js"],
    },
  });
};

/**
 * Compile CSS with PostCSS
 * @public
 * @example
 * postcss()
 */
export const postcss = (opts: PostCSSOptions = {}): Hook => {
  const test = /\.(css|pcss|postcss)$/;

  const css = {
    loader: require.resolve("css-loader"),
    options: { ...opts, importLoaders: 1 },
  };

  const postcss = {
    loader: require.resolve("postcss-loader"),
    options: { ...opts, postcssOptions: { hideNothingWarning: true } },
  };

  return mode({
    development: merge({
      module: {
        rules: [
          {
            test,
            use: [require.resolve("style-loader"), css, postcss],
          },
        ],
      },
    }),
    production: merge({
      module: {
        rules: [
          {
            test,
            use: [MiniCssExtractPlugin.loader, css, postcss],
          },
        ],
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: "assets/css/[name].[contenthash:8].css",
          chunkFilename: "assets/css/[name].[contenthash:8].chunk.css",
        }),
      ],
    }),
  });
};

/**
 * Allows SVG files to be imported as React components or as URLs.
 * @public
 * @example <caption>Enabling the hook</caption>
 * svg()
 * @example <caption>Importing a React component</caption>
 * import { ReactComponent as Logo } from "./logo.svg";
 *
 * <Logo />
 * @example <caption>Importing a URL to an SVG</caption>
 * import url from "./logo.svg";
 *
 * <img src={url} />
 */
export const svg = (): Hook => {
  return rule({
    test: /\.svg$/,
    use: [
      require.resolve("@svgr/webpack"),
      {
        loader: require.resolve("file-loader"),
        options: { name: "assets/media/[name].[hash:8].[ext]" },
      },
    ],
  });
};

/**
 * Allows files to be imported.
 * @public
 * @example <caption>Enabling the hook</caption>
 * files({ test: /\.(png|jpg)$/ })
 * @example <caption>Importing a file</caption>
 * import url from "./logo.png";
 *
 * <img src={url} />
 */
export const files = (options: FilesOptions): Hook => {
  assert(options.test, "`files` expects a `test` property");

  return rule({
    test: options.test,
    use: [
      {
        loader: require.resolve("file-loader"),
        options: { name: "assets/media/[name].[hash:8].[ext]" },
      },
    ],
  });
};

/**
 * Produce an HTML file.
 * @public
 * @example
 * html()
 */
export const html = (options: HTMLOptions = {}): Hook => {
  return plugin(
    new HtmlWebpackPlugin({
      scriptLoading: "defer",
      ...options,
    })
  );
};

/**
 * Generate favicons and a web app manifest.
 * @public
 * @example
 * favicons({
 *   name: "Example",
 *   logo: "assets/logo.png",
 *   background: "#eee",
 *   foreground: "#000",
 * })
 */
export const favicons = (options: FaviconOptions): Hook => {
  assert(options.name, "`favicons` expected a `name` property");
  assert(options.logo, "`favicons` expected a `logo` property");

  const faviconPlugin = new FaviconsWebpackPlugin({
    logo: options.logo,
    prefix: "assets/icons/",
    cache: true,
    mode: "webapp",
    devMode: "light",
    favicons: {
      appName: options.name,
      appShortName: options.shortName,
      appDescription: options.description,
      developerURL: null,
      background: options.background || "#fff",
      theme_color: options.themeColor || "#fff",
      icons: { coast: false, yandex: false },
    },
  });

  return plugin(faviconPlugin);
};

/**
 * After using this hook, you'll have a single file that contains all of the
 * node modules used in your application. For example:
 *
 *    assets/js/main.js
 *    assets/js/vendor.js
 *
 * This increases the likelihood of a cache hit on subsequent deploys. If none
 * of your dependencies change, your users can use a cached version of the
 * vendors file.
 *
 * This hook is mutually exclusive with the [vendorEachModule](#vendoreachmodule) hook.
 *
 * @public
 * @example
 * vendor()
 */
export const vendor = (): Hook => {
  return mode({
    production: merge({
      optimization: {
        runtimeChunk: "single",
        splitChunks: {
          cacheGroups: {
            vendor: VENDOR_CONFIG,
          },
        },
      },
    }),
  });
};

/**
 * After using this hook, you'll have a file for each top-level node module in
 * your application. For example:
 *
 *     assets/js/main.js
 *     assets/js/vendor/react.js
 *     assets/js/vendor/react-router.js
 *     assets/js/vendor/react-router-dom.js
 *
 * This maximizes the likelihood of a cache hit on subsequent deploys, but it
 * also results in a lot of HTTP requests. If your server doesn't support
 * HTTP/2, you are probably better off using the [vendor](#vendor) hook.
 *
 * This hook is mutually exclusive with the [vendor](#vendor) hook.
 *
 * @public
 * @example
 * vendorEachModule()
 */
export const vendorEachModule = (): Hook => {
  return mode({
    production: merge({
      optimization: {
        runtimeChunk: "single",
        splitChunks: {
          cacheGroups: {
            vendor: {
              ...VENDOR_CONFIG,
              name: (mod: any) => getVendorName(mod.context),
            },
          },
        },
      },
    }),
  });
};

/**
 * Minify resulting JavaScript and CSS.
 * @public
 * @example
 * minify()
 */
export const minify = (): Hook => {
  return mode({
    production: merge({
      optimization: {
        minimize: true,
        minimizer: ["...", new CssMinimizerPlugin()],
      },
    }),
  });
};

/**
 * Enable GZIP compression.
 * @public
 * @example
 * gzip()
 */
export const gzip = (): Hook => {
  return mode({ production: merge({ plugins: [new CompressionPlugin()] }) });
};

/**
 * Enable fast refresh for React. This depends on using the `hot` option
 * for `@stackup/webpack/babel-preset`.
 *
 * @public
 * @example
 * fastRefresh()
 */
export const refresh = (): Hook => {
  return mode({
    development: merge({
      plugins: [
        new HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
      ],
    }),
  });
};
