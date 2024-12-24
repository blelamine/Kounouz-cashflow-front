export const multiDataSet = (data) => {
  return [
    {
      columns: [
        { title: "Nom", width: { wpx: 120 } },
        { title: "Code", width: { wpx: 80 } }, //char width

        { title: "Code Tax", width: { wpx: 80 } }, //pixels width
        { title: "Adresse", width: { wpx: 150 } },
        { title: "Emails", width: { wpx: 150 } }, //pixels width
        { title: "Numéros de téléphones", width: { wpx: 150 } }, //char width
        { title: "Type", width: { wpx: 100 } }, //pixels width
      ],
      data: data.map((item) => {
        let item2 = [
          {
            value: item.name,
            style: {
              fill: { fgColor: { rgb: "eeeeee" } },
              font: { sz: "13", color: { rgb: "2590b5" } },
              alignment: { horizontal: "center" },
            },
          },
          {
            value: item.code,
            style: {
              font: { sz: "14", color: { rgb: "4c67c2" } },
              alignment: { horizontal: "center" },
            },
          },

          {
            value: item.taxCode,
            style: {
              fill: { fgColor: { rgb: "eeeeee" } },
              alignment: { horizontal: "center" },
            },
          },
          {
            value: item.address,
            style: {
              font: { sz: "13", color: { rgb: "2590b5" } },
              alignment: { horizontal: "center" },
            },
          },
          {
            value: item.emails,
            style: {
              fill: { fgColor: { rgb: "eeeeee" } },

              font: { sz: "13" },
              alignment: { horizontal: "center" },
            },
          },

          {
            value: item.phones,
            style: {
              font: { sz: "14", color: { rgb: "5a2c3e" } },
              alignment: { horizontal: "center" },
            },
          },
          {
            value: item.clientType != 1 ? "B2C" : "B2B",
            style: {
              font: {
                sz: "14",
                color: { rgb: item.clientType == 1 ? "673ab7" : "f0b217" },
              },
              alignment: { horizontal: "center" },
            },
          },
        ];
        return item2;
      }),
    },
  ];
};
