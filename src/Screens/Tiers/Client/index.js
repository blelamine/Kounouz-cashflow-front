import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Input } from "rsuite";
import Pagination from "rsuite/Pagination";
import Swal from "sweetalert2";
import { APi } from "../../../Api/";
import { agencyAtoms } from "../../../Atoms/agencies.atom";
import { exportAddAtom } from "../../../Atoms/exportAdd.atom";
import ExportAdd from "../../../Components/Common/ExportAdd";
import Filter from "../../../Components/Common/Filter";
import Grid from "../../../Components/Grid";
import Responsive from "../../../Components/Responsive";
import validate from "../../../Helpers/validate";
import { ClientModel } from "../../../Models/TiersModels";
import AddEdit from "./AddEdit.component";
import { multiDataSet } from "./excel_data";
export default function Client(props) {
  // STATE
  const [data, setdata] = useState([]);
  const [totalCount, settotalCount] = useState(0);
  const [agencies, setagencies] = useRecoilState(agencyAtoms);

  const [filterModel, setfilterModel] = useState({
    page: 1,
    take: 1020,
    q: "",
  });
  // --- add edit model ---
  const [error, setError] = useState("");
  const [model, setmodel] = useState(new ClientModel());

  // ATOMS
  const [state, setstate] = useRecoilState(exportAddAtom);
  // HELPERS
  const reset = () => {
    setmodel(new ClientModel());
    setError("");
  };

  // API CALLS
  const fetch = () => {
    setstate((prev) => {
      return { ...prev, loading: true };
    });
    APi.createAPIEndpoint(APi.ENDPOINTS.Client, filterModel)
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
  const save = () => {
    let msg = validate(model, [
      { name: "Nom" },
      // { code: "Code" },
      { taxCode: "Tax Code" },
    ]);
    if (msg) setError(msg);
    else {
      setstate((prev) => {
        return { ...prev, loading: true };
      });
      if (model.id) {
        APi.createAPIEndpoint(APi.ENDPOINTS.Client)
          .update(model.id, model)
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
        APi.createAPIEndpoint(APi.ENDPOINTS.Client)
          .create(model)
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
    APi.createAPIEndpoint(APi.ENDPOINTS.Client)
      .delete(id)

      .then((res) => {
        fetch();
        Swal.fire("Supprimé !", "", "success");
      })
      .catch((e) => setError(e.Message));
  };
  const getBYId = (id) => {
    setError("");

    setmodel(data.find((el) => el.id == id));
  };
  // LIFE CYCLES
  useEffect(() => {
    fetch();
  }, [filterModel.page, filterModel.take]);
  return (
    <div>
      <Filter search={() => fetch()}>
        <Responsive className="p-10">
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
        {/* <Responsive m={6} l={6} xl={6} className="p-10">
          <label>Type de Client :</label>
          <SelectPicker
            searchable={false}
            data={[{ label: "Tout", value: 0 }].concat(clientTypes)}
            block
            noSearch
            value={filterModel.clientType}
            onSelect={(clientType) => {
              setfilterModel((prev) => {
                return { ...prev, clientType };
              });
            }}
          />
        </Responsive> */}
      </Filter>
      <ExportAdd
        title={model.id ? "Modifier Client" : "Ajouter Client"}
        ActionOnClose={reset}
        excelData={multiDataSet(data)}
        nameExcel="client"
        size="md"
        save={save}
        AddComponent={
          <AddEdit
            agencies={agencies}
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
    value: "name",
    name: "Nom",
    render: (v) => <a>{v}</a>,
  },

  {
    value: "taxCode",
    name: "Code Tax",
    render: (v) => <b style={{ color: "green" }}>{v}</b>,
  },
  {
    value: "address",
    name: "Adresse",
    render: (v) => <i style={{ color: "#232323" }}>{v}</i>,
  },
  {
    value: "emails",
    name: "Emails",
    render: (v) => {
      return (
        <div style={{ maxWidth: "260px", overflow: "auto" }}>
          {v &&
            v.split(",").map((k, i) => (
              <a
                href={"mailto:" + k}
                style={{
                  display: "inline-block",
                  margin: "5px",
                  border: "1px solid rgba(93,120,255,0.2)",
                  borderRadius: "3px",
                  padding: "3px 4px",
                }}
              >
                {k}
              </a>
            ))}
        </div>
      );
    },
  },

  {
    value: "phones",
    name: "Numéros de téléphones",
    render: (v) => {
      return (
        <div style={{ maxWidth: "260px", overflow: "auto" }}>
          {v &&
            v.split(",").map((k, i) => (
              <a
                href={"tel:" + k}
                style={{
                  color: "rgba(11,150,102,1)",
                  display: "inline-block",
                  margin: "5px",
                  border: "1px solid rgba(11,150,102,0.2)",
                  borderRadius: "3px",
                  padding: "3px 4px",
                }}
              >
                {k}
              </a>
            ))}
        </div>
      );
    },
  },
];
