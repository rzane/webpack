import { Options as HTMLOptions } from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import {
  Configuration,
  Entry,
  RuleSetRule as Rule,
  WebpackPluginInstance as Plugin,
} from "webpack";

export type { Configuration, Entry, HTMLOptions, Rule, Plugin };

export type Mode = "development" | "production";
export type Hook = (context: Configuration) => Configuration;

export interface ModeOptions {
  /**
   * Configuration that is applied to all modes.
   */
  default?: Hook;

  /**
   * Configuration that is only applied in the development mode.
   */
  development?: Hook;

  /**
   * Configuration that is only applied in the production mode.
   */
  production?: Hook;
}

export interface OutputOptions {
  /**
   * The output directory as absolute path.
   */
  path: string;

  /**
   * The output.path from the view of the Javascript / HTML page.
   */
  publicPath?: string;
}

export interface FilesOptions {
  /**
   * A pattern that will match files that should be included.
   */
  test: RegExp;
}

export interface PostCSSOptions {
  sourceMap?: boolean;
}

export type CopyOptions = ConstructorParameters<typeof CopyPlugin>[0];
