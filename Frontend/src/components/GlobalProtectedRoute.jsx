import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { Loader2 } from "lucide-react";

export const GlobalProtectedRoute = ({
  children,
  allowedRoles = [],
  fallbackPath = "/role-selection",
}) => {
  const { isAuthenticated, user, isLoading, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={fallbackPath}
        state={{ from: location }}
        replace
      />
    );
  }

  if (!user || !user.role) {
    return <Navigate to="/role-selection" replace />;
  }

  if (allowedRoles.length > 0) {
    const normalizedRole =
      user?.role?.toLowerCase?.() ||
      user?.accountType?.toLowerCase?.() ||
      "";

    console.log("USER:", user);
    console.log("ROLE:", user?.role);
    console.log("ACCOUNT TYPE:", user?.accountType);
    console.log("ALLOWED ROLES:", allowedRoles);

    const hasAccess = allowedRoles.map((r) => r.toLowerCase()).includes(normalizedRole);
    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default GlobalProtectedRoute;