export default class SaleVoModel {
  hotelName = "";
  arrangement = "";
  ticketNumber = "";
  totalPrice = 0;
  regulated_value = 0;
  note = "";
  dateVol = null;
  date = null;
  clientId = 0;
  packageId = 0;
  extrats = [];
  customer = new CustomerVoModel();
}

export class CustomerVoModel {
  name = "";
  passportNumber = "";
  age = 0;
  gender = 1;
  ageType = 1;
}
