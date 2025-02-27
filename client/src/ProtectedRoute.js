import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ role, allowedRoles, children }) {
    if (!allowedRoles.includes(role)) {
        // Điều hướng đến trang 404 nếu không đủ quyền
        return <Navigate to="/404" replace />;
    }
    return children;
}

export default ProtectedRoute;