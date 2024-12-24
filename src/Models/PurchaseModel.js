export class PurchaseModel {
  ProviderId = 0;
  tags = []; // array of tags
  attachments = [];
  currencyId = "";
  package = new PackagePurchase();
  note = "";
  payments = [];
}

export class PackagePurchase {
  packageItems = []; // liste of package Items
}
export class PackagePurchaseItemModel {
  service = 0;
  unitCost = 0.0;
  totalCost = 0.0;
  commission = 0.0;
  unitFee = 0.0;
  qty = 1;
  note = "";
}
export class PaymentPurchaseModel {
  amount = 0;
  type = 1; // enums 	PaymentType
  date = null;
  // "paymentNo": "",  auto generated
  notes = "";
  refReglement = "";
  //   isPaid = false;
  checkId = 0;
  bankId = 0;
  checkoutId = 0;
  EmissionBank = "";
  paymentEventType = 3;
}
