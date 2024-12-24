import moment from "moment";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Button, DateRangePicker, Input, SelectPicker } from "rsuite";
import { APi } from "../../Api";
import { respresentatAtom } from "../../Atoms/representatives.atom";
import Filter from "../../Components/Common/Filter";
import Responsive from "../../Components/Responsive";
import ResumeCard from "../../Components/ResumeCard";
import { dateTypes, serviceTypes } from "../../Constants/types";
import format_number from "../../Helpers/number_formatter";

export default function CheckoutSummary(props) {
  // STATE
  const [data, setdata] = useState([]);
  const [details, setdetails] = useState([]);
  const [loading, setloading] = useState(false);

  const [clients, setclients] = useState([]);
  const representatives = useRecoilValue(respresentatAtom);
  const [filterModel, setfilterModel] = useState({
    service: 0,
    clientId: 0,
    representativeId: 0,
    date: null,
    dateType: 0,
  });

  // --- add edit model ---
  const [checkouts, setcheckouts] = useState([]);
  const [checkouts2, setcheckouts2] = useState([]);

  // API CALLS
  const fetchClients = (q, forFilter = true) => {
    if (typeof q == "undefined" || q.length > 2) {
      APi.createAPIEndpoint(APi.ENDPOINTS.Client, { q }, "/autocomplete")
        .customGet()
        .then((res) =>
          forFilter ? setclients(res.data) : setclients(res.data)
        );
    }
  };
  const fetch = () => {
    APi.createAPIEndpoint(APi.ENDPOINTS.Transaction + "/summary", filterModel)
      .fetchAll()
      .then((res) => {
        setdata(res.data);

        // settotalCount(res.data.totalCount);
        // settotalCredit(res.data.totalCredit);
        // settotalDebit(res.data.totalDebit);
      })
      .catch((e) => {});
  };

  const fetchCheckouts = (q = "") => {
    APi.createAPIEndpoint(APi.ENDPOINTS.Checkout, { q }, "/autocomplete")
      .customGet()
      .then((res) =>
        setcheckouts(
          res.data.map((el) => {
            return { value: el.id, label: el.name };
          })
        )
      );
  };
  const fetchDetails = (checkoutId) => {
    let m = { ...filterModel, checkoutId };
    delete m.service;
    setloading(true);
    APi.createAPIEndpoint(APi.ENDPOINTS.Transaction + "/summaryDetails", m)
      .fetchAll()
      .then((res) => {
        setdetails(res.data);
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
      });
  };
  // LIFE CYCLES
  useEffect(() => {
    fetch();
    fetchCheckouts();
    APi.createAPIEndpoint(APi.ENDPOINTS.Checkout)
      .customGet()
      .then((res) => setcheckouts2(res.data.data));
  }, []);

  return (
    <div>
      <Filter search={() => fetch()}>
        <Responsive m={6} l={2} xl={2} className="p-5">
          <label>Dates: </label>
          <SelectPicker
            data={dateTypes}
            block
            noSearch
            value={filterModel.dateType}
            onSelect={(dateType) => {
              let today = new Date(moment(Date.now()).format("yyyy-MM-DD"));

              setfilterModel((prev) => {
                return {
                  ...prev,
                  dateType,
                  date:
                    dateType == 7 || dateType == 1
                      ? today
                      : dateType == 2
                      ? moment(moment(Date.now()).add(-1, "d")).format(
                          "yyyy-MM-DD"
                        )
                      : null,
                  dateFrom:
                    dateType == 6
                      ? today
                      : dateType == 3
                      ? moment().startOf("month").format("yyyy-MM-DD")
                      : dateType == 4
                      ? moment(Date.now())
                          .subtract(1, "months")
                          .startOf("month")
                          .format("yyyy-MM-DD")
                      : dateType == 5
                      ? moment().startOf("year").format("yyyy-MM-DD")
                      : null,
                  dateTo:
                    dateType == 6
                      ? new Date(
                          moment(moment(Date.now()).add(1, "d")).format(
                            "yyyy-MM-DD"
                          )
                        )
                      : dateType == 3
                      ? today
                      : dateType == 4
                      ? moment(Date.now())
                          .subtract(1, "months")
                          .endOf("month")
                          .format("yyyy-MM-DD")
                      : null,
                };
              });
            }}
          />
        </Responsive>
        {filterModel.dateType == 7 && (
          <Responsive m={6} l={2.6} xl={2.6} className="p-5">
            <label>Date: </label>
            <Input
              type="date"
              value={filterModel.date}
              onChange={(date) => {
                setfilterModel((prev) => {
                  return { ...prev, date };
                });
              }}
            />
          </Responsive>
        )}
        {filterModel.dateType == 6 && (
          <Responsive m={6} l={2.6} xl={2.6} className="p-5">
            <label>Plage du temps: </label>
            <DateRangePicker
              block
              value={[filterModel.dateFrom, filterModel.dateTo]}
              onChange={(vs) => {
                setfilterModel((prev) => ({
                  ...prev,
                  dateFrom: vs[0],
                  dateTo: vs[1],
                }));
              }}
            />
          </Responsive>
        )}
        <Responsive m={6} l={2.4} xl={2.4} className="p-5">
          <label>Client: </label>
          <SelectPicker
            onSearch={(q) => fetchClients(q)}
            data={[{ label: "Tout", value: 0 }].concat(
              clients.map((c) => {
                return { label: c.name, value: c.id };
              })
            )}
            block
            noSearch
            value={filterModel.clientId}
            onSelect={(clientId) => {
              setfilterModel((prev) => {
                return { ...prev, clientId };
              });
            }}
          />
        </Responsive>

        <Responsive m={6} l={2.4} xl={2.4} className="p-5">
          <label>Service: </label>
          <SelectPicker
            searchable={false}
            data={[{ label: "Tout", value: 0 }].concat(serviceTypes)}
            block
            noSearch
            value={filterModel.service}
            onSelect={(service) => {
              setfilterModel((prev) => {
                return { ...prev, service };
              });
            }}
          />
        </Responsive>
      </Filter>

      {/* <div>
        <Responsive className="p-10" m={6} l={3} xl={3}>
          <ResumeCard
            // action={() => {
            //   fetchSummary2();
            //   setcolor("0,169,141");
            // }}
            text="Total"
            color="0,169,141"
            amount={totalCount}
            notAmount
          />
        </Responsive>
        <Responsive className="p-10" m={6} l={3} xl={3}>
          <ResumeCard
            text="Total Crédit"
            color="245,195,35"
            amount={totalCredit}
          />
        </Responsive>
        <Responsive className="p-10" m={6} l={3} xl={3}>
          <ResumeCard
            text="Total Débit"
            amount={totalDebit}
            color="229,57,53"
          />
        </Responsive>
        <Responsive className="p-10" m={6} l={3} xl={3}>
          <ResumeCard
            text="Balance"
            color="60,16,83"
            amount={totalCredit - totalDebit}
          />
        </Responsive>
      </div> */}
      <div>
        {data.map((ch) => (
          <Responsive l={6} xl={6} className="p-10" key={ch.checkoutId}>
            <div
              style={{
                padding: "8px",
                border: "1px dashed #121212",
                borderRadius: "10px",
                background: "#fff",
              }}
            >
              <h6 style={{ color: "090909" }}>
                {checkouts.find((c) => c.value == ch.checkoutId)
                  ? checkouts
                      .find((c) => c.value == ch.checkoutId)
                      .label.toUpperCase()
                  : ""}
              </h6>
              <Responsive className="p-10" m={6} l={6} xl={6}>
                <ResumeCard
                  // action={() => {
                  //   fetchSummary2();
                  //   setcolor("0,169,141");
                  // }}
                  text="Total"
                  color="0,169,141"
                  amount={ch.totalCount}
                  notAmount
                />
              </Responsive>
              <Responsive className="p-10" m={6} l={6} xl={6}>
                <ResumeCard
                  text="Total Crédit"
                  color="245,195,35"
                  amount={ch.totalCredit}
                />
              </Responsive>
              <Responsive className="p-10" m={6} l={6} xl={6}>
                <ResumeCard
                  text="Total Débit"
                  amount={ch.totalDebit}
                  color="229,57,53"
                />
              </Responsive>
              <Responsive className="p-10" m={6} l={6} xl={6}>
                <ResumeCard
                  text="Balance"
                  color="60,16,83"
                  amount={
                    checkouts2.find((el) => el.id == ch.checkoutId)
                      .beginBalance +
                    checkouts2.find((el) => el.id == ch.checkoutId).balance
                  }
                />
              </Responsive>
              <div>
                <Button
                  onClick={() => {
                    setdetails([]);
                    setfilterModel((prev) => ({
                      ...prev,
                      checkoutId: ch.checkoutId,
                    }));
                    fetchDetails(ch.checkoutId);
                  }}
                  appearance="ghost"
                  color="violet"
                  loading={loading && filterModel.checkoutId == ch.checkoutId}
                >
                  Détails
                </Button>
              </div>
              {filterModel.checkoutId == ch.checkoutId &&
                details &&
                details.length && (
                  <div
                    style={{
                      background: "#f5f5f5",
                      borderRadius: "8px",
                      padding: "6px",
                      marginTop: "8px",
                    }}
                  >
                    {details.map((el) => (
                      <div
                        style={{
                          background: "#fff",
                          borderRadius: "5px",
                          padding: "10px",
                          margin: "5px",
                          display: "inline-block",
                        }}
                      >
                        <h6
                          style={{
                            borderBottom: "1px solid #eee",
                            color: "#4c67c2",
                          }}
                        >
                          {serviceTypes.find((s) => s.value == el.service)
                            ? serviceTypes.find((s) => s.value == el.service)
                                .label
                            : "aurtres"}
                        </h6>
                        <div>
                          Total Débit : <b>{format_number(el.totalDebit)}</b>
                        </div>
                        <div>
                          Total Crédit : <b>{format_number(el.totalCredit)}</b>
                        </div>
                        <div
                          style={{
                            marginTop: "5px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          Balance :{" "}
                          <b
                            style={{
                              background:
                                el.totalDebit - el.totalCredit >= 0
                                  ? "rgb(0,169,141 , 0.1)"
                                  : "rgb(182,25,85,0.1)",
                              padding: "5px",
                              borderRadius: "5px",
                            }}
                          >
                            {format_number(el.totalDebit - el.totalCredit)}
                          </b>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </Responsive>
        ))}
      </div>
    </div>
  );
}
