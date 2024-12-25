import { atom } from "recoil";
import { CheckModel } from "../Models/CheckModel";
export const CheckAtom = atom({
  key: "CheckAtom",
  default: new CheckModel(),
});
