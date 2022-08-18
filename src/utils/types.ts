export type SupportedColorSchemes = "hex" | "rgb";
/** Either 6 digits for RGB or 8 digits for ARGB where A is the alpha channel */
export type Hex = `#${string}`;
export type RGB = [number, number, number];
export type RGBA = [number, number, number, number];
export type RGBMaybeA = [number, number, number, number | null];

export type ColorParam = {
  type: SupportedColorSchemes;
  targetColor: Hex | RGB;
  replaceColor: Hex | RGB | RGBA;
};
