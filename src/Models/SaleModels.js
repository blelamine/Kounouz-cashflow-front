export class SaleModel {
  clientId = 0;
  // clientB2BId = 0;
  // clientB2CId = 0;
  //tags = []; // array of tags
  attachments = [];
  currencyId = "";
  saleItems = []; // PackageItemModel
  note = "";
  // payments = [];
}

export class Package {
  packageItems = []; // liste of package Items
}
export class PackageItemModel {
  providerId = 0;
  service = 0;
  unitPrice = 0.0;
  totalPrice = 0.0;
  commission = 0.0;
  unitFee = 0.0;
  qty = 1;
  note = "";
  ticket;
  hotelReservation;
  customers = [new Guest()];
}
export class PaymentModel {
  amount = 0;
  type = 1; // enums 	PaymentType
  date = null;
  // "paymentNo": "",  auto generated
  notes = "";
  refReglement = "";
  isPaid = false;
  checkId = null;
  bankId = null;
  checkoutId = null;
  EmissionBank = "";
  paymentEventType = 1;
  constructor(type = 1, paymentEventType = 1) {
    this.paymentEventType = paymentEventType;
    this.type = type;
  }
}
// "ref": "", auto generated

export class TicketModel {
  ticketNumber;
  pnr;
  emissionDate;
  passengerFullName;
  passportNumber;
  AgentId;
}

export class HotelReservationModel {
  guests = [new Guest()]; // array of guests
  hotelName = "";
  board = "";
  checkIn;
  checkOut;
}
export class Guest {
  name = "";
  age = 0;
  gender = 1;
  ageType = 1;
}

// export class PaymentModel {
//   amount = 0;
//   type = 1;
//   date;
//   notes = "";
//   refReglement = "";
//   isPaid = true;
//   checkId = 0;
//   bankId = 0;
//   checkoutId = 0;
// }
