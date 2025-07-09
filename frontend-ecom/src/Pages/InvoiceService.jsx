import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InvoiceService() {
  const invoices1 = [
    { id: 201, userId: 1, paymentId: 101, amount: 49.99, status: "PAID" },
    { id: 202, userId: 2, paymentId: 102, amount: 19.99, status: "PAID" },
    { id: 203, userId: 3, paymentId: 103, amount: 99.99, status: "PAID" },
    { id: 204, userId: 4, paymentId: 104, amount: 5.0, status: "PAID" },
    { id: 205, userId: 5, paymentId: 105, amount: 250.0, status: "PAID" },
  ];
  const [invoices, setInvoices] = useState([]);

  const API_GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

  useEffect(() => {
    axios
      .get(`${API_GATEWAY_URL}/invoice/get`)
      .then((res) => setInvoices(res.data.invoices));
  }, []);

  console.log("invoices", invoices);

  return (
    <div  >
      <h2>Invoices</h2>
      {invoices.length !== 0 ? (
        invoices.map((inv) => (
          <div key={inv.id}>
            <button
              style={{
                width: "100%",
                background: "#ffffff",
                color: "black",
                border: "1px solid #ccc",
                padding: "25px",
                margin: "15px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              onClick={() => {
                // Open a new tab with invoice details
                const newTab = window.open();
                newTab.document.write(`
                        <html>
                          <head>
                            <title>Invoice #${inv.id}</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 2em; }
                              .label { font-weight: bold; }
                              .value { margin-bottom: 1em; }
                              .section { margin-bottom: 2em; }
                            </style>
                          </head>
                          <body>
                            <div class="section">
                            <div class="label">Invoice #${inv.id}</div>
                            <hr></hr>
                              <div class="label">User Name:</div>
                              <div class="value">${inv.user_name ?? ""}</div>
                              <div class="label">Payment ID:</div>
                              <div class="value">${inv.payment_id ?? ""}</div>
                            </div>
                            <div class="section">
                              <div class="label">Price:</div>
                              <div class="value">$${inv.price ?? ""}</div>
                              <div class="label">Status:</div>
                              <div class="value">${inv.status ?? ""}</div>
                              <div class="label">Description:</div>
                              <div class="value">${
                                inv.description ?? "No description available."
                              }</div>
                            </div>
                          </body>
                        </html>
                      `);
                newTab.document.close();
              }}
            >
              <div>
                <span style={{ fontWeight: "bold" }}>Invoice #{inv.id}</span>{" "}
                &mdash; {inv.user_name} (Payment ID: {inv.payment_id})
              </div>
            </button>
            {/* </td> */}
          </div>
        ))
      ) : (
        <p>Loading Invoices....</p>
      )}
    </div>
  );
}
