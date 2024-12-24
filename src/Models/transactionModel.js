import moment from "moment";

export class TransactionModel {
  event;
  designation = "";
  amount = 0;
  //date = moment().format("yyyy-DD-MM");
  //   date = new Date();
  debit = 0;
  credit = 0;
  date = new Date();
  IsCancelled = false;
  representative = "";
  clientId = null;
  checkoutId = null;
  bankId;
  ref = "";
  attachments = "";
  constructor(debit) {
    this.debit = debit;
  }
}
