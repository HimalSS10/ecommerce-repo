import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PaymentService() {
  const payments1 = [
    { id: 101, price: 49.99, userId: 1, userName: "himal", orderId: 123 },
    { id: 102, price: 19.99, userId: 2, userName: "himal", orderId: 124 },
    { id: 103, price: 99.99, userId: 3, userName: "himal", orderId: 125 },
    { id: 104, price: 5.0, userId: 4, userName: "himal", orderId: 125 },
    { id: 105, price: 250.0, userId: 5, userName: "himal", orderId: 125 },
  ];
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  const API_GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

  console.log("payments", payments);

  useEffect(() => {
    axios
      .get(`${API_GATEWAY_URL}/payment/get`)
      .then((res) => setPayments(res.data.payments));
  }, []);

  const handlePayment = {};

  return (
    <div className="full-page">
      <h2>Payments</h2>
      <form onSubmit={handlePayment} style={{ marginBottom: "1rem" }}>
        {/* ... form fields ... */}
      </form>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Order ID
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              User Name
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.length !== 0 ? (
            payments.map((payment) => (
              <tr key={payment.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {payment.id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {payment.orderId}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {payment.userName}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  ${payment.price}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button
                    onClick={async () => {
                      await axios.post(`${API_GATEWAY_URL}/invoice/create`, {
                        payment_id: payment.id,
                        user_id: 1,
                        amount: 200,
                        description: "invoice has been generated",
                        status: "PAID",
                      });
                      navigate("/invoices");
                    }}
                  >
                    Generate Invoice
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <p style={{"textAlign": "center"}}>Loading....</p>
          )}
        </tbody>
      </table>
    </div>
  );
}
