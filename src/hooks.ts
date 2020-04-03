import _merge from "webpack-merge";
import { Configuration, Entry } from "webpack";
import CompressionPlugin from "compression-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import InlineChunkHtmlPlugin from "html-webpack-inline-chunk-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import { Hook, ModeOptions, OutputOptions, Mode } from "./types";

/**
 * Merge configuration
 */
export const merge = (updates: Configuration): Hook => config => {
  return _merge(config, updates);
};

/**
 * Merge configuration based on mode
 */
export const mode = (opts: ModeOptions): Hook => config => {
  return [opts.default, opts[config.mode as Mode]]
    .filter((hook): hook is Hook => typeof hook !== "undefined")
    .reduce((acc, fn) => fn(acc), config);
};

/**
 * Set entrypoints
 */
export const entry = (entry: Entry): Hook => {
  return merge({ entry });
};

/**
 * Set the output directory
 */
export const output = ({ path, publicPath }: OutputOptions): Hook => {
  return mode({
    development: merge({
      output: {
        publicPath,
        filename: "assets/js/[name].js",
        chunkFilename: "assets/js/[name].chunk.js"
      }
    }),
    production: merge({
      output: {
        path,
        publicPath,
        filename: "assets/js/[name].[contenthash:8].js",
        chunkFilename: "assets/js/[name].[contenthash:8].chunk.js"
      }
    })
  });
};

/**
 * Build JavaScript and TypeScript via Babel
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
              options: { cacheDirectory: true }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".mjs", ".js"]
    }
  });
};

/**
 * PostCSS
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
                options: { importLoaders: 1 }
              },
              require.resolve("postcss-loader")
            ]
          }
        ]
      }
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
                options: { importLoaders: 1 }
              },
              require.resolve("postcss-loader")
            ]
          }
        ]
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: "assets/css/[name].[contenthash:8].css",
          chunkFilename: "assets/css/[name].[contenthash:8].chunk.css"
        })
      ]
    })
  });
};

/**
 * Inline SVG
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
              options: { name: "static/media/[name].[hash:8].[ext]" }
            }
          ]
        }
      ]
    }
  });
};

/**
 * Fallback to loading files via URL
 * NOTE: This should be the last loader in your pipeline!
 */
export const files = (): Hook => {
  return merge({
    module: {
      rules: [
        {
          use: require.resolve("file-loader"),
          exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
          options: { name: "static/media/[name].[hash:8].[ext]" }
        }
      ]
    }
  });
};

/**
 * Produce an HTML file
 */
export const html = (options: HtmlWebpackPlugin.Options = {}): Hook => {
  return mode({
    default: merge({
      plugins: [new HtmlWebpackPlugin(options)]
    }),
    production: merge({
      plugins: [
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/])
      ]
    })
  });
};

/**
 * Create a vendor chunk
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
              chunks: "all"
            }
          }
        }
      }
    })
  });
};

/**
 * Minify resulting JavaScript and CSS
 */
export const minify = (): Hook => {
  return mode({
    production: merge({
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({ extractComments: false }),
          new OptimizeCSSAssetsPlugin()
        ]
      }
    })
  });
};

/**
 * Enable GZIP compression
 */
export const gzip = (): Hook => {
  return mode({ production: merge({ plugins: [new CompressionPlugin()] }) });
};
