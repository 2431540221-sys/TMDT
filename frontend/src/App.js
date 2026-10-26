import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminUsers from "./pages/AdminUsers";

// Nếu đã làm Lab09, bỏ comment 2 dòng dưới và đặt vào Home:
// import Category from "./components/categories/category";
// import Products from "./components/products/products";
function Home() {
  return (
    <div>
      {/* <Category /> */}
      {/* <Products /> */}
      <div className="container my-5 text-center text-muted">
        <h4>Chào mừng đến Cỏ 4 Lá Shop 🍀</h4>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
