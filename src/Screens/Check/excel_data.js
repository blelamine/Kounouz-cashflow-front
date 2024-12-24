import { checkStatus, checkPurpose } from "../../Constants/types";
import moment from "moment";

export const multiDataSet = (data) => {
  return [
    {
      columns: [
        { title: "Numéro", width: { wpx: 120 } },
        { title: "Client", width: { wpx: 150 } }, //char width

        { title: "Banque de Dépôt", width: { wpx: 150 } }, //pixels width
        { title: "Date De Dépôt", width: { wpx: 120 } },
        { title: "Banque d'Emission", width: { wpx: 150 } }, //pixels width
        { title: "Status", width: { wpx: 100 } }, //char width
        { title: "Type", width: { wpx: 150 } }, //pixels width
        { title: "Notes", width: { wpx: 100 } }, //pixels width
      ],
      data: data.map((item) => {
        let item2 = [
          {
            value: item.number,
            style: {
              fill: { fgColor: { rgb: "eeeeee" } },
              font: { sz: "13", color: { rgb: "2590b5" } },
              alignment: { horizontal: "center" },
            },
          },
          {
            value: item.client ? item.client.name : "",
            style: {
              font: { sz: "14", color: { rgb: "4c67c2" } },
              alignment: { horizontal: "center" },
            },
          },

          {
            value: item.depositBank ? item.depositBank.name : "",
            style: {
              fill: { fgColor: { rgb: "eeeeee" } },
              alignment: { horizontal: "center" },
            },
          },
          {
            value: moment(item.depositDate).format("DD MMM YYYY"),
            style: {
              font: { sz: "13", color: { rgb: "2590b5" } },
              alignment: { horizontal: "center" },
            },
          },
          {
            value: item.emmissionBank ? item.emmissionBank.name : "",
            style: {
              fill: { fgColor: { rgb: "eeeeee" } },

              font: { sz: "13" },
              alignment: { horizontal: "center" },
            },
          },

          {
            value: checkStatus.find((el) => el.value == item.status).label,
            style: {
              font: { sz: "14", color: { rgb: "5a2c3e" } },
              alignment: { horizontal: "center" },
            },
          },
          {
            value: checkPurpose.find((el) => el.value == item.checkPurpose)
              .label,
            style: {
              font: {
                sz: "14",
                color: {
                  rgb:
                    item.checkPurpose == 1
                      ? "673ab7"
                      : item.checkPurpose == 2
                      ? "5a2c3e"
                      : "f0b217",
                },
              },
              alignment: { horizontal: "center" },
            },
          },
          {
            value: item.notes,
            style: {
              font: {
                sz: "14",
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
