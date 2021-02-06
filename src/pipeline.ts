import { Hook, Configuration } from "./types";

interface Env {
  WEBPACK_BUILD?: true;
  WEBPACK_WATCH?: true;
  development?: true;
  production?: true;
}

/**
 * Create a webpack configuration factory from a set of hooks
 */
export const pipeline = (hooks: Hook[]) => (env: Env): Configuration => {
  const mode = env.production ? "production" : "development";

  /**
   * Set the `NODE_ENV` for downstream tools to consume.
   */
  process.env.NODE_ENV = mode;

  /**
   * Build our initial configuration object
   */
  const config: Configuration = {
    mode,
  };

  /**
   * Reduce over each hook, updating the configuration
   */
  return hooks.reduce((acc, hook) => hook(acc), config);
};
