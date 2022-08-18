import deltaE from "delta-e";
import { RGBMaybeA } from "./types";

export type Formula = "E76" | "E94" | "E00";

const getDelta = (LAB1: RGBMaybeA, LAB2: RGBMaybeA, formula: Formula) => {
  return deltaE[`getDelta${formula}`](
    { L: LAB1[0], A: LAB1[1], B: LAB1[2] },
    { L: LAB2[0], A: LAB2[1], B: LAB2[2] }
  );
};
export default getDelta;
