import { Configuration } from "webpack";

export interface Config extends Configuration {
  devServer?: any;
}

export type Mode = "development" | "production";
export type Hook = (context: Config) => Config;

export interface ModeOptions {
  default?: Hook;
  development?: Hook;
  production?: Hook;
}

export interface OutputOptions {
  path: string;
  publicPath?: string;
}

export interface FilesOptions {
  test: RegExp;
}
