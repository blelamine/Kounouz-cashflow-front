import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  Button,
  IconButton,
  Input,
  Message,
  SelectPicker,
  TagInput,
} from "rsuite";
import Swal from "sweetalert2";
import { APi } from "../../Api";
import Responsive from "../../Components/Responsive";
import { paymentType, serviceTypes } from "../../Constants/types";
import validate from "../../Helpers/validate";
import { CheckModel } from "../../Models/CheckModel";
import { default as AddCheck } from "../Check/AddEdit.component";
import PlusRoundIcon from "@rsuite/icons/PlusRound";

function AddEdit({ _setmodel, model, clients, fetchClients }) {
  const [checks, setchecks] = useState([]);
  // const [model, setmodel] = useRecoilState(saleSate);
  const [banks, setbanks] = useState([]);
  const [checkouts, setcheckouts] = useState([]);
  const [AddElement, showAddElement] = useState(false);
  const [_checkModel, set_checkModel] = useState(new CheckModel());
  const [errorcheck, seterrorcheck] = useState("");
  const [files, setfiles] = useState([]);
  const [loading, setloading] = useState(false);

  // HELPERS
  const resetCheckModel = () => {
    set_checkModel(new CheckModel());
    seterrorcheck("");
  };
  // UPLOAD ACTIONS
  const upload = (list, file, fileKey) => {
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
        let attachments = [..._checkModel.attachments];
        attachments.push(res.data[0].fileName);
        set_checkModel((prev) => {
          return { ..._checkModel, attachments };
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

        let attachments = [..._checkModel.attachments];
        attachments.splice(i);
        set_checkModel((prev) => {
          return { ..._checkModel, attachments };
        });
      })
      .catch((error) => {});
  };
  //------------------ Saving Events -------------------------
  const save = () => {
    let msg = validate(_checkModel, [
      { number: "Numéro" },
      //    { status: "Status" },
      { amount: "Montant" },
      // { date: "Date de Dépôt" },
      // { date: "Date" },

      //    { checkPurpose: "Type de Chéque" },
      // { clientId: "Client" },
    ]);
    if (msg) seterrorcheck(msg);
    else {
      APi.createAPIEndpoint(APi.ENDPOINTS.Check + "/CreateFromRecov")
        .create({
          ..._checkModel,
          amount: Number(_checkModel.amount),
          attachments:
            _checkModel.attachments && _checkModel.attachments.join(),
          clientId: model.clientId,
        })
        .then((res) => {
          _setmodel((prev) => {
            return { ...prev, checkId: res.data.id };
          });
          fetchChecks(_checkModel.number);
          resetCheckModel();
          showAddElement(false);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Element a été bien ajouté !",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((e) => {
          seterrorcheck(e.response.data);
        });
    }
  };
  //___________________________________
  const fetchChecks = (q = "", clientId = 0) => {
    APi.createAPIEndpoint(
      APi.ENDPOINTS.Check,
      { q, clientId: clientId ? clientId : model.clientId },
      "/autocomplete"
    )
      .customGet()
      .then((res) =>
        setchecks(
          res.data.map((el) => {
            return { value: el.id, label: el.name };
          })
        )
      );
  };
  const fetchBanks = (q = "") => {
    APi.createAPIEndpoint(APi.ENDPOINTS.Bank, { q }, "/autocomplete")
      .customGet()
      .then((res) =>
        setbanks(
          res.data.map((el) => {
            return { value: el.id, label: el.name };
          })
        )
      );
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
  useEffect(() => {
    fetchChecks();
    fetchBanks();
    fetchCheckouts();
  }, []);
  return (
    <>
      {/* <Responsive m={6} l={6} xl={6} className="p-10">
        <label>Service : </label>
        <SelectPicker
          data={serviceTypes}
          block
          noSearch
          value={model.service}
          onSelect={(service) => {
            _setmodel((prev) => {
              return { ...prev, service };
            });
          }}
        />
      </Responsive> */}
      <Responsive m={6} l={6} xl={6} className="p-10">
        <label>Client:</label>
        <SelectPicker
          onSearch={(q) => fetchClients(q)}
          data={[{ label: "Tout", value: 0 }].concat(
            clients.map((c) => {
              return { label: c.name, value: c.id };
            })
          )}
          block
          noSearch
          value={model.clientId}
          onSelect={(clientId) => {
            fetchChecks("", clientId);
            _setmodel((prev) => {
              return { ...prev, clientId };
            });
          }}
        />
      </Responsive>
      <Responsive m={6} l={6} xl={6} className="p-10">
        <label>Montant:</label>
        <Input
          type="number"
          step="0.1"
          value={model.amount}
          onChange={(amount) => {
            _setmodel((prev) => {
              return { ...prev, amount };
            });
          }}
        />
      </Responsive>
      <Responsive m={6} l={6} xl={6} className="p-10">
        <label>Type De Paiment : </label>
        <SelectPicker
          data={paymentType}
          block
          noSearch
          value={model.type}
          onSelect={(type) => {
            _setmodel((prev) => {
              let m = { ...prev };
              if (type != 1) delete m.checkId;
              if (type != 2) delete m.checkoutId;
              if (type != 4) delete m.bankId;
              return { ...m, type };
            });
          }}
        />
      </Responsive>
      <Responsive m={6} l={6} xl={6} className="p-10">
        <label>Date:</label>
        <Input
          type="date"
          value={model.date}
          onChange={(date) => {
            _setmodel((prev) => {
              return { ...prev, date };
            });
          }}
        />
      </Responsive>
      <Responsive className="p-10">
        <label>Réf Réglement:</label>
        <Input
          value={model.refReglement}
          onChange={(refReglement) => {
            _setmodel((prev) => {
              return { ...prev, refReglement };
            });
          }}
        />
      </Responsive>
      <Responsive s={6} m={6} l={9} xl={9} className="p-10">
        <label>Notes:</label>
        <Input
          value={model.notes}
          onChange={(notes) => {
            _setmodel((prev) => {
              return { ...prev, notes };
            });
          }}
        />
      </Responsive>
      <Responsive s={6} m={6} l={3} xl={3} className="p-10">
        <label>
          {model.type == 1 ? "Chéque" : model.type == 4 ? "Banque" : "Caisse"}
        </label>
        <div
          style={{
            display: "inline-block",
            width: model.type == 1 ? "calc(100% - 40px)" : "100%",
            paddingRight: "5px",
          }}
        >
          {" "}
          <SelectPicker
            renderMenuItem={(e) => (
              <>
                {e.split(" ")[0]}
                <span
                  style={{
                    paddingLeft: "8px",
                    color: "#aaa",
                    fontSize: "12px",
                  }}
                >
                  {e.split(" ")[1]}
                </span>
              </>
            )}
            block
            data={
              model.type == 1 ? checks : model.type == 4 ? banks : checkouts
            }
            noSearch
            value={
              model[
                model.type == 1
                  ? "checkId"
                  : model.type == 4
                  ? "bankId"
                  : "checkoutId"
              ]
            }
            onSearch={(q) => fetchChecks(q)}
            onSelect={(v) => {
              _setmodel((prev) => {
                return {
                  ...prev,
                  [model.type == 1
                    ? "checkId"
                    : model.type == 4
                    ? "bankId"
                    : "checkoutId"]: v,
                };
              });
            }}
          />
        </div>
        {model.type == 1 && (
          <IconButton
            size="sm"
            onClick={() => showAddElement(true)}
            icon={<PlusRoundIcon />}
          ></IconButton>
        )}
      </Responsive>
      {model.type == 4 && (
        <Responsive s={6} m={6} l={10} xl={10} className="p-10">
          <label>Banque d'émission :</label>
          <Input
            value={model.EmissionBank}
            onChange={(EmissionBank) => {
              _setmodel((prev) => {
                return { ...prev, EmissionBank };
              });
            }}
          />
        </Responsive>
      )}
      {AddElement && model.type == 1 && (
        <div
          style={{
            background: "rgba(0,143,150,0.1)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <AddCheck
            _delete={_delete}
            upload={upload}
            error={errorcheck}
            model={{
              ..._checkModel,
              amount: Number(_checkModel.amount),
              attachments:
                _checkModel.attachments && _checkModel.attachments.join(),
              clientId: model.clientId,
              recoveryPointId: model.recoveryPointId,
            }}
            banks={banks}
            fetchBanks={fetchBanks}
            _setmodel={set_checkModel}
          />
          <Button onClick={save} appearance="primary">
            {/* {state.loading ? <Loader size="sm" /> : "Enregistrer"} */}
            Enregistrer
          </Button>
        </div>
      )}
    </>
  );
}
// AddEdit.defaultProps = {
//   model: new ClientModel(),
// };
export default AddEdit;
