import { Hook, Configuration } from "./types";

interface Env {
  WEBPACK_BUILD?: true;
  WEBPACK_WATCH?: true;
  production?: true;
}

/**
 * Create a webpack configuration factory from a set of hooks
 * @public
 */
export const pipeline = (hooks: Hook[]) => (env: Env): Configuration => {
  const mode = env.production ? "production" : "development";

  // Set the `NODE_ENV` for downstream tools to consume.
  process.env.NODE_ENV = mode;

  // Build our initial configuration object
  const initialConfig: Configuration = { mode };

  // Reduce over each hook, updating the configuration
  return hooks.reduce((config, hook) => hook(config), initialConfig);
};
