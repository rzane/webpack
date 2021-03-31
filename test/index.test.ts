import * as webpack from "../src";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";

const rule: webpack.Rule = {
  test: /foo/,
  use: [],
};

const plugin: webpack.Plugin = {
  apply: () => undefined,
};

const build = webpack.pipeline([
  webpack.entry({ app: "/tmp/a" }),
  webpack.output({ path: "dist", publicPath: "/" }),
  webpack.babel(),
  webpack.postcss(),
  webpack.svg(),
  webpack.html(),
  webpack.vendor(),
  webpack.minify(),
  webpack.gzip(),
  webpack.rule(rule),
  webpack.files({ test: /\.mp4/ }),
  webpack.plugin(plugin),
]);

const getLoaders = (config: any) => {
  const loaders: string[] = [];
  for (const rule of config.module.rules) {
    for (const use of rule.use) {
      if (typeof use === "string") {
        loaders.push(use);
      } else {
        loaders.push(use.loader);
      }
    }
  }
  return loaders;
};

test("entry", () => {
  const config = build({});
  expect(config.entry).toEqual({ app: "/tmp/a" });
});

describe("output", () => {
  test("development", () => {
    const config = build({});
    expect(config.output!.path).toBeUndefined();
    expect(config.output!.publicPath).toEqual("/");
    expect(config.output!.filename).not.toContain("contenthash");
  });

  test("production", () => {
    const config = build({ production: true });
    expect(config.output!.path).toEqual("dist");
    expect(config.output!.publicPath).toEqual("/");
    expect(config.output!.filename).toContain("contenthash");
  });
});

test("babel", () => {
  const config = build({});
  const loaders = getLoaders(config);
  expect(loaders).toContainEqual(expect.stringContaining("babel-loader"));
});

describe("postcss", () => {
  test("development", () => {
    const config = build({});
    const loaders = getLoaders(config);
    expect(loaders).toContainEqual(expect.stringContaining("style-loader"));
    expect(loaders).toContainEqual(expect.stringContaining("postcss-loader"));
  });

  test("production", () => {
    const config = build({ production: true });
    const loaders = getLoaders(config);
    expect(loaders).not.toContainEqual(expect.stringContaining("style-loader"));
    expect(loaders).toContainEqual(expect.stringContaining("postcss-loader"));
    expect(config.plugins).toContainEqual(expect.any(MiniCssExtractPlugin));
  });
});

test("svg", () => {
  const config = build({});
  const loaders = getLoaders(config);
  expect(loaders).toContainEqual(expect.stringContaining("@svgr/webpack"));
  expect(loaders).toContainEqual(expect.stringContaining("file-loader"));
});

test("files", () => {
  const config = build({});
  const loaders = getLoaders(config);
  expect(loaders).toContainEqual(expect.stringContaining("file-loader"));
});

test("html", () => {
  const config = build({});
  expect(config.plugins).toContainEqual(expect.any(HtmlWebpackPlugin));
});

describe("vendor", () => {
  test("development", () => {
    const config = build({});
    expect(config.optimization).toBeUndefined();
  });

  test("production", () => {
    const config = build({ production: true });
    expect(config.optimization!.splitChunks).toBeDefined();
  });
});

describe("minify", () => {
  test("development", () => {
    const config = build({});
    expect(config.optimization).toBeUndefined();
  });

  test("production", () => {
    const config = build({ production: true });
    expect(config.optimization!.minimize).toBeDefined();
  });
});

describe("gzip", () => {
  test("development", () => {
    const config = build({});
    expect(config.plugins).not.toContainEqual(expect.any(CompressionPlugin));
  });

  test("production", () => {
    const config = build({ production: true });
    expect(config.plugins).toContainEqual(expect.any(CompressionPlugin));
  });
});

test("favicons", () => {
  const config = build({});
  expect(config.plugins).toContainEqual(expect.any(FaviconsWebpackPlugin));
});

test("rule", () => {
  const config = build({});
  expect(config.module!.rules).toContainEqual(rule);
});

test("plugin", () => {
  const config = build({});
  expect(config.plugins).toContain(plugin);
});
