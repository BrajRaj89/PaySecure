import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserOrders from './pages/UserOrders';
import CreateOrder from './pages/CreateOrder';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/user/:userId/orders" element={<UserOrders />} />
        </Routes>
      </div>
    </div>
  );
}



export default App;
