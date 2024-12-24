import moment from "moment";

export const multiDataSet = (data, totalDebit, totalCredit, beginBalance) => {
  return [
    {
      columns: [],
      data: [
        [
          {
            value: "-",
            width: { wpx: 60 },
            style: {
              font: { sz: "13", color: { rgb: "673ab7" } },
              alignment: { horizontal: "center" },
            },
          },
          {
            value: "-",
            style: {
              font: { sz: "13", color: { rgb: "673ab7" } },
              alignment: { horizontal: "center" },
            },
            width: { wpx: 80 },
          }, //char width

          {
            value: "-",
            style: {
              font: { sz: "13", color: { rgb: "673ab7" } },
              alignment: { horizontal: "center" },
            },
            width: { wpx: 100 },
          }, //pixels width
          {
            value: totalDebit ? totalDebit + beginBalance : 0,
            style: {
              font: { sz: "13", color: { rgb: "673ab7" } },
              alignment: { horizontal: "center" },
            },
            width: { wpx: 100 },
          },
          {
            value: totalCredit ? totalCredit : 0,
            style: {
              font: { sz: "13", color: { rgb: "673ab7" } },
              alignment: { horizontal: "center" },
            },
            width: { wpx: 100 },
          },
          //pixels width
          {
            value: totalDebit - totalCredit + beginBalance,
            style: {
              font: { sz: "13", color: { rgb: "673ab7" } },
              alignment: { horizontal: "center" },
            },
            width: { wpx: 150 },
          }, //char
          {
            value: "-",
            style: {
              font: { sz: "13", color: { rgb: "673ab7" } },
              alignment: { horizontal: "center" },
            },
            width: { wpx: 150 },
          },
          {
            value: "-",
            style: {
              alignment: { horizontal: "center" },
            },
            width: { wpx: 300 },
          }, //pixels width
        ],
      ],
    },
    {
      columns: [
        {
          title: "N° P",
          width: { wpx: 60 },
          style: {
            fill: { fgColor: { rgb: "673ab7" } },
            font: { sz: "13", color: { rgb: "ffffff" } },
            alignment: { horizontal: "center" },
          },
        },
        {
          title: "Date",
          style: {
            fill: { fgColor: { rgb: "673ab7" } },
            font: { sz: "13", color: { rgb: "ffffff" } },
            alignment: { horizontal: "center" },
          },
          width: { wpx: 80 },
        }, //char width

        {
          title: "Bénéficiaire",
          style: {
            fill: { fgColor: { rgb: "673ab7" } },
            font: { sz: "13", color: { rgb: "ffffff" } },
            alignment: { horizontal: "center" },
          },
          width: { wpx: 100 },
        }, //pixels width
        {
          title: "Recettes",
          style: {
            fill: { fgColor: { rgb: "673ab7" } },
            font: { sz: "13", color: { rgb: "ffffff" } },
            alignment: { horizontal: "center" },
          },
          width: { wpx: 100 },
        },
        {
          title: "Dépenses",
          style: {
            fill: { fgColor: { rgb: "673ab7" } },
            font: { sz: "13", color: { rgb: "ffffff" } },
            alignment: { horizontal: "center" },
          },
          width: { wpx: 100 },
        },
        {
          title: "Solde Progressif",
          style: {
            fill: { fgColor: { rgb: "673ab7" } },
            font: { sz: "13", color: { rgb: "ffffff" } },
            alignment: { horizontal: "center" },
          },
          width: { wpx: 100 },
        },
        //pixels width
        {
          title: "Référence",
          style: {
            fill: { fgColor: { rgb: "673ab7" } },
            font: { sz: "13", color: { rgb: "ffffff" } },
            alignment: { horizontal: "center" },
          },
          width: { wpx: 150 },
        }, //char width
        {
          title: "Observation",
          style: {
            fill: { fgColor: { rgb: "673ab7" } },
            font: { sz: "13", color: { rgb: "ffffff" } },
            alignment: { horizontal: "center" },
          },
          width: { wpx: 300 },
        }, //pixels width
      ],
      data: data.map((item) => {
        let item2 = [
          {
            value: item.sequentialNumber || "-",
            style: {
              fill: { fgColor: { rgb: "673ab7" } },
              font: { sz: "13", color: { rgb: "ffffff" } },
              alignment: { horizontal: "center" },
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
            value: item.representative ? item.representative : "-",
            style: {
              fill: { fgColor: { rgb: "fcedbc" } },
              alignment: { horizontal: "center" },
            },
          },

          {
            value: item.debit,
            style: {
              fill: { fgColor: { rgb: "fcedbc" } },

              font: { sz: "13" },
              alignment: { horizontal: "center" },
            },
          },
          {
            value: item.credit,
            style: {
              font: { sz: "13", color: { rgb: "2590b5" } },
              alignment: { horizontal: "center" },
            },
          },
          {
            value: item.sp ? item.sp : "-",
            style: {
              font: { sz: "13", color: { rgb: "2590b5" } },
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
            value: item.designation || "-",
            style: {
              font: {
                sz: "14",
                color: { rgb: "111111" },
              },
              alignment: { horizontal: "left" },
            },
          },
        ];
        return item2;
      }),
    },
  ];
};
