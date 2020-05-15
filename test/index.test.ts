import path from "path";
import * as webpack from "../src";

const build = webpack.pipeline([
  webpack.entry({ app: "/tmp/a" }),
  webpack.output({ path: "/tmp/b", publicPath: "/" }),
  webpack.babel(),
  webpack.postcss(),
  webpack.svg(),
  webpack.html(),
  webpack.vendor(),
  webpack.minify(),
  webpack.gzip(),
  webpack.files({ test: /\.mp4/ }),
  webpack.favicons({ name: "Example", logo: "src/assets/logo.png" }),
]);

const stripFiles = (value: any) => {
  return { value, stripFiles: true };
};

expect.addSnapshotSerializer({
  test: (input) => input && input.stripFiles,
  print(input: any, serialize, indent) {
    const root = new RegExp(path.join(__dirname, ".."), "g");
    return indent(serialize(input.value)).replace(root, "");
  },
});

it("builds a development config", () => {
  expect(stripFiles(build("development"))).toMatchSnapshot();
});

it("builds a production config", () => {
  expect(stripFiles(build("production"))).toMatchSnapshot();
});
