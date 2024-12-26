export class TransactionModel {
  constructor(debit) {
    this.debit = debit;
    this.event = null;
    this.designation = "";
    this.amount = 0;
    this.credit = 0;
    this.date = new Date();
    this.IsCancelled = false;
    this.representative = "";
    this.clientId = null;
    this.operationTypeId = null;
    this.checkoutId = null;
    this.bankId = null;
    this.ref = "";
    this.attachments = "";
    this.infosB2C = new InfosB2C();
    this.service = null;
  }
}

export class InfosB2C {
  constructor() {
    this.fullName = null;
    this.passportNumber = null;
    this.phones = [];
    this.emails = [];
  }
}
