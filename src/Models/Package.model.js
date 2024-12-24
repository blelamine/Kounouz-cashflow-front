export default class PackageModel {
  id = 0;

  name;

  providers1 = [];
  providers2 = [];
  prices = [
    {
      name: "Demi Double",
      costs: [],
      expense: 0,
      price: 0,
      BrancheCommission: 0,
      B2BCommission: 0,
    },
    {
      name: "Enfant (2-12)",
      costs: [],
      expense: 0,

      price: 0,
      BrancheCommission: 0,
      B2BCommission: 0,
    },
    {
      name: "Enfant (0-2)",
      costs: [],
      expense: 0,

      price: 0,
      BrancheCommission: 0,
      B2BCommission: 0,
    },

    {
      name: "Extra Single",
      costs: [],
      expense: 0,

      price: 0,
      BrancheCommission: 0,
      B2BCommission: 0,
    },
  ];
  unitCost;
  commission;
  commissionBranche;
  commissionFranchise;
  unitFee;
  unitFeeBranche;
  unitFeeFranchise;
  note;
  disponibilities = [];
  extrats = [];
}
export class DisponobilityModel {
  id = 0;

  date;
  onStock;
}
export class ExtratModel {
  id = 0;

  providerId;
  service;
  unitCost;
  unitFee;
  note;
}
