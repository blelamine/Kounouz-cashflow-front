import {
  DatePicker,
  IconButton,
  Input,
  Message,
  SelectPicker,
  TagInput,
  Uploader,
} from "rsuite";
import { checkPurpose, checkStatus } from "../../Constants/types";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import moment from "moment";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Responsive from "../../Components/Responsive";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import TrashIcon from "@rsuite/icons/Trash";
import { CheckAtom } from "../../Atoms/check.atom";

const AddEditCheck = ({
  error,
  clients,
  banks,
  fetchBanks,
  fetchClients,
  loadingAttach,
  attachments,
  _delete,
  upload,
  inset,
}) => {
  const [model, setModel] = useRecoilState(CheckAtom);
  return (
    <>
      <Responsive l={6} xl={6} className="p-5">
        <label>Numéro:</label>
        <Input
          maxlength="7"
          onChange={(number) => {
            setModel((prev) => {
              return { ...prev, number };
            });
          }}
          value={model.number}
        />
      </Responsive>
      <Responsive l={6} xl={6} className="p-5">
        <label>Status</label>
        <SelectPicker
          disabled={!model.id}
          searchable={false}
          data={checkStatus}
          block
          noSearch
          value={model.status}
          onSelect={(status) => {
            setModel((prev) => {
              return {
                ...prev,
                status,
                checkPartialPayments:
                  prev.status != 8 && status == 8
                    ? [{ amount: 0, date: new Date() }]
                    : [],
              };
            });
          }}
        />
      </Responsive>
      {model.status == 8 && (
        <div
          style={{ background: "rgba(76,103,194,0.3)", borderRadius: "5px" }}
        >
          {model.checkPartialPayments &&
            model.checkPartialPayments.map((pa, i) => (
              <>
                <Responsive m={4} l={4} xl={4} className="p-5">
                  <label>Montant:</label>
                  <Input
                    value={model.checkPartialPayments[i].amount}
                    onChange={(amount) => {
                      let checkPartialPayments = [
                        ...model.checkPartialPayments,
                      ];
                      let g = { ...checkPartialPayments[i] };
                      g.amount = parseFloat(amount);
                      checkPartialPayments[i] = g;
                      setModel({ ...model, checkPartialPayments });
                    }}
                  />
                </Responsive>
                <Responsive m={4} l={4} xl={4} className="p-5">
                  <label>Date:</label>
                  <Input
                    type="date"
                    value={
                      typeof model.checkPartialPayments[i].date == "string"
                        ? model.checkPartialPayments[i].date.substring(0, 10)
                        : model.checkPartialPayments[i].date
                    }
                    onChange={(date) => {
                      let checkPartialPayments = [
                        ...model.checkPartialPayments,
                      ];
                      let g = { ...checkPartialPayments[i] };
                      g.date = date;
                      checkPartialPayments[i] = g;
                      setModel({ ...model, checkPartialPayments });
                    }}
                  />
                </Responsive>
                <Responsive s={2} m={3} l={3} xl={3} className="p-5">
                  {/* <div style={{ height: "42px" }}> </div> */}
                  <label></label>
                  <div className="p-5">
                    {i ? (
                      <IconButton
                        onClick={() => {
                          let checkPartialPayments = [
                            ...model.checkPartialPayments,
                          ];
                          checkPartialPayments.splice(i, 1);
                          setModel({ ...model, checkPartialPayments });
                        }}
                        color="violet"
                        icon={<TrashIcon />}
                      ></IconButton>
                    ) : (
                      ""
                    )}
                    {i + 1 == model.checkPartialPayments.length && (
                      <IconButton
                        onClick={() => {
                          let checkPartialPayments = [
                            ...model.checkPartialPayments,
                          ];
                          checkPartialPayments.push({
                            amount: 0,
                            date: new Date(),
                          });
                          setModel({ ...model, checkPartialPayments });
                        }}
                        color="violet"
                        icon={<PlusRoundIcon />}
                      ></IconButton>
                    )}
                  </div>
                </Responsive>
              </>
            ))}
        </div>
      )}
      {model.status != 1 && (
        <>
          <Responsive l={6} xl={6} className="p-5">
            <label>Date De Changement: </label>
            <Input
              defaultValue={moment(model.changeDate).format("YYYY-MM-DD")}
              type="date"
              value={moment(model.changeDate).format("YYYY-MM-DD")}
              onChange={(changeDate) =>
                setModel((prev) => {
                  return { ...prev, changeDate };
                })
              }
              block
            />{" "}
          </Responsive>
          <Responsive l={6} xl={6} className="p-5">
            <label>Numéro de bordereau: </label>
            <Input
              value={model.payingInSlip}
              onChange={(payingInSlip) =>
                setModel((prev) => {
                  return { ...prev, payingInSlip };
                })
              }
              block
            />{" "}
          </Responsive>
        </>
      )}

      <Responsive l={6} xl={6} className="p-5">
        <label>Montant</label>
        <Input
          type="number"
          disabled={inset}
          step="0.1"
          value={model.amount}
          onChange={(amount) => {
            setModel((prev) => {
              return { ...prev, amount };
            });
          }}
        />
      </Responsive>
      <Responsive l={6} xl={6} className="p-5">
        <label>Tireur / Proprietaire</label>
        <Input
          value={model.owner}
          onChange={(owner) => {
            setModel((prev) => {
              return { ...prev, owner };
            });
          }}
        />
      </Responsive>
      {typeof clients != "undefined" && (
        <>
          <Responsive l={6} xl={6} className="p-5">
            <label>Client: </label>
            <SelectPicker
              onSearch={(q) => fetchClients(q)}
              data={clients.map((c) => {
                return { label: c.name, value: c.id };
              })}
              block
              noSearch
              value={model.clientId}
              onSelect={(clientId) => {
                setModel((prev) => {
                  return { ...prev, clientId };
                });
              }}
            />
          </Responsive>
          {clients.find((c) => c.name.includes("(B2C)")) && (
            <Responsive l={6} xl={6} className="p-5">
              <label>Client B2C</label>
              <Input
                value={model.b2CName}
                onChange={(b2CName) => {
                  setModel((prev) => {
                    return { ...prev, b2CName };
                  });
                }}
              />
            </Responsive>
          )}
        </>
      )}
      <Responsive l={6} xl={6} className="p-5">
        {" "}
        <label>Banque d'Emission: </label>
        <SelectPicker
          onSearch={(q) => fetchBanks(q)}
          data={[{ label: "Tout", value: 0 }].concat(banks)}
          block
          noSearch
          value={model.emmissionBankId}
          onSelect={(emmissionBankId) => {
            setModel((prev) => {
              return { ...prev, emmissionBankId };
            });
          }}
        />
      </Responsive>
      <Responsive l={6} xl={6} className="p-5">
        <label>Banque de Dépôt: </label>
        <SelectPicker
          onSearch={(q) => fetchBanks(q)}
          data={[{ label: "Tout", value: 0 }].concat(banks)}
          block
          noSearch
          value={model.depositBankId}
          onSelect={(depositBankId) => {
            setModel((prev) => {
              return { ...prev, depositBankId };
            });
          }}
        />
      </Responsive>
      <Responsive l={6} xl={6} className="p-5">
        <label>Date De Dépôt: </label>
        <Input
          type="date"
          defaultValue={moment(model.date).format("YYYY-MM-DD")}
          value={moment(model.date).format("YYYY-MM-DD")}
          onChange={(date) =>
            setModel((prev) => {
              return { ...prev, date };
            })
          }
          block
        />
      </Responsive>
      <Responsive l={6} xl={6} className="p-5">
        <label>Date D'échèance: </label>
        <Input
          type="date"
          defaultValue={moment(model.dueDate).format("YYYY-MM-DD")}
          value={moment(model.dueDate).format("YYYY-MM-DD")}
          onChange={(dueDate) =>
            setModel((prev) => {
              return { ...prev, dueDate };
            })
          }
          block
        />
      </Responsive>
      <Responsive l={6} xl={6} className="p-5">
        {typeof clients != "undefined" && (
          <>
            <label>Type </label>
            <SelectPicker
              searchable={false}
              data={checkPurpose}
              block
              noSearch
              value={model.checkPurpose}
              onSelect={(checkPurpose) => {
                setModel((prev) => {
                  return { ...prev, checkPurpose };
                });
              }}
            />
          </>
        )}
      </Responsive>
      <label>Notes:</label>
      <Input
        as="textarea"
        rows={3}
        placeholder="Textarea"
        value={model.notes}
        onChange={(notes) => {
          setModel((prev) => {
            return { ...prev, notes };
          });
        }}
      />
      <label>Attachement:</label>
      <Uploader
        loading={loadingAttach}
        autoUpload={false}
        fileList={attachments}
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
      <br></br>
      {error && (
        <Message showIcon type="error">
          {error}
        </Message>
      )}
    </>
  );
};
// AddEdit.defaultProps = {
//   model: new ClientModel(),
// };
export default AddEditCheck;
