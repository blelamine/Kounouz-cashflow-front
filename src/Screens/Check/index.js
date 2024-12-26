import ChangeListIcon from "@rsuite/icons/ChangeList";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AiFillReconciliation } from "react-icons/ai";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button, DatePicker, Input, Modal, SelectPicker, Tag } from "rsuite";
import Pagination from "rsuite/Pagination";
import Swal from "sweetalert2";
import { APi } from "../../Api/";
import { exportAddAtom } from "../../Atoms/exportAdd.atom";
import ExportAdd from "../../Components/Common/ExportAdd";
import Filter from "../../Components/Common/Filter";
import Grid from "../../Components/Grid";
import Responsive from "../../Components/Responsive";
import ResumeCard from "../../Components/ResumeCard";
import { checkPurpose, checkStatus } from "../../Constants/types";
import format_number from "../../Helpers/number_formatter";
import validate from "../../Helpers/validate";
import { CheckModel } from "../../Models/CheckModel";
import CheckHistoric from "./CheckHistoric";
import { multiDataSet } from "./excel_data";
import AddEditCheck from "./AddEditCheck.component";
import { CheckAtom } from "../../Atoms/check.atom";
export default function Check(props) {
  // STATE
  const [data, setdata] = useState([]);
  const [summary, setsummary] = useState([]);
  const [clients, setclients] = useState([]);
  const [clients2, setclients2] = useState([]);
  const [banks, setbanks] = useState([]);
  const [files, setfiles] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingsummary, setloadingsummary] = useState(false);
  // historic state
  const [color, setcolor] = useState("");
  const [summary2, setsummary2] = useState([]);
  const [open, setopen] = useState(false);
  const [historic, sethistoric] = useState("");
  const [date, setdate] = useState("");

  const [totalCount, settotalCount] = useState(0);
  const [filterModel, setfilterModel] = useState({
    page: 1,
    take: 20,
    clientId: 0,
    status: 0,
    type: 0,
    date: null,
  });
  // --- add edit model ---
  const [error, setError] = useState("");
  const [model, setModel] = useRecoilState(CheckAtom);
  // ATOMS
  const [state, setstate] = useRecoilState(exportAddAtom);
  // HELPERS
  const reset = () => {
    setModel(new CheckModel());
    setError("");
  };
  // API CALLS
  const fetchClients = (q, forFilter = true) => {
    if (typeof q == "undefined" || q.length > 2) {
      APi.createAPIEndpoint(APi.ENDPOINTS.Client, { q }, "/autocomplete")
        .customGet()
        .then((res) => {
          setclients(res.data);
          setclients2(res.data);
        });
    }
  };
  const fetchBanks = (q) => {
    if (typeof q == "undefined" || q.length > 2) {
      APi.createAPIEndpoint(APi.ENDPOINTS.Bank, { q }, "/autocomplete")
        .customGet()
        .then((res) => setbanks(res.data));
    }
  };
  const fetch = () => {
    setstate((prev) => {
      return { ...prev, loading: true };
    });
    setstate((prev) => {
      return { ...prev, loading: true };
    });
    APi.createAPIEndpoint(APi.ENDPOINTS.Check, {
      ...filterModel,
      date: filterModel.date
        ? moment(filterModel.date).format("DD MMM YYYY")
        : null,
    })
      .fetchAll()
      .then((res) => {
        setstate((prev) => {
          return { ...prev, loading: false };
        });
        setdata(res.data.data);
        setstate((prev) => {
          return { ...prev, loading: false };
        });
        settotalCount(res.data.totalCount);
      })
      .catch((e) => {
        setError(e.Message);
        setstate((prev) => {
          return { ...prev, loading: false };
        });
      });
  };
  const fetchSummary = () => {
    APi.createAPIEndpoint(APi.ENDPOINTS.Check + "/Summary", {
      ...filterModel,
      date: filterModel.date
        ? moment(filterModel.date).format("DD MMM YYYY")
        : null,
    })
      .fetchAll()
      .then((res) => {
        setsummary(res.data);
      })
      .catch((e) => setError(e.Message));
  };
  const fetchSummary2 = (status) => {
    setloadingsummary(true);
    APi.createAPIEndpoint(APi.ENDPOINTS.Check + "/Summary1", {
      ...filterModel,
      date: filterModel.date
        ? moment(filterModel.date).format("DD MMM YYYY")
        : null,
      status,
    })
      .fetchAll()
      .then((res) => {
        setloadingsummary(false);
        setsummary2(res.data);
      })
      .catch((e) => setloadingsummary(false));
  };
  const save = () => {
    let msg = validate(model, [
      { number: "Numéro" },
      { status: "Status" },
      { amount: "Montant" },
      // { date: "Date" },

      { checkPurpose: "Type de Chéque" },
      { clientId: "Client" },
    ]);
    if (msg) setError(msg);
    else {
      setstate((prev) => {
        return { ...prev, loading: true };
      });
      if (model.id) {
        delete model.client;
        delete model.depositBank;
        delete model.emmissionBank;

        APi.createAPIEndpoint(APi.ENDPOINTS.Check)
          .update(model.id, {
            ...model,
            amount: Number(model.amount),
            attachments: model.attachments ? model.attachments.join() : "",
            historic:
              model.status != 1 &&
              (!model.historic ||
                !eval("{data:[" + model.historic + "]}").find(
                  (el) => el.status == model.status
                ))
                ? // model.historic ?
                  // (
                  // !model.historic.includes("status:" + model.status)
                  // ?
                  (model.historic ? model.historic + "," : "") +
                  "{status:" +
                  model.status +
                  ",Date:" +
                  '"' +
                  moment(model.changeDate).format("DD/MM/yyyy") +
                  '"' +
                  "}"
                : //  : model.historic
                  // ):model.historic
                  model.historic,
            checkPartialPayments: model.checkPartialPayments
              ? model.checkPartialPayments.map((el) => {
                  delete el.id;
                  return el;
                })
              : [],
          })
          .then((res) => {
            fetch();
            reset();

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
        APi.createAPIEndpoint(APi.ENDPOINTS.Check)
          .create({
            ...model,
            amount: Number(model.amount),
            attachments: model.attachments.join(),
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
  const deleteAction = (id) => {
    APi.createAPIEndpoint(APi.ENDPOINTS.Check)
      .delete(id)

      .then((res) => {
        fetch();
        Swal.fire("Supprimé !", "", "success");
      })
      .catch((e) => setError(e.Message));
  };
  const getBYId = (id) => {
    setError("");
    APi.createAPIEndpoint(APi.ENDPOINTS.Check)
      .fetchById(id)
      .then((res) => {
        if (
          res.data.client &&
          !clients2.find((c) => c.id == res.data.client.id)
        ) {
          let arr = [...clients2];
          arr.unshift({ id: res.data.client.id, name: res.data.client.name });
          setclients2(arr);
        }
        let m = { ...res.data };
        setModel(m);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // LIFE CYCLES
  useEffect(() => {
    fetchClients();
    fetchBanks();
    fetchSummary();
  }, []);
  useEffect(() => {
    fetch();
  }, [filterModel.page, filterModel.take]);
  // UPLOAD ACTIONS
  const upload = (list, file, fileKey) => {
    if (!files.length) {
      setloading(true);
      APi.createAPIEndpoint(APi.ENDPOINTS.File)
        .upload(file)
        .then((res) => {
          setloading(false);

          let i = list.findIndex((el) => el.fileKey == fileKey);
          setfiles((prev) => {
            let items = [...list];
            items[i].status = "finished";
            return items;
          });
          setModel((prev) => {
            return { ...model, attachments: res.data[0].name };
          });
        })
        .catch((error) => {
          setloading(false);

          let i = list.findIndex((el) => el.fileKey == fileKey);
          setfiles((prev) => {
            let items = [...list];
            items[i].status = "error";
            return items;
          });
        });
    }
  };
  const _delete = (fileKey) => {
    let i = files.findIndex((el) => el.fileKey == fileKey);
    APi.createAPIEndpoint(APi.ENDPOINTS.File)
      .delete(files[i].name)
      .then((res) => {
        setfiles((prev) => {
          let items = [...prev];
          items.splice(i);
          return items;
        });
        let attachments = [...model.attachments];
        attachments.splice(i);
        setModel((prev) => {
          return { ...model, attachments };
        });
      })
      .catch((error) => {});
  };
  const columns = [
    {
      value: "number",
      name: "Numéro",
      value2: "id",
      render: (v, id) => (
        <b>
          <a
            onClick={() => {
              getBYId(id);
              setstate((prev) => {
                return { ...prev, open: true };
              });
            }}
          >
            {v}
          </a>
        </b>
      ),
    },
    {
      value: "client",
      value2: "b2CName",
      name: "Client",
      render: (v, v2) => (
        <a>
          {v ? v.name : "-"}
          {v2 ? (
            <>
              <br></br>
              <i style={{ color: "#777" }}>{v2}</i>
            </>
          ) : (
            ""
          )}{" "}
        </a>
      ),
    },
    {
      value: "owner",
      name: "Tireur / Proprietaire",
      render: (v) => <a style={{ fontSize: "14px" }}>{v ? v : "-"}</a>,
    },
    {
      value: "amount",
      name: "Montant",
      render: (v) => <b style={{ fontSize: "14px" }}>{format_number(v)}</b>,
    },
    {
      value: "depositBank",
      name: "Banque de Dépôt",
      render: (v) => <b style={{ fontSize: "13px" }}>{v ? v.name : ""}</b>,
    },

    {
      value: "depositDate",
      name: "Date De Dépôt",
      render: (v) => <Tag>{moment(v).format("DD MMM YYYY")}</Tag>,
    },
    {
      value: "emmissionBank",
      name: "Banque d'Emission",
      render: (v) => (
        <b style={{ color: "green", fontSize: "13px" }}>{v ? v.name : ""}</b>
      ),
    },
    {
      value: "status",
      name: "Status",
      render: (v) => (
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
          {checkStatus.find((el) => el.value == v).label}
        </Tag>
      ),
    },
    {
      value: "checkPurpose",
      name: "Type",
      render: (v) => (
        <Tag color={v == 1 ? "" : v == 2 ? "green" : ""}>
          {checkPurpose.find((el) => el.value == v).label}
        </Tag>
      ),
    },

    // {
    //   value: "notes",
    //   name: "Notes",
    //   render: (v) => {
    //     return (
    //       <div
    //         style={{
    //           maxWidth: "260px",
    //           padding: "10px",
    //           textOverflow: "ellipsis",
    //           overflow: "hidden",
    //           whiteSpace: "nowrap",
    //         }}
    //       >
    //         {v}
    //       </div>
    //     );
    //   },
    // },
    {
      value: "historic",
      value2: "depositDate",
      name: "",
      render: (v, v2) => (
        <>
          <Button
            disabled={!v}
            onClick={() => {
              setopen(true);
              sethistoric(v);
              setdate(v2);
            }}
          >
            <ChangeListIcon></ChangeListIcon>
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Filter
        search={() => {
          fetch();
          fetchSummary();
        }}
      >
        <Responsive l={2.4} xl={2.4} className="p-10">
          <label>Numéro: </label>

          <Input
            placeholder="recherche"
            onChange={(q) => {
              setfilterModel((prev) => {
                return { ...prev, q };
              });
            }}
          />
        </Responsive>
        <Responsive m={6} l={2.4} xl={2.4} className="p-10">
          <label>Date De Dépôt: </label>
          <DatePicker
            placement="bottomStart"
            value={filterModel.date}
            onChange={(date) =>
              setfilterModel((prev) => {
                return { ...prev, date };
              })
            }
            onSelect={(date) =>
              setfilterModel((prev) => {
                return { ...prev, date };
              })
            }
            block
          />
        </Responsive>
        <Responsive m={6} l={2.4} xl={2.4} className="p-10">
          <label>Client: </label>
          <SelectPicker
            onSearch={(q) => fetchClients(q)}
            data={clients?.map((c) => {
              return { label: c.name, value: c.id };
            })}
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
        <Responsive m={6} l={2.4} xl={2.4} className="p-10">
          <label>Status: </label>
          <SelectPicker
            searchable={false}
            data={[{ label: "Tout", value: 0 }].concat(checkStatus)}
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

        <Responsive m={6} l={2.4} xl={2.4} className="p-10">
          <label>Type: </label>
          <SelectPicker
            searchable={false}
            data={[{ label: "Tout", value: 0 }].concat(checkPurpose)}
            block
            noSearch
            value={filterModel.type}
            onSelect={(type) => {
              setfilterModel((prev) => {
                return { ...prev, type };
              });
            }}
          />
        </Responsive>
      </Filter>
      <ExportAdd
        excelData={multiDataSet(data)}
        nameExcel="check"
        size="md"
        save={save}
        ActionOnClose={reset}
        AddComponent={
          <AddEditCheck
            upload={upload}
            error={error}
            banks={banks.map((el) => {
              return { label: el.name, value: el.id };
            })}
            _delete={_delete}
            fetchBanks={fetchBanks}
            clients={clients}
            fetchClients={(q) => fetchClients(q, false)}
          />
        }
      />
      <div>
        <Responsive className="p-10" xs={6} s={6} m={6} l={2.4} xl={2.4}>
          <ResumeCard
            action={() => {
              fetchSummary2();
              setcolor("0,169,141");
            }}
            text="Total"
            color="0,169,141"
            amount={summary.length && summary.find((el) => el.id < 0).amount}
          />
        </Responsive>
        <Responsive className="p-10" xs={6} s={6} m={6} l={2.4} xl={2.4}>
          <ResumeCard
            action={() => {
              fetchSummary2(8);
              setcolor("245,195,35");
            }}
            text="Total Payé En éspeces"
            color="245,195,35"
            amount={
              summary.length &&
              summary.find((el) => el.id == 8) &&
              summary.find((el) => el.id == 8).amount
            }
          />
        </Responsive>
        <Responsive className="p-10" xs={6} s={6} m={6} l={2.4} xl={2.4}>
          <ResumeCard
            action={() => {
              fetchSummary2(1);
              setcolor("229,57,53");
            }}
            text="Total En Coffre"
            amount={
              summary.length &&
              summary.find((el) => el.id == 1) &&
              summary.find((el) => el.id == 1).amount
            }
            color="229,57,53"
          />
        </Responsive>
        <Responsive className="p-10" xs={6} s={6} m={6} l={2.4} xl={2.4}>
          <ResumeCard
            action={() => {
              fetchSummary2(2);
              setcolor("84,159,10");
            }}
            text="Total Remis à l'Encaissement"
            amount={
              summary.length &&
              summary.find((el) => el.id == 2) &&
              summary.find((el) => el.id == 2).amount
            }
            color="84,159,10"
          />
        </Responsive>
        <Responsive className="p-10" xs={6} s={6} m={6} l={2.4} xl={2.4}>
          <ResumeCard
            action={() => {
              fetchSummary2(3);
              setcolor("70,103,209");
            }}
            text="Total Encaissé"
            amount={
              summary.length &&
              summary.find((el) => el.id == 3) &&
              summary.find((el) => el.id == 3).amount
            }
          />
        </Responsive>
      </div>
      <Grid
        loading={state.loading}
        editAction={(id) => {
          getBYId(id);

          setstate((prev) => {
            return { ...prev, open: true };
          });
        }}
        deleteAction={deleteAction}
        actionKey="id"
        noAdvancedActions // for custom advanced actions
        columns={columns}
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
      <CheckHistoric
        open={open}
        date={date}
        historic={historic}
        handleClose={() => {
          reset();
          setopen(false);
        }}
      />
      {/* <Resume
        data={summary2}
        color={color}
        open={color.length > 0}
        handleClose={() => setcolor("")}
      /> */}
    </div>
  );
}

const Resume = ({ color = "70,103,209", open, handleClose, data = [] }) => {
  return (
    <Modal size="md" overflow={false} open={open} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>Détails</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {points.map((p, i) => (
          <div className="p-5">
            <ResumeCard
              key={i}
              radius={4}
              icon={<AiFillReconciliation />}
              text={p.label}
              color={color}
              amount={
                data.find((el) => el.id == p.value)
                  ? data.find((el) => el.id == p.value).amount
                  : 0
              }
            />
          </div>
        ))} */}
      </Modal.Body>
    </Modal>
  );
};
