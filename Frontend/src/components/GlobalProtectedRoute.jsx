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

  if (allowedRoles.length > 0) {
    const rawRole = (user.role || user.accountType || "student").toLowerCase();
    const userRole = rawRole === "tutor" ? "teacher" : rawRole;

    const hasRole = allowedRoles.some((r) => {
      const targetRole =
        r.toLowerCase() === "tutor"
          ? "teacher"
          : r.toLowerCase();

      return targetRole === userRole;
    });
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default GlobalProtectedRoute;