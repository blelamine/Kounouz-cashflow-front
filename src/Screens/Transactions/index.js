import MinusRoundIcon from "@rsuite/icons/MinusRound";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactExport from "react-data-export";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button, DatePicker, Input, SelectPicker, Tag } from "rsuite";
import Pagination from "rsuite/Pagination";
import Swal from "sweetalert2";
import { APi } from "../../Api";
import { ENDPOINTS } from "../../Api/enpoints";
import { CCAsAtom } from "../../Atoms/cca.atom";
import { exportAddAtom } from "../../Atoms/exportAdd.atom";
import { userAtom } from "../../Atoms/user.atom";
import ExportAdd from "../../Components/Common/ExportAdd";
import Filter from "../../Components/Common/Filter";
import Grid from "../../Components/Grid";
import Responsive from "../../Components/Responsive";
import ResumeCard from "../../Components/ResumeCard";
import {
  AuthorizationStatus,
  dateTypes,
  serviceTypes,
} from "../../Constants/types";
import format_number from "../../Helpers/number_formatter";
import { TransactionModel } from "../../Models/transactionModel";
import AddEdit from "./AddEdit.component";
import { multiDataSet } from "./excel_data";
import { multiDataSetSage } from "./sage.data.excel";

export default function Transactions(props) {
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

  // STATE
  const [excelSage, setexcelSage] = useState(false);
  const [data, setdata] = useState([]);
  const [totalCount, settotalCount] = useState(0);
  const [totalDebit, settotalDebit] = useState(0);
  const [totalCredit, settotalCredit] = useState(0);
  const [balance, setbalance] = useState(0);
  const [loadingAuth, setloadingAuth] = useState(0);
  const [loadingSAge, setloadingSAge] = useState(false);

  const [clients, setclients] = useState([]);
  const user = useRecoilValue(userAtom);
  const [filterModel, setfilterModel] = useState({
    q: "",
    page: 1,
    take: 20,
    service: 0,
    clientId: 0,
    representativeId: 0,
    checkoutId: 0,
    date: null,
    dateType: 0,
    status: 0,
    seasonId: 0,
  });
  const [checkouts, setcheckouts] = useState([]);
  const [dataExcel, setdataExcel] = useState([]);
  const [credit, setcredit] = useState(false);
  // --- add edit model ---
  const [error, setError] = useState("");
  const [model, setmodel] = useState(new TransactionModel());

  // ATOMS
  const [state, setstate] = useRecoilState(exportAddAtom);
  const ccas = useRecoilValue(CCAsAtom);

  // HELPERS
  const reset = () => {
    setmodel(new TransactionModel());
    setError("");
    setcredit(false);
  };
  const handleSageExport = () => {
    fetchforExcel(true);
  };
  // API CALLS
  const fetchClients = (q) => {
    if (typeof q == "undefined" || q.length > 2) {
      APi.createAPIEndpoint(APi.ENDPOINTS.Client, { q }, "/autocomplete")
        .customGet()
        .then((res) => setclients(res.data));
    }
  };
  const fetch = (_take) => {
    setstate((prev) => {
      return { ...prev, loading: true };
    });
    APi.createAPIEndpoint(APi.ENDPOINTS.Transaction, {
      ...filterModel,
      checkoutId: user.checkoutId ? user.checkoutId : filterModel.checkoutId,
      take: _take || filterModel.take,
    })
      .fetchAll()
      .then((res) => {
        if (_take) {
          if (filterModel.checkoutId) {
            setdataExcel(
              [
                {
                  debit: checkouts.find(
                    (c) =>
                      c.id == filterModel.checkoutId || c.id == user.checkoutId
                  ).beginBalance,
                  credit: 0,
                  representative: "-",
                  designation: "R.N",
                  date: "",
                },
              ].concat(res.data.data)
            );
          } else setdataExcel(res.data.data);

          document.querySelector("#hidden-btn-export").click();
        } else {
          setdata(res?.data?.data);
          setstate((prev) => {
            return { ...prev, loading: false };
          });
          settotalCount(res.data.totalCount);
          settotalCredit(res.data.totalCredit);
          settotalDebit(res.data.totalDebit);
          setbalance(res.data.balance);
        }
      })
      .catch((e) => {
        setError(e.Message);
        setstate((prev) => {
          return { ...prev, loading: false };
        });
      });
  };
  const fetchforExcel = (forSage = false) => {
    if (forSage) setloadingSAge(true);
    APi.createAPIEndpoint(
      APi.ENDPOINTS.Transaction,
      {
        ...filterModel,
        checkoutId: user.checkoutId ? user.checkoutId : filterModel.checkoutId,
      },
      "/forExcel"
    )
      .fetchAll()
      .then((res) => {
        settotalCredit(res.data.totalCredit);
        settotalDebit(res.data.totalDebit);
        if (filterModel.checkoutId || user.checkoutId) {
          let sp = checkouts.find(
            (c) => c.id == filterModel.checkoutId || c.id == user.checkoutId
          ).beginBalance;

          setdataExcel(
            [
              {
                debit: checkouts.find(
                  (c) =>
                    c.id == filterModel.checkoutId || c.id == user.checkoutId
                ).beginBalance,
                credit: 0,
                representative: "-",
                designation: "R.N",
                date: "",
              },
            ].concat(
              res.data.data.map((el) => {
                sp = sp + el.debit - el.credit;
                let accountingNumber = checkouts.find(
                  (c) => c.id == el.checkoutId
                ).accountingNumber;
                let code = checkouts.find((c) => c.id == el.checkoutId).code;
                return { ...el, sp, accountingNumber, code };
              })
            )
          );
        } else
          setdataExcel(
            res.data.data.map((el) => {
              let accountingNumber = checkouts.find(
                (c) => c.id == el.checkoutId
              ).accountingNumber;
              let code = checkouts.find((c) => c.id == el.checkoutId).code;
              return { ...el, sp: 0, accountingNumber, code };
            })
          );

        forSage
          ? document.querySelector("#hidden-btn-export2").click()
          : document.querySelector("#hidden-btn-export").click();
        setloadingSAge(false);
      })
      .catch((e) => {});
  };

  const save = () => {
    let msg = "";
    // validate(model, [{ checkoutId: "Caisse" }]);
    if (msg) setError(msg);
    else {
      setstate((prev) => {
        return { ...prev, loading: true };
      });
      if (model.id) {
        APi.createAPIEndpoint(APi.ENDPOINTS.Transaction)
          .update(model.id, {
            ...model,
            debit: Number(model.debit),
            credit: Number(model.credit),
          })
          .then((res) => {
            fetch();
            setstate((prev) => {
              return { ...prev, open: false, loading: false };
            });
            reset();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Élément a été bien modifié !",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((e) => {
            setError(e.Message);
            setstate((prev) => {
              return { ...prev, loading: false };
            });
          });
      } else {
        APi.createAPIEndpoint(APi.ENDPOINTS.Transaction)
          .create({
            ...model,
            debit: Number(model.debit),
            credit: Number(model.credit),
            checkoutId: user.checkoutId ? user.checkoutId : model.checkoutId,
          })
          .then((res) => {
            fetch();
            reset();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Element a été bien ajouté !",
              showConfirmButton: false,
              timer: 1500,
            });
            setstate((prev) => {
              return { ...prev, open: false, loading: false };
            });
          })
          .catch((e) => {
            setError(e.Message);

            setstate((prev) => {
              return { ...prev, loading: false };
            });
          });
      }
    }
  };
  const handleOpen = () => {
    setcredit(true);
    setstate((prev) => {
      return { ...prev, open: true };
    });
  };
  const deleteAction = (id) => {
    if (user.checkoutId) {
      alert("Vous n'êtes pas autorisés !!!");
    } else {
      APi.createAPIEndpoint(APi.ENDPOINTS.Transaction)
        .delete(id)

        .then((res) => {
          fetch();
          Swal.fire("Supprimé !", "", "Success");
        })
        .catch((e) => setError(e.Message));
    }
  };

  const fetchCheckouts = (q = "") => {
    APi.createAPIEndpoint(APi.ENDPOINTS.Checkout, { q, take: 100 })
      .customGet()
      .then((res) => setcheckouts(res.data.data));
  };
  const getBYId = (id) => {
    setError("");
    APi.createAPIEndpoint(APi.ENDPOINTS.Transaction)
      .fetchById(id)
      .then((res) => {
        let m = {
          ...res.data,
        };
        setmodel(m);
        if (m.credit) setcredit(true);
        else setcredit(false);
        if (res.data.client) {
          setclients([res.data.client]);
        }
      });
  };
  // LIFE CYCLES
  useEffect(() => {
    fetch();
  }, [filterModel.page, filterModel.take]);
  useEffect(() => {
    fetch();
    fetchCheckouts();
  }, [filterModel.page, filterModel.take]);
  // Grid Config
  const columns = [
    { value: "sequentialNumber", name: "N.P", render: (nb) => <h6>{nb}</h6> },
    {
      value: "date",
      name: "Date",
      value2: "authorizationStatus",
      value3: "givedAuthorizationBy",
      render: (v, v2, givedAuthorizationBy) => (
        <h6 style={{ fontSize: "12px" }}>
          {moment(v).format("DD MMM YYYY")}
          <br></br>
          {v2 && v2 != 1 ? (
            <Tag
              size="sm"
              color={v2 == 2 ? "yellow" : v2 == 3 ? "green" : "red"}
            >
              <i
                style={{
                  fontWeight: "300",
                  fontSize: "12px",
                }}
              >
                {AuthorizationStatus.find((el) => el.value == v2)
                  ? AuthorizationStatus.find((el) => el.value == v2).label
                  : "-"}
                <i
                  style={{
                    color: "#f1f1f1",
                    fontSize: "12px",
                    display: "block",
                    marginTop: 0,
                  }}
                >
                  {ccas &&
                  givedAuthorizationBy &&
                  ccas.find((el) => el.id == givedAuthorizationBy)
                    ? ccas.find((el) => el.id == givedAuthorizationBy).name
                    : ""}
                </i>
              </i>
            </Tag>
          ) : (
            ""
          )}
        </h6>
      ),
    },
    {
      value: "representative",
      name: "Représentant",
      render: (v) => (
        <b style={{ color: "#a90e43" }}>
          {v ? v.firstName.toUpperCase() : "-"}
        </b>
      ),
    },
    {
      value: "debit",
      name: "Débit",
      render: (v) => (
        <b style={{ fontSize: "14px", color: "#549f0a" }}>
          {v ? format_number(v) : ""}
        </b>
      ),
    },
    {
      value: "credit",
      name: "Crédit",
      render: (v) => (
        <b style={{ fontSize: "14px" }}>{v ? format_number(v) : ""}</b>
      ),
    },
    {
      value: "ref",
      name: "Référence",

      render: (v) => <span>{v}</span>,
    },
    {
      value: "designation",
      name: "designation",
      render: (v) => {
        return (
          <div
            style={{ maxWidth: "260px", overflow: "auto", fontSize: "13px" }}
          >
            {v}
          </div>
        );
      },
    },
    {
      value: "checkout",
      name: "Caisse",
      render: (v) => <b style={{ color: "#4c67c2" }}>{v ? v.name : "-"}</b>,
    },

    // {
    //   value: "client",
    //   name: "Client B2B",
    //   render: (v) => <a>{v ? v.name.toUpperCase() : "-"}</a>,
    // },

    //------------

    {
      value: "service",
      name: "Service",
      render: (v) =>
        v ? (
          <Tag
            color={
              v == 1
                ? "blue"
                : v == 2
                ? "green"
                : v == 3
                ? "violet"
                : v == 4
                ? "black"
                : "yellow"
            }
          >
            {serviceTypes.find((el) => el.value == v)
              ? serviceTypes.find((el) => el.value == v).label
              : "Autres"}
          </Tag>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div>
      <Filter search={() => fetch()}>
        <Responsive m={6} l={2} xl={2} className="p-5">
          <label>Recherche: </label>

          <Input
            placeholder="recherche"
            onChange={(q) => {
              setfilterModel((prev) => {
                return { ...prev, q };
              });
            }}
          />
        </Responsive>

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
          <Responsive m={6} l={3.6} xl={3.6} className="p-5">
            <label>Plage du temps: </label>
            <div>
              <Responsive m={6} l={6} xl={6} className="px-5">
                <DatePicker
                  style={{ display: "block" }}
                  // pattern="\d{2}-\d{2}-\d{4}"
                  // value={model.dateFrom ? new Date(model.dateFrom) : ""}
                  format="dd/MM/yyyy"
                  onChange={(dateFrom) => {
                    setfilterModel((prev) => {
                      return {
                        ...prev,
                        dateFrom,
                      };
                    });
                  }}
                />
              </Responsive>
              <Responsive m={6} l={6} xl={6} className="px-5">
                <DatePicker
                  style={{ display: "block" }}
                  // pattern="\d{2}-\d{2}-\d{4}"
                  //   value={model.dateTo ? new Date(model.dateTo) : ""}
                  format="dd/MM/yyyy"
                  onChange={(dateTo) => {
                    setfilterModel((prev) => {
                      return {
                        ...prev,
                        dateTo,
                      };
                    });
                  }}
                />
              </Responsive>
            </div>
          </Responsive>
        )}
        {/* <Responsive m={6} l={2.4} xl={2.4} className="p-5">
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
        </Responsive> */}
        {user && !user.checkoutId ? (
          <Responsive m={6} l={2.4} xl={2.4} className="p-5">
            <label>Caisse: </label>
            <SelectPicker
              data={[{ label: "Tout", value: 0 }].concat(
                checkouts.map((el) => {
                  return { value: el.id, label: el.name };
                })
              )}
              block
              noSearch
              value={filterModel.checkoutId}
              onSelect={(checkoutId) => {
                setfilterModel((prev) => {
                  return { ...prev, checkoutId };
                });
              }}
            />
          </Responsive>
        ) : (
          ""
        )}

        <Responsive m={6} l={2.4} xl={2.4} className="p-5">
          <label>Autorisation: </label>
          <SelectPicker
            searchable={false}
            data={AuthorizationStatus}
            block
            noSearch
            value={filterModel.status}
            onSelect={(status) => {
              setfilterModel((prev) => {
                return { ...prev, status };
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
      <ExportAdd
        actionExcel={() => {
          setexcelSage(false);
          fetchforExcel();
        }}
        btnAddTitle="Encaissement"
        btns={
          <span>
            <Button onClick={handleOpen} appearance="primary" color="yellow">
              <MinusRoundIcon color="" /> Décaissement
            </Button>
            <Button
              loading={loadingSAge}
              style={{ margin: "0 2px" }}
              onClick={() => {
                handleSageExport();
              }}
              appearance="primary"
              color="violet"
            >
              Sage
            </Button>
          </span>
        }
        title={!credit ? "Encaissement" : "Décaissement"}
        excelData={multiDataSet(
          dataExcel.filter(
            (el) =>
              el.authorizationStatus == 1 ||
              el.authorizationStatus == 3 ||
              !el.authorizationStatus
          ),
          totalDebit,
          totalCredit,
          (filterModel.checkoutId || user.checkoutId) &&
            checkouts &&
            checkouts.length
            ? checkouts.find(
                (c) => c.id == filterModel.checkoutId || c.id == user.checkoutId
              ).beginBalance
            : 0
        )}
        nameExcel="transactions"
        size="lg"
        save={save}
        noModify={model.id}
        ActionOnClose={reset}
        AddComponent={
          <AddEdit
            credit={credit}
            clients={clients}
            checkouts={checkouts}
            fetchClients={fetchClients}
            error={error}
            model={model}
            _setmodel={setmodel}
          />
        }
      />{" "}
      <div>
        <Responsive className="p-10" m={6} l={3} xl={3}>
          <ResumeCard
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
          <ResumeCard text="Balance" color="60,16,83" amount={balance} />
        </Responsive>
      </div>
      <Grid
        editAction={(id) => {
          getBYId(id);

          setstate((prev) => {
            return { ...prev, open: true };
          });
        }}
        deleteAction={deleteAction}
        actionKey="id"
        noAdvancedActions // for custom advanced actions
        columns={
          user && user.ccaId
            ? columns
                .slice(0, 3)
                .concat([
                  {
                    value: "id",
                    name: "-",
                    value2: "authorizationStatus",
                    render: (v, v2) => (
                      <span>
                        {v2 == 2 ? (
                          <>
                            {" "}
                            <Button
                              loading={loadingAuth == v}
                              appearance="ghost"
                              onClick={() => {
                                setloadingAuth(v);
                                APi.createAPIEndpoint(
                                  ENDPOINTS.Transaction +
                                    "/giveAuthorization/" +
                                    v
                                )
                                  .customGet()
                                  .then((res) => {
                                    setloadingAuth(0);
                                    fetch();
                                  })
                                  .catch((error) => setloadingAuth(0));
                              }}
                            >
                              autoriser
                            </Button>{" "}
                            <Button
                              loading={loadingAuth == v}
                              appearance="ghost"
                              color="red"
                              onClick={() => {
                                setloadingAuth(v);
                                APi.createAPIEndpoint(
                                  ENDPOINTS.Transaction + "/refuse/" + v
                                )
                                  .customGet()
                                  .then((res) => {
                                    setloadingAuth(0);
                                    fetch();
                                  })
                                  .catch((error) => setloadingAuth(0));
                              }}
                            >
                              refuser
                            </Button>
                          </>
                        ) : (
                          ""
                        )}
                      </span>
                    ),
                  },
                ])
                .concat(columns.slice(3))
            : columns
        }
        rows={data}
      />
      <div style={{ padding: 20, background: "#fff" }}>
        <Pagination
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="md"
          layout={["total", "-", "limit", "|", "pager", "skip"]}
          total={totalCount}
          limitOptions={[10, 20, 50, 100]}
          limit={filterModel.take}
          activePage={filterModel.page}
          onChangePage={(page) => {
            window.scrollTo(0, 0);
            setfilterModel((prev) => {
              return { ...prev, page };
            });
          }}
          onChangeLimit={(take) => {
            setfilterModel((prev) => {
              return { ...prev, take, page: 1 };
            });
          }}
        />
      </div>
      <ExcelFile
        key="147"
        filename={"Sage_Cashflow"}
        element={
          <button
            style={{
              width: "0",
              height: "0",
              opacity: 0,
              overflow: "hidden",
            }}
            type="button"
            id="hidden-btn-export2"
          >
            download
          </button>
        }
      >
        <ExcelSheet
          dataSet={multiDataSetSage(
            dataExcel.filter((el) => el.designation != "R.N")
          )}
          name={"Sage_Cashflow"}
        />
      </ExcelFile>
    </div>
  );
}
