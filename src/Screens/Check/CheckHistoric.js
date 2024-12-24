import moment from "moment";
import React, { useEffect, useState } from "react";
import { Divider, Modal, Tag, Timeline } from "rsuite";
import { checkStatus } from "../../Constants/types";

export default function CheckHistoric({ open, handleClose, historic, date }) {
  const [state, setstate] = useState([]);
  useEffect(() => {
    setstate([
      { status: 1, Date: moment(date).format("DD/MM/yyyy") },
      ...eval("{data:[" + historic + "]}"),
    ]);
  }, [open]);
  return (
    <>
      <Modal size="md" overflow={false} open={open} onClose={handleClose}>
        <Modal.Title>Historique des etats:</Modal.Title>
        <Divider />
        <Modal.Body>
          <Timeline align="vertical">
            {state.map((el) => (
              <Timeline.Item>
                <div style={{ padding: "0 20px" }}>
                  <Tag
                    color={
                      el.status == 1
                        ? "blue"
                        : el.status == 2
                        ? "green"
                        : el.status == 3
                        ? "violet"
                        : el.status == 4
                        ? "black"
                        : "red"
                    }
                  >
                    {checkStatus.find((l) => l.value == el.status).label}
                  </Tag>{" "}
                  <strong>{el.Date}</strong>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Modal.Body>
      </Modal>
    </>
  );
}
const A = () => <>test</>;
