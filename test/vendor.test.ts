import { getVendorName } from "../src/vendor";

test("getVendorName", () => {
  expect(getVendorName("/root/node_modules/foo/index.js")).toEqual(
    "vendor/foo"
  );

  expect(getVendorName("/root/node_modules/foo/bar/index.js")).toEqual(
    "vendor/foo"
  );

  expect(getVendorName("/root/node_modules/@foo/bar/index.js")).toEqual(
    "vendor/foo__bar"
  );
});
