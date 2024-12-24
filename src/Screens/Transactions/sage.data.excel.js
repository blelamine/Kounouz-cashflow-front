import moment from "moment";

export const multiDataSetSage = (data) => {
  let d = [];
  data.map((item) => {
    let item2 = [
      {
        value: item.code,

        style: {
          fill: { fgColor: { rgb: "eeeeff" } },
        },
      },
      {
        value: item.date ? moment(item.date).format("DD/MM/yyyy") : "-",

        style: {
          font: { sz: "12", color: { rgb: "222222" } },
          alignment: { horizontal: "center" },
        },
      },
      {
        value: item.sequentialNumber,

        style: {
          fill: { fgColor: { rgb: "673ab7" } },
          font: { sz: "13", color: { rgb: "ffffff" } },
          alignment: { horizontal: "center" },
        },
      },

      {
        value: item.representative ? item.representative : "-",

        style: {
          fill: { fgColor: { rgb: "fcedbc" } },
          alignment: { horizontal: "center" },
        },
      },

      {
        value: item.ref || "-",

        style: {
          font: { sz: "14", color: { rgb: "5a2c3e" } },
          alignment: { horizontal: "center" },
        },
      },

      {
        value: item.accountingNumber,

        style: {
          font: { sz: "14", color: { rgb: "5a2c3e" } },
          alignment: { horizontal: "center" },
        },
      },
      {
        value: " ",
        style: {
          font: { sz: "14", color: { rgb: "5a2c3e" } },
          alignment: { horizontal: "center" },
        },
      },
      {
        value: item.designation || "-",

        style: {
          font: {
            sz: "14",
            color: { rgb: "111111" },
          },
          alignment: { horizontal: "left" },
        },
      },
      {
        value: item.debit || " ",

        style: {
          fill: { fgColor: { rgb: "fcedbc" } },

          font: { sz: "13" },
          alignment: { horizontal: "center" },
        },
      },
      {
        value: item.credit || " ",

        style: {
          font: { sz: "13", color: { rgb: "2590b5" } },
          alignment: { horizontal: "center" },
        },
      },
    ];
    let item3 = [
      {
        value: item.code,

        style: {
          fill: { fgColor: { rgb: "eeeeff" } },
        },
      },
      {
        value: item.date ? moment(item.date).format("DD/MM/yyyy") : "-",

        style: {
          font: { sz: "12", color: { rgb: "222222" } },
          alignment: { horizontal: "center" },
        },
      },
      {
        value: item.sequentialNumber,

        style: {
          fill: { fgColor: { rgb: "673ab7" } },
          font: { sz: "13", color: { rgb: "ffffff" } },
          alignment: { horizontal: "center" },
        },
      },

      {
        value: item.representative ? item.representative : "-",

        style: {
          fill: { fgColor: { rgb: "fcedbc" } },
          alignment: { horizontal: "center" },
        },
      },

      {
        value: item.ref || "-",

        style: {
          font: { sz: "14", color: { rgb: "5a2c3e" } },
          alignment: { horizontal: "center" },
        },
      },

      {
        value: " ",

        style: {
          font: { sz: "14", color: { rgb: "5a2c3e" } },
          alignment: { horizontal: "center" },
        },
      },
      {
        value: " ",
        style: {
          font: { sz: "14", color: { rgb: "5a2c3e" } },
          alignment: { horizontal: "center" },
        },
      },
      {
        value: item.designation || "-",

        style: {
          font: {
            sz: "14",
            color: { rgb: "111111" },
          },
          alignment: { horizontal: "left" },
        },
      },
      {
        value: item.credit || " ",
        style: {
          fill: { fgColor: { rgb: "fcedbc" } },

          font: { sz: "13" },
          alignment: { horizontal: "center" },
        },
      },
      {
        value: item.debit || " ",
        style: {
          font: { sz: "13", color: { rgb: "2590b5" } },
          alignment: { horizontal: "center" },
        },
      },
    ];
    d.push(item3);
    d.push(item2);
  });
  return [
    {
      columns: [
        {
          title: " ",
          width: { wpx: 60 },
        },
        {
          title: " ",
          width: { wpx: 100 },
        },
        {
          title: " ",
          width: { wpx: 50 },
        },

        {
          title: " ",
          width: { wpx: 130 },
        },

        {
          title: " ",
          width: { wpx: 130 },
        },

        {
          title: " ",
          width: { wpx: 130 },
        },
        {
          title: " ",
          width: { wpx: 30 },
        },
        {
          title: " ",
          width: { wpx: 200 },
        },
        {
          title: " ",
          width: { wpx: 80 },
        },
        {
          title: " ",
          width: { wpx: 80 },
        },
      ],
      data: d,
    },
  ];
};
