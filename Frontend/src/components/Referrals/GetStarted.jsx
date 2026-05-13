import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";

/**
 * GetStarted Component
 * A call-to-action button that navigates users to the role selection page.
 * Includes a gradient variant and custom transition effects.
 */
export function GetStarted() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/landing");
  };

  return (
    <>
      <Button
        variant="gradient"
        onClick={handleGetStarted}
        className="gap-2 rounded-md border border-primary/30 px-6 py-2.5 text-sm font-medium hover:border-primary/50 transition-colors"
      >
        Get Started
      </Button>
    </>
  );
}

// Keep WalletButton as an alias for backward compatibility
// This is useful if other parts of the app still reference the old name.
export const WalletButton = GetStarted;