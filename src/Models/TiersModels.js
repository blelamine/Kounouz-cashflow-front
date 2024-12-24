export class Tier {
  name;

  taxCode;

  address;

  phones;

  code;

  emails;

  city;
  constructor(
    name = "",

    taxCode = "",

    address = "",

    phones = "",

    code = "",

    emails = "",

    city = ""
  ) {
    this.name = name;
    this.address = address;
    this.taxCode = taxCode;
    this.phones = phones;
    this.code = code;
    this.emails = emails;
    this.city = city;
  }
  getPhones() {
    return this.phones.split(",");
  }
  getEmails() {
    return this.emails.split(",");
  }
  setPhones(arr) {
    this.phones = arr.join(",");
  }
  setEmails(arr) {
    this.emails = arr.join(",");
  }
}

export class ClientModel extends Tier {
  clientType;
  voCommission = 0;
  umrahCommission = 0;
  constructor() {
    super();
  }
}
export class ProviderModel extends Tier {
  providerServiceTypes;
  currencies = "";
  constructor(serviceTypes = "") {
    super();
    this.serviceTypes = serviceTypes;
  }
  getCurrencies(str) {
    return str ? str.split(";") : [];
  }
  getCurrencies(arr) {
    this.currencies = arr.length ? arr.reduce((a, b) => a + ";" + b) : "";
  }
}
