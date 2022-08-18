import * as colorConvert from "color-convert";
import { Hex, RGB, RGBA, RGBMaybeA, SupportedColorSchemes } from "./types";

type Color<From> = From extends "hex"
  ? Hex
  : From extends "rgb"
  ? RGB | RGBA
  : never;
type To<From> = From extends "rgb" ? "lab" : "rgb" | "lab";

const colorConverter = (
  from: SupportedColorSchemes,
  to: To<typeof from>,
  color: Color<typeof from>
): RGBMaybeA => {
  let alpha: number | null = null;
  let returnedColor = color;

  // If the "from" type is "hex" and the color's string length is 9, it means that we have "ahex" (a hex code with an alpha channel).
  if (from === "hex" && color.length === 9) {
    // Convert a hex code with an alpha channel to a hex code without it (e.g., "#AABBCCDD" will be converted to "#BBCCDD").
    returnedColor = `#${color.slice(3)}`;

    // Extract an alpha channel (e.g., "AA" will be extracted from "#AABBCCDD").
    const alphaStr = color.slice(1, 3);
    // Convert an alpha channel from a [00, FF] period to a [0, 255] period.
    alpha = parseInt(alphaStr, 16);
  }

  // If the "from" type is "rgb" and the color's array length is 4, it means that we have "rgba" (an rgb code with an alpha channel).
  if (from === "rgb" && color.length === 4) {
    // Extract an alpha channel.
    alpha = (color as RGBA)[3];

    // Convert an alpha channel from a [0, 1] period to a [0, 255] period.
    alpha = Math.round(alpha * 255);
  }

  // This is possible only in case of the "rgb" to "rgb" conversion.
  if (from === to) return [...(returnedColor as RGB), alpha];

  return [
    ...(colorConvert[from] as any)[to](returnedColor),
    alpha,
  ] as RGBMaybeA;
};

export default colorConverter;
