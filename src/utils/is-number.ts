const isNumber = (x: string) =>
  !isNaN(parseFloat(x)) && isFinite(parseFloat(x));
export default isNumber;
