import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireSuperAdmin = false }) => {
  const token = localStorage.getItem("res.data.token") || JSON.parse(localStorage.getItem("adminInfo"))?.token;
  const admin = JSON.parse(localStorage.getItem("adminInfo"));

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // ❌ Force password reset
if (
  admin?.isTempPassword &&
  window.location.pathname !== "/admin/reset-password"
) {
  return <Navigate to="/admin/reset-password" />;
}

  // ❌ Role-based protection
  if (requireSuperAdmin && admin?.role !== "super_admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;