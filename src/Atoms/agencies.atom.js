import { atom } from "recoil";
export const agencyAtoms = atom({
  key: "agencyAtoms", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
