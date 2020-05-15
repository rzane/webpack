import { Configuration, Entry } from "webpack";

export type { Configuration, Entry };
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

export interface FaviconOptions {
  /**
   * The name of your app.
   */
  name: string;

  /**
   * The logo for your app. This will be used to generate favicons.
   */
  logo: string;

  /**
   * Your app's version number.
   */
  version?: string;

  /**
   * Background color for flattened icons.
   */
  background?: string;

  /**
   * Theme color user for example in Android's task switcher.
   */
  themeColor?: string;

  /**
   * Style for Apple status bar
   */
  appleStatusBarStyle?: "black-translucent" | "default" | "black";
}
