import * as Jimp from "jimp";
import convertColor from "./utils/convert-color";
import getDelta, { Formula } from "./utils/get-delta";
import isNumber from "./utils/is-number";
import ReplaceColorError from "./utils/replace-color-error";
import { ColorParam } from "./utils/types";
import validateColors from "./utils/validate-colors";

interface Params {
  image: string;
  colors: ColorParam;
  formula?: Formula;
  deltaE?: number;
}
type Callback = (err: Error | null, data?: any) => any;

const replaceColor = (
  { image, colors, formula = "E00", deltaE = 2.3 }: Params,
  callback?: Callback
): Promise<typeof Jimp> => {
  if (callback) {
    if (typeof callback !== "function") {
      throw new ReplaceColorError("PARAMETER_INVALID", "callback");
    }
  }

  return new Promise((resolve, reject) => {
    callback =
      callback ||
      ((err, jimpObject) => {
        if (err) return reject(err);
        return resolve(jimpObject);
      });

    if (!image) {
      return callback(
        new ReplaceColorError("PARAMETER_REQUIRED", "options.image")
      );
    }

    const colorsValidationError = validateColors(colors);
    if (colorsValidationError) {
      return callback(
        new ReplaceColorError(
          colorsValidationError.code,
          colorsValidationError.field
        )
      );
    }

    if (
      !(typeof formula === "string" && ["E76", "E94", "E00"].includes(formula))
    ) {
      return callback(
        new ReplaceColorError("PARAMETER_INVALID", "options.formula")
      );
    }

    if (!(isNumber(deltaE as any) && deltaE >= 0 && deltaE <= 100)) {
      return callback(
        new ReplaceColorError("PARAMETER_INVALID", "options.deltaE")
      );
    }

    Jimp.read(image)
      .then((jimpObject) => {
        const targetLABColor = convertColor(
          colors.type,
          "lab",
          colors.targetColor
        );
        const replaceRGBColor = convertColor(
          colors.type,
          "rgb",
          colors.replaceColor
        );
        console.log(targetLABColor)
        console.log(replaceRGBColor)

        jimpObject.scan(
          0,
          0,
          jimpObject.bitmap.width,
          jimpObject.bitmap.height,
          (x, y, idx) => {
            const currentLABColor = convertColor("rgb", "lab", [
              jimpObject.bitmap.data[idx],
              jimpObject.bitmap.data[idx + 1],
              jimpObject.bitmap.data[idx + 2],
            ]);

            if (getDelta(currentLABColor, targetLABColor, formula) <= deltaE) {
              jimpObject.bitmap.data[idx] = replaceRGBColor[0];
              jimpObject.bitmap.data[idx + 1] = replaceRGBColor[1];
              jimpObject.bitmap.data[idx + 2] = replaceRGBColor[2];
              if (replaceRGBColor[3] !== null)
                jimpObject.bitmap.data[idx + 3] = replaceRGBColor[3];
            }
          }
        );

        if (callback) callback(null, jimpObject);
      })
      .catch(callback);
  });
};

export default replaceColor;
