import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute() {
  const { isReady, isAuthenticated } = useAuth();

  if (!isReady) {
    return (
      <div className="crm-loading-screen">
        <div className="crm-loading-spinner" aria-hidden />
        <p>Loading workspace…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
