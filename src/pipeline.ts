import { Hook, Mode, Config } from "./types";

/**
 * Create a webpack configuration factory from a set of hooks
 */
export const pipeline = (hooks: Hook[]) => (env: Mode): Config => {
  /**
   * Set the `NODE_ENV` for downstream tools to consume.
   */
  process.env.NODE_ENV = env;

  /**
   * Build our initial configuration object
   */
  const config: Config = {
    mode: env
  };

  /**
   * Reduce over each hook, updating the configuration
   */
  return hooks.reduce((acc, hook) => hook(acc), config);
};
