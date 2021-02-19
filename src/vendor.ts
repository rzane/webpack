import * as path from "path";

const VENDOR_NAME = "vendor";
const MODULES = "node_modules";

/**
 * @private
 */
export const VENDOR_CONFIG = {
  name: VENDOR_NAME,
  enforce: true,
  chunks: "all" as const,
  test: /[\\/]node_modules[\\/]/,
};

/**
 * @private
 */
export function getVendorName(filename: string) {
  const segments = path.normalize(filename).split(path.sep);
  const index = segments.indexOf(MODULES);

  let name = segments[index + 1];
  if (name.startsWith("@")) {
    name = `${name.slice(1)}__${segments[index + 2]}`;
  }

  return path.join(VENDOR_NAME, name);
}
