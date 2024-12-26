import { jsPDF } from "jspdf";
import moment from "moment";
import { serviceTypes } from "../Constants/types";

export const numberToLetter = (sum) => {
  if (sum === 0) return "zéro";

  const moinsVingt = [
    "un",
    "deux",
    "trois",
    "quatre",
    "cinq",
    "six",
    "sept",
    "huit",
    "neuf",
    "dix",
    "onze",
    "douze",
    "treize",
    "quatorze",
    "quinze",
    "seize",
    "dix-sept",
    "dix-huit",
    "dix-neuf",
  ];
  const dizaines = [
    "vingt",
    "trente",
    "quarante",
    "cinquante",
    "soixante",
    "soixante-dix",
    "quatre-vingts",
    "quatre-vingt-dix",
  ];
  const milliers = ["", "mille", "million", "milliard"];

  function aide(n) {
    if (n === 0) return "";
    else if (n < 20) return moinsVingt[n - 1] + " ";
    else if (n < 100)
      return (
        dizaines[Math.floor(n / 10) - 2] +
        (n % 10 === 1 ? " et un" : " " + aide(n % 10))
      );
    else return moinsVingt[Math.floor(n / 100) - 1] + " cent " + aide(n % 100);
  }

  let resultat = "";
  let i = 0;

  while (sum > 0) {
    if (sum % 1000 !== 0) {
      resultat = aide(sum % 1000) + milliers[i] + " " + resultat;
    }
    sum = Math.floor(sum / 1000);
    i++;
  }

  return resultat.trim().concat(" dinars tunisien");
};

export const showReceipt = (receiptData, operations) => {
  const getDesignationById = (id) => {
    const operation = operations.find((elem) => elem.id === id);
    return operation ? operation.designation : "-";
  };

  const getServiceById = (id) => {
    const operation = serviceTypes.find((elem) => elem.value === id);
    return operation ? operation.label : "-";
  };

  const doc = new jsPDF();
  const pageWidth = 210;

  const img = new Image();
  img.src = "/logo.png";
  img.onload = () => {
    const x = 20;
    const y = 10;

    doc.addImage(img, "PNG", x, y);

    doc.setFontSize(14);
    doc.setFont("Arial", "bold");
    doc.text("STE KOUNOUZ TOURISM SUARL", 20, 60);

    doc.setFontSize(10);
    doc.setFont("Arial", "small");
    doc.text(
      `Société Unipersonnelle à responsabilité limitée\n` +
        `Résidente au capital de 700020.000.000 dinars\n` +
        `Siège social : Rue Italie Immeuble Bouchra – 4000 - Sousse\n` +
        `M.F. : 1214866P/A/M/000 – IU-RNE : 1214866P`,
      20,
      65
    );

    doc.setFont("Arial", "bold");
    doc.text(
      `DATE LE: ${moment(receiptData.date).format("DD-MM-yyyy")}`,
      155,
      85
    );

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");

    const title = `Reçu de paiement n°: ${receiptData.id || "9999"}`;
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2;
    doc.text(title, textX, 100);

    doc.setFontSize(12);
    doc.setFont("Arial");
    doc.text(
      `Reçu de Monsieur, Madame: ${
        receiptData?.infosB2C?.fullName || "foulen ben foulen"
      }`,
      20,
      130
    );

    doc.setFont("Arial", "normal");
    doc.text(
      `Passeport: ${receiptData?.infosB2C?.passportNumber || "9999999"}`,
      20,
      135
    );
    doc.text(
      `Numéro de télephone: ${receiptData?.infosB2C?.phones[0] || "99663344"}`,
      20,
      140
    );
    doc.text(
      `Email: ${receiptData?.infosB2C?.emails[0] || "foulen@gmail.com"}`,
      20,
      145
    );

    doc.text(
      `Je soussigne la somme de: ${
        receiptData.debit !== 0 ? receiptData.debit : receiptData.credit
      } TND (${numberToLetter(
        receiptData.debit !== 0 ? receiptData.debit : receiptData.credit
      )})`,
      30,
      155
    );

    doc.text("Cette somme a été reçu pour ses services : ", 30, 160);
    doc.text(
      receiptData.operationTypeId
        ? `${getServiceById(receiptData.service)}:${getDesignationById(
            receiptData.operationTypeId
          )}`
        : "-",
      35,
      165
    );

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Ce reçu confirme que le paiement a été bien fait", 30, 210);
    doc.text("Signature", 30, 240);

    doc.setFont("Arial", "bold");
    doc.setFontSize(10);
    const pageHeight = doc.internal.pageSize.height;
    const pageBottomHeight = pageHeight - 10;
    const pageBottom =
      "Adresse : Rue Italie Immeuble Bochra - 4000 SOUSSE. TUNISIE. MF: 1214866P /AM-000";
    const bottomTextWidth = doc.getTextWidth(pageBottom);
    const bottomTextX = (pageWidth - bottomTextWidth) / 2;
    doc.text(pageBottom, bottomTextX, pageBottomHeight);

    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, "_blank");
  };

  img.onerror = () => {
    console.error("Failed to load image");
  };
};
