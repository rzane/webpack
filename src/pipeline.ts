import { Hook, Mode, Configuration } from "./types";

/**
 * Create a webpack configuration factory from a set of hooks
 */
export const pipeline = (hooks: Hook[]) => (env: Mode): Configuration => {
  /**
   * Set the `NODE_ENV` for downstream tools to consume.
   */
  process.env.NODE_ENV = env;

  /**
   * Build our initial configuration object
   */
  const config: Configuration = {
    mode: env,
  };

  /**
   * Reduce over each hook, updating the configuration
   */
  return hooks.reduce((acc, hook) => hook(acc), config);
};
