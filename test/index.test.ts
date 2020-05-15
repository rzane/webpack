import path from "path";
import {
  pipeline,
  entry,
  output,
  babel,
  postcss,
  svg,
  html,
  vendor,
  minify,
  gzip,
  files,
} from "../src";

const build = pipeline([
  entry({ app: "/tmp/a" }),
  output({ path: "/tmp/b", publicPath: "/" }),
  babel(),
  postcss(),
  svg(),
  html(),
  vendor(),
  minify(),
  gzip(),
  files({ test: /\.mp4/ }),
]);

const stripFiles = (value: any) => {
  return { value, stripFiles: true };
};

expect.addSnapshotSerializer({
  test: (input) => input && input.stripFiles,
  print(input, serialize, indent) {
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
