import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  // Check for secret token in URL
  const urlParams = new URLSearchParams(location.search);
  const secretToken = urlParams.get('token');
  
  // Allow access with secret token or if already authenticated
  if (secretToken === 'vanguard-admin-secret-2024' || isAuthenticated) {
    return <Outlet />;
  }

  // For admin routes without proper token, redirect to home
  if (location.pathname.startsWith('/admin')) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
