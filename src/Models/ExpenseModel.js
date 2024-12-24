export class ExpenseModel {
  attachments = [];
  currencyId = "";
  note = "";
  payments = [];
}

export class PaymentExpenseModel {
  amount = 0;
  type = 1; // enums 	PaymentType
  date = null;
  notes = "";
  refReglement = "";
  checkId = 0;
  bankId = 0;
  checkoutId = 0;
  EmissionBank = "";
  paymentEventType = 2; // output
}
