import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { showToast } from "@/components/Referrals/TransactionToast.jsx";

export default function SocialSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (!token || !userParam) {
      showToast("Authentication failed: Missing parameters", "error");
      navigate("/role-selection");
      return;
    }

    try {
      const decodedUser = JSON.parse(decodeURIComponent(userParam));
      const role = (decodedUser.role || decodedUser.accountType || "student").toLowerCase();

      const normalizedUser = {
        ...decodedUser,
        role,
        accountType: role
      };

      // Persist auth states
      localStorage.setItem("token", token);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("User", JSON.stringify(normalizedUser));
      localStorage.setItem("auth_user", JSON.stringify(normalizedUser));
      localStorage.setItem("auth_data", JSON.stringify({ token, user: normalizedUser }));

      // Set global auth state
      setUser(normalizedUser);

      showToast(`Welcome back, ${normalizedUser.firstName || "User"}!`, "success");

      // Redirect accordingly
      setTimeout(() => {
        if (role === "alumni") {
          navigate("/alumni/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }, 1000);

    } catch (error) {
      console.error("Social auth callback error:", error);
      showToast("Failed to parse user details from login provider", "error");
      navigate("/role-selection");
    }
  }, [searchParams, navigate, setUser]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="p-8 max-w-md w-full bg-card border border-border rounded-xl flex flex-col items-center gap-6 shadow-[var(--shadow-md)] text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-2">Completing Login</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we establish your secure session dashboard...
          </p>
        </div>
      </div>
    </main>
  );
}
