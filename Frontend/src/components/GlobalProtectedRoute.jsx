import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { Loader2 } from "lucide-react";

export const GlobalProtectedRoute = ({ children, allowedRoles = [], fallbackPath = "/role-selection" }) => {
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
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
<<<<<<< HEAD
=======
<<<<<<< HEAD:src/components/GlobalProtectedRoute.jsx
>>>>>>> c76ab2ceee41537cccbf90f6b2bf341c324d893d
    const rawRole = (user.role || user.accountType || "student").toLowerCase();
    const userRole = rawRole === "tutor" ? "teacher" : rawRole;
    const hasRole = allowedRoles.some(r => {
      const targetRole = r.toLowerCase() === "tutor" ? "teacher" : r.toLowerCase();
      return targetRole === userRole;
    });
<<<<<<< HEAD
=======
=======
// <<<<<<< HEAD
//     const rawRole = (user.role || user.accountType || "").toLowerCase();
//     const userRole = rawRole === "tutor" ? "teacher" : rawRole;
//     const hasRole = allowedRoles.some(r => {
//       const targetRole = r.toLowerCase() === "tutor" ? "teacher" : r.toLowerCase();
//       return targetRole === userRole;
//     });
// =======
    const userRole = (user.role || user.accountType || "student").toLowerCase();
    const hasRole = allowedRoles.some(r => r.toLowerCase() === userRole);
// >>>>>>> 0870b628bed689c474ddffdc0aff3a3c19622779
>>>>>>> 94d51442ed970eef37ac0ae78cd897ae8839d68c:Frontend/src/components/GlobalProtectedRoute.jsx
>>>>>>> c76ab2ceee41537cccbf90f6b2bf341c324d893d
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default GlobalProtectedRoute;
