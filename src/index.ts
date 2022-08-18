import replaceColor from "./replace-color";
import ReplaceColorError from "./utils/replace-color-error";

// WORKAROUND to avoid breaking change: Writing `export default replaceColor`
// forces CommonJS clients to use `.default`. Example:
// `const replaceColor = require('replace-color).default`.
// Hence this hacky workaround
type Exports = typeof replaceColor & {
  ReplaceColorError: typeof ReplaceColorError;
};
declare var module: {
  exports: Exports;
};
module.exports = replaceColor as any;
module.exports.ReplaceColorError = ReplaceColorError;

export default replaceColor as Exports;
export { default as ReplaceColorError } from "./utils/replace-color-error";
