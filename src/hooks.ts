import _merge from "webpack-merge";
import CompressionPlugin from "compression-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
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
} from "./types";

const assert = (test: any, message: string) => {
  if (!test) {
    throw new Error(message);
  }
};

/**
 * Merge configuration
 */
export const merge = (config: Configuration): Hook => (previousConfig) => {
  return _merge(previousConfig, config);
};

/**
 * Merge configuration based on mode
 */
export const mode = (options: ModeOptions): Hook => (config) => {
  return [options.default, options[config.mode as Mode]]
    .filter((hook): hook is Hook => typeof hook !== "undefined")
    .reduce((acc, fn) => fn(acc), config);
};

/**
 * Set entrypoints
 */
export const entry = (entry: string | string[] | Entry): Hook => {
  return merge({ entry });
};

/**
 * Set the output directory
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
 * Build JavaScript and TypeScript with Babel
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
 */
export const postcss = (): Hook => {
  return mode({
    development: merge({
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              require.resolve("style-loader"),
              {
                loader: require.resolve("css-loader"),
                options: { importLoaders: 1 },
              },
              require.resolve("postcss-loader"),
            ],
          },
        ],
      },
    }),
    production: merge({
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: require.resolve("css-loader"),
                options: { importLoaders: 1 },
              },
              require.resolve("postcss-loader"),
            ],
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
 * Inline SVG.
 */
export const svg = (): Hook => {
  return merge({
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            require.resolve("@svgr/webpack"),
            {
              loader: require.resolve("file-loader"),
              options: { name: "assets/media/[name].[hash:8].[ext]" },
            },
          ],
        },
      ],
    },
  });
};

/**
 * Load files via URL.
 */
export const files = (options: FilesOptions): Hook => {
  assert(options.test, "`files` expects a `test` property");

  return merge({
    module: {
      rules: [
        {
          test: options.test,
          use: [
            {
              loader: require.resolve("file-loader"),
              options: { name: "assets/media/[name].[hash:8].[ext]" },
            },
          ],
        },
      ],
    },
  });
};

/**
 * Produce an HTML file.
 */
export const html = (options: HTMLOptions = {}): Hook => {
  return merge({
    plugins: [new HtmlWebpackPlugin(options)],
  });
};

/**
 * Create a vendor chunk.
 */
export const vendor = (): Hook => {
  return mode({
    production: merge({
      optimization: {
        runtimeChunk: "single",
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              enforce: true,
              chunks: "all",
            },
          },
        },
      },
    }),
  });
};

/**
 * Minify resulting JavaScript and CSS.
 */
export const minify = (): Hook => {
  return mode({
    production: merge({
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({ extractComments: false }),
          new OptimizeCSSAssetsPlugin(),
        ],
      },
    }),
  });
};

/**
 * Enable GZIP compression.
 */
export const gzip = (): Hook => {
  return mode({ production: merge({ plugins: [new CompressionPlugin()] }) });
};

/**
 * Generate favicons and a web app manifest.
 */
export const favicons = (options: FaviconOptions): Hook => {
  assert(options.name, "`favicons` expected a `name` property");
  assert(options.logo, "`favicons` expected a `logo` property");

  const plugin = new FaviconsWebpackPlugin({
    logo: options.logo,
    prefix: "assets/icons/",
    cache: true,
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

  return merge({
    plugins: [plugin],
  });
};
