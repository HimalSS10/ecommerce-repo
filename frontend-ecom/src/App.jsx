import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PaymentService from './Pages/paymentService';
import UserService from './Pages/UserService';
import InvoiceService from './Pages/InvoiceService';
import InventoryService from './Pages/InventoryService';
import OrderForm from './Pages/OrderForm';

export default function App() {
  return (
    <Router>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          background: '#fff',
          borderBottom: '1px solid #eee',
          zIndex: 1000,
          padding: '1rem 0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '2rem',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            color: '#646cff',
            letterSpacing: '1px',
            top: '50%',
            transform: 'translateY(-50%)',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          Ecomm
        </div>
        <Link to="/orders">Products</Link>
        <Link to="/payments">Payments</Link>
        <Link to="/users">Users</Link>
        <Link to="/invoices">Invoices</Link>
        <Link to="/inventory">Inventory</Link>
      </nav>
      {/* <div style={{ height: '4.5rem' }}></div> */}
      <Routes>
        <Route path="/payments" element={<PaymentService />} />
        <Route path="/users" element={<UserService />} />
        <Route path="/invoices" element={<InvoiceService />} />
        <Route path="/inventory" element={<InventoryService />} />
        <Route path="/orders" element={<OrderForm />} />
        <Route path="*" element={<div>Welcome! Select a service above.</div>} />
      </Routes>
    </Router>
  );
}
