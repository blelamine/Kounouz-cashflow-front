import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Button, Input, Modal } from "rsuite";
import Pagination from "rsuite/Pagination";
import Swal from "sweetalert2";
import { APi } from "../../../Api/";
import { exportAddAtom } from "../../../Atoms/exportAdd.atom";
import ExportAdd from "../../../Components/Common/ExportAdd";
import Filter from "../../../Components/Common/Filter";
import Grid from "../../../Components/Grid";
import Responsive from "../../../Components/Responsive";
import validate from "../../../Helpers/validate";
import { Tier } from "../../../Models/TiersModels";
import AddEdit from "./AddEdit.component";
import UserModel from "../../../Models/UserModel";
import Label from "../../../Components/Label";
export default function CCA(props) {
  // STATE
  const [data, setdata] = useState([]);
  const [totalCount, settotalCount] = useState(0);
  const [filterModel, setfilterModel] = useState({
    q: "",
    page: 1,
    take: 20,
  });
  // --- add edit model ---
  const [error, setError] = useState("");
  const [model, setmodel] = useState(new Tier());
  const [show, setshow] = useState(0);

  const [userModel, setuserModel] = useState(new UserModel("CCA"));
  // ATOMS
  const [state, setstate] = useRecoilState(exportAddAtom);
  // HELPERS
  const reset = () => {
    setmodel(new Tier());
    setError("");
  };
  // API CALLS
  const fetch = () => {
    setstate((prev) => {
      return { ...prev, loading: true };
    });
    APi.createAPIEndpoint(APi.ENDPOINTS.CCA, filterModel)
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
        APi.createAPIEndpoint(APi.ENDPOINTS.CCA)
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
        APi.createAPIEndpoint(APi.ENDPOINTS.CCA)
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
    APi.createAPIEndpoint(APi.ENDPOINTS.CCA)
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
  useEffect(() => fetch(), []);
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
      </Filter>
      <ExportAdd
        title={model.id ? "Modifier Superviseur" : "Ajouter Superviseur"}
        noExport
        size="md"
        save={save}
        AddComponent={
          <AddEdit error={error} model={model} _setmodel={setmodel} />
        }
      />{" "}
      <Grid
        actions={[
          {
            label: "Créer Compte",
            action: (dataKey) => {
              let m = userModel;
              let cc = data.find((el) => el.id == dataKey);
              let _m = {
                ...m,
                ccaId: dataKey,
                firstName: cc.name,
                email: cc.emails ? cc.emails.split(",")[0] : "",
                phoneNumber: cc.phones ? cc.phones.split(",")[0] : "",
              };
              delete _m.id;
              setuserModel(_m);
              setshow(dataKey);
            },
            render: (v) => (
              <button
                style={{
                  color: "rgba(67,55,160,1)",
                  padding: "6px 10px",
                  fontSize: "12px",
                  background: "rgba(67,55,160,0.1)",
                  borderRadius: "4px",
                }}
              >
                {v}
              </button>
            ),
          },
        ]}
        editAction={(id) => {
          getBYId(id);

          setstate((prev) => {
            return { ...prev, open: true };
          });
        }}
        deleteAction={deleteAction}
        actionKey="id"
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
      {show ? (
        <Modal
          size="md"
          overflow={false}
          style={{ maxHeight: "calc(100vh - 50px)", overflow: "auto" }}
          open={show > 0}
          onClose={() => {
            setshow(0);
          }}
        >
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <div style={{ maxHeight: "calc(100vh - 240px)", overflow: "auto" }}>
              <Label required>Nom:</Label>
              <Input
                required
                onChange={(firstName) => {
                  setuserModel((prev) => {
                    return { ...prev, firstName };
                  });
                }}
                value={userModel.firstName}
              />
              <label>Email :</label>
              <Input
                type="email"
                value={userModel.email}
                onChange={(email) => {
                  setuserModel((prev) => {
                    return { ...prev, email };
                  });
                }}
              />
              <label>Télephone :</label>
              <Input
                value={userModel.phoneNumber}
                onChange={(phoneNumber) => {
                  setuserModel((prev) => {
                    return { ...prev, phoneNumber };
                  });
                }}
              />
              <Label required>Nom d'utilisateur:</Label>
              <Input
                name="username"
                onChange={(username) => {
                  setuserModel((prev) => {
                    return { ...prev, username };
                  });
                }}
                autoComplete="off"
              />
              <Label required>Nouveau Mot de passe :</Label>
              <Input
                name="password"
                onChange={(password) => {
                  setuserModel((prev) => {
                    return { ...prev, password };
                  });
                }}
                autoComplete="off"
              />
              <div style={{ fontSize: "13px", color: "#aaa" }}>
                <li>
                  Votre mot de passe doit comporter au moins 8 caractères, dont
                  des lettres majuscules et minuscules, des chiffres et des
                  symboles (ex: * , $ , @)
                </li>
              </div>{" "}
              <Button
                onClick={() => {
                  APi.createAPIEndpoint(
                    APi.ENDPOINTS.Accounts + "/withPosition"
                  )
                    .create(userModel)
                    .then((res) => {
                      setshow(0);
                      Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Element a été bien enregistré !",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                    })
                    .catch((e) => {});
                }}
                appearance="primary"
              >
                Enregistrer
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setshow(0);
              }}
              appearance="subtle"
            >
              Annuler
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        ""
      )}
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
