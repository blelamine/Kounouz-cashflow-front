export const clientTypes = [
  { label: "B2B", value: 1 },
  { label: "B2C", value: 2 },
];
// _________________________________________________________________________
export const checkStatus = [
  { label: "Reçu", value: 1 },
  { label: "Remise à l'encaissement", value: 2 },
  { label: "Logé dans le compte", value: 3 },
  { label: "Preavis", value: 4 },
  { label: "Preavis annulé", value: 5 },
  { label: "CNP", value: 6 },
  { label: "Paiement (ARP)", value: 7 },
  { label: "Paiement (Espèces)", value: 8 },
  { label: "Litige", value: 9 },
];
export const ticketType = [
  { label: "Tous", value: "All" },
  { label: "TKTT", value: "TKTT" },
  { label: "EMDS", value: "EMDS" },
  { label: "RFND", value: "RFND" },
  { label: "CANX", value: "CANX" },
  { label: "CAN", value: "CAN" },
  { label: "RFNC", value: "RFNC" },
  { label: "SPDR", value: "SPDR" },
  { label: "ADMS", value: "ADMS" },
  { label: "ADMA", value: "ADMA" },
  { label: "ACMS", value: "ACMS" },
  { label: "ACMA", value: "ACMA" },
];
export const ticketType2 = [
  { label: "Tous", value: "All" },
  { label: "TKTT", value: "TKTT" },
  { label: "RFND", value: "RFND" },
  { label: "CANX", value: "CANX" },
];
export const dateTypes = [
  { label: "Aujourd'hui", value: 1 },
  { label: "Hier", value: 2 },
  // { label: "Cette semaine", value: 3 },
  // { label: "la semaine dernière", value: 4 },
  { label: "Ce mois", value: 3 },
  { label: "Le mois dernier", value: 4 },
  { label: "Cette année", value: 5 },
  { label: "Personnalisé", value: 6 },
  { label: "Jour", value: 7 },
];

export const checkPurpose = [
  { label: "Recouvrement", value: 1 },
  // { label: "Payment Client B2C", value: 2 },
  { label: "Garantie Client", value: 2 },
];
// CheckPurpose
//     {
//         RecouvAgence = 1,
//         RecouvClient,
//         Garanty,
//     }
//_________________________________________________________________________
export const transactionEvents = [
  { label: "Vente", value: 1 },
  { label: "Recouvrement", value: 2 },
  { label: "Annulation", value: 3 },
  { label: "Remboursement", value: 4 },
  { label: "Service", value: 5 },
  { label: "Garaantie", value: 6 },
];
export const paymentType = [
  { label: "Chéque", value: 1 },
  { label: "Espèces ", value: 2 },
  { label: "Solde", value: 3 },
  // { label: "CCA", value: 4 },
  // { label: "Versement", value: 5 }, // chechout
  { label: "Virement Bancaire", value: 4 },
];
// public enum PaymentType
// {
//     Check = 1,
//     Cash,
//     Solde,
//     Transfert,
//     Versement,
//     Deposit
// }
export const PaymentEventType = [
  { label: "Récompense", value: 1 },
  { label: "Sortie", value: 2 },
];
// RECOVERY_CLIENT = 1, GUARANTEE_CLIENT,
// PAYMENT_PROVIDER,
// GUARANTEE_PROVIDER,
export const SaleStatus = [
  { label: "Non Payé", value: 1 },
  { label: "Payé en Partie", value: 2 },
  { label: "En Attente", value: 3 },
  { label: "Payé", value: 4 },
  { label: "Remboursé", value: 5 },
  { label: "Annulé", value: 6 },
];

// public enum SaleStatus
//         {
//         [Description("Not paid")]
//         NotPaid,
//         [Description("Partial Paid")]
//         PartialPaid,
//         [Description("Pending")]
//         Pending,
//         [Description("Paid")]
//         Paid,
//         [Description("Refund")]
//         Refund,
//         [Description("Canceled")]
//         Canceled
//     }
// ---------------------------------------------------------------------------
export const dateFilter = [
  { label: "Aujourd'hui", value: 1 },
  { label: "Hier", value: 2 },
  { label: "Cette semaine", value: 3 },
  { label: "la semaine dernière", value: 4 },
  { label: "Ce mois", value: 5 },
  { label: "Le mois dernier", value: 6 },
  { label: "Cette année", value: 7 },
  { label: "Personnalisé", value: 8 },
  { label: "Jour", value: 9 },
];

//-----------------------------------

export const serviceTypes = [
  { label: "Billetterie", value: 1 },
  { label: "Hôtel", value: 2 },
  { label: "Bateau", value: 3 },
  { label: "Autobus", value: 4 },
  { label: "Excursion", value: 5 },
  { label: "Voyage Organisé", value: 6 },
  { label: "Omrah", value: 7 },
  { label: "Autres", value: 8 },
];

export const Gender = [
  { label: "Masculin", value: 1 },
  { label: "Féminin", value: 2 },
];
export const AgeType = [
  { label: "Adulte", value: 1 },
  { label: "Enfant", value: 2 },
];

export const roomTypes = [
  { label: "Chambre simple", value: "Chambre simple" },
  { label: "Chambre double", value: "Chambre double" },
  { label: "Chambre triple", value: "Chambre triple" },
  { label: "Chambre quadruple", value: "Chambre quadruple" },
  { label: "Chambre Familiale", value: "Chambre Familiale" },
  { label: "Suite", value: "Suite" },
];
export const AuthorizationStatus = [
  { label: "Tout", value: 0 },
  { label: "Autorisation Directe", value: 1 },
  { label: "En Attente", value: 2 },
  { label: "Autorisé", value: 3 },
  { label: "Non Autorisé", value: 4 },
];
