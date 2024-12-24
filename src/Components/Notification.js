// Notification.js
import React from "react";

const Notification = ({ transaction }) => (
  <div className="notification">
    <strong>New Transaction</strong>
    <p>{transaction.description}</p>
    <p>Amount: {transaction.credit - transaction.debit}</p>
    <p>Date: {transaction.date}</p>
  </div>
);

export default Notification;
