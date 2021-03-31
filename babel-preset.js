const path = require("path");

module.exports = (api, opts) => {
  const isDev = api.env("development");
  const isTest = api.env("test");
  const isRefresh = Boolean(opts && opts.refresh);
  const useBuiltIns = (opts && opts.useBuiltIns) || "entry";

  /**
   * Enable caching
   */
  api.cache(true);

  /**
   * Return our configuration
   */
  return {
    presets: [
      [
        require("@babel/preset-env"),
        isTest
          ? {
              // Compile for the current node environment
              targets: { node: "current" },
            }
          : {
              // Allow importing core-js in entrypoint and use browserlist to select polyfills
              useBuiltIns,
              // Set the corejs version we are using to avoid warnings in console
              corejs: 3,
              // Exclude transforms that make all code slower
              exclude: ["transform-typeof-symbol"],
              // Required to enable tree-shaking
              modules: false,
            },
      ],
      [
        require("@babel/preset-react"),
        {
          // Adds some more debug information to stack traces
          development: isDev || isTest,
        },
      ],
      [require("@babel/preset-typescript")],
    ],
    plugins: [
      [
        require("@babel/plugin-transform-runtime"),
        {
          corejs: false,
          helpers: true,
          regenerator: true,
          version: require("@babel/runtime/package.json").version,
          useESModules: !isTest,
          absoluteRuntime: path.dirname(
            require.resolve("@babel/runtime/package.json")
          ),
        },
      ],
      isDev && isRefresh && require.resolve("react-refresh/babel"),
    ].filter(Boolean),
  };
};
