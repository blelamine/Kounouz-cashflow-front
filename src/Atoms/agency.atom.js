import { atom } from "recoil";
import { AgencyInvoiceModel } from "../Models/invoice.models";
export const agencyAtom = atom({
  key: "agencyAtom", // unique ID (with respect to other atoms/selectors)
  default: new AgencyInvoiceModel(), // default value (aka initial value)
});
