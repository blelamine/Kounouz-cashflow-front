import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Input } from "rsuite";
import Pagination from "rsuite/Pagination";
import Swal from "sweetalert2";
import { APi } from "../../Api/";
import { exportAddAtom } from "../../Atoms/exportAdd.atom";
import ExportAdd from "../../Components/Common/ExportAdd";
import Filter from "../../Components/Common/Filter";
import Grid from "../../Components/Grid";
import validate from "../../Helpers/validate";
import AddEdit from "./addEdit.component";
export default function ServiceTypes(props) {
  // STATE
  const [data, setdata] = useState([]);
  const [totalCount, settotalCount] = useState(0);
  const [filterModel, setfilterModel] = useState({ q: "", page: 1, take: 20 });
  // --- add edit model ---
  const [error, setError] = useState("");
  const [model, setmodel] = useState({ name: "" });

  // ATOMS
  const [state, setstate] = useRecoilState(exportAddAtom);
  // HELPERS
  const reset = () => {
    setmodel({ name: "" });
    setError("");
  }; // API CALLS
  const fetch = () => {
    setstate((prev) => {
      return { ...prev, loading: true };
    });
    APi.createAPIEndpoint(APi.ENDPOINTS.ServiceType, filterModel)
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
    let msg = validate(model, [{ name: "Nom" }]);
    if (msg) setError(msg);
    else {
      setstate((prev) => {
        return { ...prev, loading: true };
      });
      if (model.id) {
        APi.createAPIEndpoint(APi.ENDPOINTS.ServiceType)
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
        APi.createAPIEndpoint(APi.ENDPOINTS.ServiceType)
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
    APi.createAPIEndpoint(APi.ENDPOINTS.ServiceType)
      .delete(id)

      .then((res) => {
        fetch();
        Swal.fire("Supprimé !", "", "success");
      })
      .catch((e) => setError(e.Message));
  };
  const getBYId = (id) => {
    setmodel(data.find((el) => el.id == id));
    setError("");
  };
  // LIFE CYCLES
  useEffect(() => fetch(), []);
  return (
    <div>
      <Filter search={() => fetch()}>
        {" "}
        <div className="p-10">
          {" "}
          <Input
            placeholder="recherche"
            onChange={(q) => {
              setfilterModel((prev) => {
                return { ...prev, q };
              });
            }}
          />
        </div>
      </Filter>
      <ExportAdd
        size="md"
        noExport
        save={save}
        AddComponent={
          <AddEdit error={error} model={model} _setmodel={setmodel} />
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
              return { ...prev, take };
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
];

const fakeData = [
  {
    id: 1,
    name: "Dinar",
  },
];
