import { atom } from "recoil";
export const CurrencyAtom = atom({
  key: "CurrencyAtom", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
