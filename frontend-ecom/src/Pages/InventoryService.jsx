import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InventoryService() {
  const items1 = [
    { id: 201, userId: 1, paymentId: 101, amount: 49.99, status: "PAID" },
    { id: 202, userId: 2, paymentId: 102, amount: 19.99, status: "PAID" },
    { id: 203, userId: 3, paymentId: 103, amount: 99.99, status: "PAID" },
    { id: 204, userId: 4, paymentId: 104, amount: 5.0, status: "PAID" },
    { id: 205, userId: 5, paymentId: 105, amount: 250.0, status: "PAID" },
  ];
  const [items, setItems] = useState(items1);
  
  const API_GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

  useEffect(() => {
    axios.get(`${API_GATEWAY_URL}/orders`).then((res) => setItems(res.data));
  }, []);

  return (
    <div className="full-page">
      <h2>Orders Inventory</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Quantity
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {items ? (
            items.map((item) => (
              <tr key={item.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item.id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item.product}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item.quantity}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  ${item.price}
                </td>
              </tr>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </tbody>
      </table>
    </div>
  );
}
