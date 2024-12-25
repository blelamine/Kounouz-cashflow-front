import moment from "moment";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Input, SelectPicker, Tag } from "rsuite";
import Pagination from "rsuite/Pagination";
import Swal from "sweetalert2";
import { APi } from "../../Api/";
import { exportAddAtom } from "../../Atoms/exportAdd.atom";
import ExportAdd from "../../Components/Common/ExportAdd";
import Filter from "../../Components/Common/Filter";
import Grid from "../../Components/Grid";
import Responsive from "../../Components/Responsive";
import { paymentType } from "../../Constants/types";
import validate from "../../Helpers/validate";
import { ClientModel } from "../../Models/TiersModels";
import { multiDataSet } from "./excel_data";
import PageEndIcon from "@rsuite/icons/PageEnd";
import { PaymentModel } from "../../Models/SaleModels";
import AddEditPayment from "./AddEditPayment.component";

export default function Payment(props) {
  // STATE
  const [data, setdata] = useState([]);
  const [totalCount, settotalCount] = useState(0);
  const [clients, setclients] = useState([]);
  const [filterModel, setfilterModel] = useState({
    q: "",
    page: 1,
    take: 20,
  });
  // --- add edit model ---
  const [error, setError] = useState("");
  const [model, setmodel] = useState(new PaymentModel());

  // ATOMS
  const [state, setstate] = useRecoilState(exportAddAtom);
  // HELPERS
  const reset = () => {
    setmodel(new PaymentModel());
    setError("");
  };
  // API CALLS
  const fetchClients = (q, forFilter = true) => {
    if (typeof q == "undefined" || q.length > 2) {
      APi.createAPIEndpoint(APi.ENDPOINTS.Client, { q }, "/autocomplete")
        .customGet()
        .then((res) => {
          console.log(res.data, "clients");
          forFilter ? setclients(res.data) : setclients(res.data);
        });
    }
  };
  const fetch = () => {
    setstate((prev) => {
      return { ...prev, loading: true };
    });
    APi.createAPIEndpoint(APi.ENDPOINTS.Payment, filterModel)
      .fetchAll()
      .then((res) => {
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
  useEffect(() => {
    fetch();
  }, [filterModel.page, filterModel.take]);
  const save = () => {
    let msg = validate(model, [{ clientId: "Client" }, { amount: "Montant" }]);
    if (msg) setError(msg);
    else {
      setstate((prev) => {
        return { ...prev, loading: true };
      });

      if (model.id) {
        APi.createAPIEndpoint(APi.ENDPOINTS.Payment)
          .update(model.id, { ...model, amount: Number(model.amount) })
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
        APi.createAPIEndpoint(APi.ENDPOINTS.Payment)
          .create({ ...model, amount: Number(model.amount) })
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
    APi.createAPIEndpoint(APi.ENDPOINTS.Payment)
      .delete(id)

      .then((res) => {
        fetch();
        Swal.fire("Supprimé !", "", "success");
      })
      .catch((e) => setError(e.Message));
  };
  const getBYId = (id) => {
    setError("");
    APi.createAPIEndpoint(APi.ENDPOINTS.Payment)
      .fetchById(id)
      .then((res) => {
        setmodel(res.data);
        if (res.data.client) {
          setclients([res.data.client]);
        }
      });
  };
  // LIFE CYCLES
  useEffect(() => {
    fetch();
  }, [filterModel.page, filterModel.take]);
  return (
    <div>
      <Filter search={() => fetch()}>
        <Responsive
          //  m={6} l={6} xl={6}
          className="p-10"
        >
          <label>Nom: </label>

          <Input
            placeholder="recherche"
            onChange={(q) => {
              setfilterModel((prev) => {
                return { ...prev, q };
              });
            }}
          />
        </Responsive>
      </Filter>
      <ExportAdd
        // excelData={multiDataSet(data)}
        nameExcel="payments"
        size="md"
        save={save}
        ActionOnClose={reset}
        AddComponent={
          <AddEditPayment
            clients={clients}
            fetchClients={fetchClients}
            error={error}
            model={model}
            _setmodel={setmodel}
          />
        }
      />{" "}
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
    </div>
  );
}

const columns = [
  {
    value: "id",
    name: "Identifiant",
    render: (v) => <h5>{v}</h5>,
  },
  {
    value: "account",
    name: "Client",
    render: (v) => <a>{v ? v.name.toUpperCase() : "-"}</a>,
  },

  {
    value: "amount",
    name: "Montant",
    render: (v) => <b>{v.toFixed(3)}</b>,
  },
  {
    value: "date",
    name: "Date de Dépôt",
    render: (v) => (
      <h6 style={{ fontSize: "12px" }}>{moment(v).format("DD MMM YYYY")}</h6>
    ),
  },
  //------------

  {
    value: "type",
    name: "Type",
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
        {paymentType.find((el) => el.value == v).label}
      </Tag>
    ),
  },
  {
    value: "check",
    name: "N° Chéque",
    render: (v) => <b>{v ? v : "-"}</b>,
  },
  {
    value: "checkout",
    name: "Caisse",
    render: (v) => <b>{v ? v : "-"}</b>,
  },
  {
    name: "Virement",
    value: "depositBank",
    value2: "emissionBank",
    render: (v, v2) => (
      <>
        <b>
          {v2 ? (
            <>
              {" "}
              {v2} <PageEndIcon />
            </>
          ) : (
            "-"
          )}
        </b>{" "}
        <b>{v ? v : "-"}</b>
      </>
    ),
  },

  {
    value: "notes",
    name: "Notes",
    render: (v) => {
      return <div style={{ maxWidth: "260px", overflow: "auto" }}>{v}</div>;
    },
  },
];
