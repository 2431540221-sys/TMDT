import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../services/auth";

// Chặn trang nếu chưa đăng nhập / không đủ quyền
export default function ProtectedRoute({ children, role }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  const user = getUser();
  if (role && (!user || user.role !== role)) return <Navigate to="/" replace />;
  return children;
}
