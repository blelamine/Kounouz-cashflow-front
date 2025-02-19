import FileUploadIcon from "@rsuite/icons/FileUpload";
import { useEffect, useState } from "react";

import { useRecoilValue } from "recoil";
import { DatePicker, Input, SelectPicker, Uploader } from "rsuite";
import { APi } from "../../Api";
import { respresentatAtom } from "../../Atoms/representatives.atom";
import { userAtom } from "../../Atoms/user.atom";
import Responsive from "../../Components/Responsive";
import { serviceTypes } from "../../Constants/types";
import { BASE_URL } from "../../Config/api.config";
import moment from "moment";
import Label from "../../Components/Label";

function AddEdit({
  _setmodel,
  model,
  clients,
  fetchClients,
  credit,
  loadingAttach,
  checkouts = [],
}) {
  const [files, setfiles] = useState([]);
  const [loading, setloading] = useState(false);
  const user = useRecoilValue(userAtom);

  const representatives = useRecoilValue(respresentatAtom);
  // useEffect(setisCredit(credit), [credit]);
  // UPLOAD ACTIONS
  useEffect(() => {
    if (model.attachments) {
      setfiles(
        model.attachments
          .split(",")
          .filter((el) => el)
          .map((el) => ({ status: "finished", fileKey: el, name: el }))
      );
    }
  }, [model.id]);
  const upload = (list, file, fileKey) => {
    setloading(true);
    APi.createAPIEndpoint(APi.ENDPOINTS.File + "/Upload")
      .upload2(file, "File")
      .then((res) => {
        setloading(false);

        let i = list.findIndex((el) => el.fileKey == fileKey);
        setfiles((prev) => {
          let items = [...list];
          items[i].status = "finished";
          items[i].name = res.data;
          return items;
        });
        let attachments =
          model.attachments && model.attachments != undefined
            ? model.attachments
            : "";
        attachments = attachments ? attachments + "," + res.data : res.data;
        _setmodel((prev) => {
          return { ...prev, attachments };
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

        let attachments = model.attachments.replace(files[i].name, "");
        attachments = attachments.replace(",,", ",");
        _setmodel((prev) => {
          return { ...prev, attachments };
        });
      })
      .catch((error) => {});
  };

  return (
    <>
      {credit ? (
        <div>
          <Label style={{}}>
            <input
              type="checkbox"
              checked={model.authorizationStatus == 2}
              onChange={(e) =>
                _setmodel((prev) => ({
                  ...prev,
                  authorizationStatus: e.target.checked
                    ? 2
                    : prev.authorizationStatus,
                }))
              }
            />{" "}
            <b> Demande d'autorisation</b>
          </Label>
        </div>
      ) : (
        ""
      )}
      {!user.checkoutId && (
        <Responsive m={6} l={6} xl={6} className="p-10">
          <Label required>Caisse : </Label>
          <SelectPicker
            data={[{ Label: "Tout", value: 0 }].concat(
              checkouts.map((el) => {
                return { value: el.id, Label: el.name };
              })
            )}
            block
            noSearch
            value={model.checkoutId}
            onSelect={(checkoutId) => {
              _setmodel((prev) => {
                return { ...prev, checkoutId };
              });
            }}
          />
        </Responsive>
      )}
      <Responsive m={6} l={6} xl={6} className="p-10">
        <Label>Service : </Label>
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
      </Responsive>
      {credit ? (
        <Responsive m={6} l={6} xl={6} className="p-10">
          <Label>Client:</Label>
          <SelectPicker
            onSearch={(q) => fetchClients(q)}
            data={[{ Label: "Tout", value: 0 }].concat(
              clients.map((c) => {
                return { Label: c.name, value: c.id };
              })
            )}
            block
            noSearch
            value={model.clientId}
            onSelect={(clientId) => {
              // fetchChecks("", clientId);
              _setmodel((prev) => {
                return { ...prev, clientId };
              });
            }}
          />
        </Responsive>
      ) : (
        ""
      )}
      <Responsive m={6} l={6} xl={6} className="p-10">
        <Label>Représentant:</Label>
        <Input
          value={model.representative}
          onChange={(representative) => {
            _setmodel((prev) => {
              return { ...prev, representative };
            });
          }}
        />
      </Responsive>
      <Responsive m={6} l={6} xl={6} className="p-10">
        <Label required>Montant:</Label>
        <Input
          type="number"
          step="0.1"
          value={model.credit || model.debit}
          onChange={(a) => {
            let amount = Number(a);
            _setmodel((prev) => {
              return {
                ...prev,
                credit: credit ? amount : 0,
                debit: credit ? 0 : amount,
              };
            });
          }}
        />
      </Responsive>
      {/* <Responsive m={6} l={6} xl={6} className="p-10">
        <Label>Type D'operation : </Label>
        <SelectPicker
          data={transactionEvents}
          block
          noSearch
          value={model.event}
          onSelect={(event) => {
            _setmodel((prev) => {
              let m = { ...prev };

              return { ...m, event };
            });
          }}
        />
      </Responsive> */}
      <Responsive m={6} l={6} xl={6} className="p-10">
        <Label required>Date:</Label>
        <DatePicker
          style={{ display: "block" }}
          // pattern="\d{2}-\d{2}-\d{4}"
          value={new Date(model.date)}
          format="dd/MM/yyyy"
          onChange={(date) => {
            _setmodel((prev) => {
              return { ...prev, date };
            });
          }}
        />
      </Responsive>
      <Responsive className="p-10">
        <Label>Référence:</Label>
        <Input
          value={model.ref}
          onChange={(ref) => {
            _setmodel((prev) => {
              return { ...prev, ref };
            });
          }}
        />
      </Responsive>
      <Label required>Designation:</Label>
      <Input
        as="textarea"
        rows={3}
        placeholder="Textarea"
        value={model.designation}
        onChange={(designation) => {
          _setmodel((prev) => {
            return { ...prev, designation };
          });
        }}
      />
      <Label>Attachements:</Label>
      <Uploader
        renderFileInfo={(file, fileElement) => {
          return (
            <div>
              <a
                target="_blank"
                download
                href={BASE_URL + "Uploads/" + file.name}
                rel="noreferrer"
              >
                {file.name}
              </a>
            </div>
          );
        }}
        loading={loadingAttach}
        autoUpload={false}
        fileList={files}
        action="#"
        draggable
        onRemove={(f) => _delete(f.fileKey)}
        onChange={(list) => {
          // setstate((prev) => list);
          let file = list.filter((el) => el.status != "finished").reverse()[0];
          if (file) upload(list, file.blobFile, file.fileKey);
        }}
      >
        <div style={{ background: "rgba(200,200,200,0.1)" }}>
          <div style={{ fontSize: "50px" }}>
            {" "}
            <FileUploadIcon color="#3598ff"></FileUploadIcon>
          </div>
          <h4 style={{ color: "#bbb", fontWeight: "400" }}>
            Clicker ou Faites glisser les fichiers vers cette zone
            {/* pour les télécharger */}
          </h4>
        </div>
      </Uploader>
    </>
  );
}
// AddEdit.defaultProps = {
//   model: new ClientModel(),
// };
export default AddEdit;
