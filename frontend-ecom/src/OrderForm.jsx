import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import sampleOrders from "./data.json";

export default function OrderForm() {
  const [order, setOrder] = useState({ product: "", quantity: 1, price: 0 });
  const [orders, setOrders] = useState();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8081/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const submitOrder = async () => {
    const res = await axios.post("http://localhost:8081/orders", order);
    alert("Order Placed: " + JSON.stringify(res.data));
    fetchOrders();
  };

  return (
    <div className="order-form-container">
      <h3>List of Products</h3>
      <div className="orders-list" tsy>
        {sampleOrders.map((o, idx) => (
          <div className="order-box" key={idx}>
            <img src={o.image} alt={o.product} className="order-image" />
            <div>
              <strong>Product:</strong> {o.product}
            </div>
            <div>
              <strong>Qty:</strong> {o.quantity}
            </div>
            <div>
              <strong>Price:</strong> ${o.price}
            </div>
            <button
              onClick={() => {
                setSelectedProduct(o);
                setShowOrderForm(true);
              }}
            >
              Order
            </button>
          </div>
        ))}
      </div>

      <hr style={{marginTop: "50px"}}></hr>
      <h3>Orders Placed</h3>
      <div className="orders-list" tsy>
        {orders ? (
          orders.map((o, idx) => (
            <div className="order-box" key={idx}>
              <div>
                <strong>Product:</strong> {o.product}
              </div>
              <div>
                <strong>Qty:</strong> {o.quantity}
              </div>
              <div>
                <strong>Price:</strong> ${o.price}
              </div>
            </div>
          ))
        ) : (
          <p>None Placed...</p>
        )}
      </div>

      {showOrderForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Place Order</h3>
            <input
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <div>Product: {selectedProduct.product}</div>
            <div>Price: ${selectedProduct.price}</div>
            <div>Quantity: {selectedProduct.quantity}</div>
            <button
              onClick={async () => {
                await axios.post("http://localhost:8081/orders", {
                  customer: customerName,
                  product: selectedProduct.product,
                  price: selectedProduct.price,
                  quantity: selectedProduct.quantity,
                });
                setShowOrderForm(false);
                setCustomerName("");
                fetchOrders();
                // submitOrder();
              }}
            >
              Place Order
            </button>
            <button onClick={() => setShowOrderForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
