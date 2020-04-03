import { Configuration } from "webpack";

export type Mode = "development" | "production";
export type Hook = (context: Configuration) => Configuration;

export interface ModeOptions {
  default?: Hook;
  development?: Hook;
  production?: Hook;
}

export interface OutputOptions {
  path: string;
  publicPath?: string;
}
