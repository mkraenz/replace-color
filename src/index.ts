import replaceColor from "./replace-color";
import ReplaceColorError from "./utils/replace-color-error";

// WORKAROUND to avoid breaking change: Writing `export default replaceColor`
// forces CommonJS clients to use `.default`. Example:
// `const replaceColor = require('replace-color).default`.
// Hence this hacky workaround
declare var module: {
  exports: typeof replaceColor & {
    ReplaceColorError: typeof ReplaceColorError;
  };
};
module.exports = replaceColor as any;
module.exports.ReplaceColorError = ReplaceColorError;

export default replaceColor;
export { default as ReplaceColorError } from "./utils/replace-color-error";
