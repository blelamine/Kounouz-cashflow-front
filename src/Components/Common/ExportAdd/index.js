import React, { useEffect, useState } from "react";
import { Button, IconButton, Loader, Modal } from "rsuite";
import ChangeListIcon from "@rsuite/icons/ChangeList";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import Divider from "rsuite/Divider";
import { exportAddAtom } from "../../../Atoms/exportAdd.atom";
import { useRecoilState } from "recoil";
import ExportExcel from "./excelExport";

export default function ExportAdd({
  AddComponent,
  AddComponentV2,
  saveV2,
  excelData,
  nameExcel,
  noExport,
  save,
  noAdd,
  ActionOnClose,
  size,
  title,
  v2 = false,
  btns = <></>,
  btnAddTitle = "Ajout",
  actionExcel,
  noModify,
}) {
  const [ismobile, setismobile] = useState(true);
  const handleResize = () => {
    setismobile(window && window.innerWidth <= 600);
  };
  useEffect(() => {
    setismobile(window && window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleOpen = () =>
    setstate((prev) => {
      return { ...prev, open: true };
    });
  const [state, setstate] = useRecoilState(exportAddAtom);
  const handleClose = () =>
    setstate((prev) => {
      return { ...prev, open: false };
    });
  const exportExcel = () => {
    document.querySelector("#hidden-btn-export").click();
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "15px 0",
        zIndex: "1",
        maxWidth: "100vw",
      }}
    >
      {!noExport && (
        <Button
          color="green"
          onClick={() => {
            if (actionExcel) actionExcel();
            else exportExcel();
          }}
          appearance="primary"
        >
          {ismobile ? "" : "Export"} <ChangeListIcon />
        </Button>
      )}
      {/* <Divider vertical /> */}
      <span style={{ margin: "0 1px" }}></span>
      {btns}
      <span style={{ margin: "0 1px" }}></span>

      {!noAdd && (
        <>
          {/* <IconButton
            onClick={handleOpen}
            appearance="primary"
            icon={<PlusRoundIcon />}
          >
            {btnAddTitle}
          </IconButton> */}
          <Button onClick={handleOpen} appearance="primary">
            <PlusRoundIcon /> {btnAddTitle}
          </Button>
          <Modal
            size={size ? size : "lg"}
            overflow={false}
            style={{
              maxHeight: "calc(100vh - 50px)",
              overflow: "auto",
              maxWidth: "100vw",
            }}
            open={state.open}
            onClose={() => {
              handleClose();
              if (ActionOnClose) ActionOnClose();
            }}
          >
            <Modal.Header>
              <Modal.Title>{title || "Titre"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div
                style={{
                  maxHeight: "calc(100vh - 240px)",
                  overflow: "auto",
                  maxWidth: "100vw",
                }}
              >
                {v2 ? AddComponentV2 : AddComponent}
              </div>
            </Modal.Body>
            <Modal.Footer>
              {noModify ? (
                ""
              ) : (
                <Button onClick={save} appearance="primary">
                  {state.loading ? <Loader size="sm" /> : "Enregistrer"}
                </Button>
              )}
              <Button
                onClick={() => {
                  handleClose();
                  if (ActionOnClose) ActionOnClose();
                }}
                appearance="subtle"
              >
                Annuler
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
      <ExportExcel data={excelData} name={nameExcel} />
    </div>
  );
}
