import { atom } from "recoil";
export const TaxAtom = atom({
  key: "TaxAtom", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
