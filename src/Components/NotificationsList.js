// NotificationsList.js
import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { BASE_URL } from "../Config/api.config";
import { useRecoilValue } from "recoil";
import { userAtom } from "../Atoms/user.atom";

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const user = useRecoilValue(userAtom);
  useEffect(() => {
    let connection = null;

    function startSignalRConnection() {
      if (!connection || connection.state !== "Connected") {
        // If there's no existing connection or the connection is not in the Connected state
        connection = new signalR.HubConnectionBuilder()
          .withUrl(BASE_URL + "notificationHub")
          .withAutomaticReconnect()
          .build();

        connection
          .start()
          .then(() => {
            console.log("Connected to SignalR hub");

            connection.on("ReceiveNotification", async (message) => {
              setNotifications((notifications) => [...notifications, message]);

              // Send push notification
              const registration = await navigator.serviceWorker.ready;
              localStorage.getItem("auth") &&
                JSON.parse(localStorage.getItem("auth")).ccaId &&
                registration.showNotification("Demande d'autorisation", {
                  body: message,
                  icon: "/favicon-32x32.png", // Add your icon here
                  badge: "/favicon-32x32.png",
                  // .            dir?: NotificationDirection;
                  // icon?: ,
                  // lang?: ,
                  // requireInteraction?: boolean;
                  // silent?: boolean | null;
                  tag: Math.random() * 1000,
                });
            });
          })
          .catch((err) => console.error("Connection error:", err));
      } else {
        console.log("SignalR connection already established.");
      }
    }

    // Start the SignalR connection
    startSignalRConnection();

    // Optionally, you might want to stop the connection when the component unmounts
    return () => {
      if (connection && connection.state === "Connected") {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker
            .getRegistration()
            .then((registration) => {
              if (!registration) {
                connection.stop();
              }
            })
            .catch((error) => {
              connection.stop();
            });
        }
      }
    };
  }, []);

  return (
    <div>
      {/* {notifications.map((message, index) => (
        <div key={index}>{message}</div>
      ))} */}
    </div>
  );
};

export default NotificationsList;
