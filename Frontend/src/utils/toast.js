import { toast as sonnerToast } from "sonner";
import hotToast from "react-hot-toast";

// A centralized toast utility to maintain consistent UI
export const showToast = {
  success: (message, description) => {
    sonnerToast.success(message, {
      description,
      style: { background: "#10b981", color: "#fff", border: "none" }
    });
  },
  error: (message, description) => {
    sonnerToast.error(message, {
      description,
      style: { background: "#ef4444", color: "#fff", border: "none" }
    });
  },
  info: (message, description) => {
    sonnerToast.info(message, {
      description,
      style: { background: "#3b82f6", color: "#fff", border: "none" }
    });
  },
  warning: (message, description) => {
    sonnerToast.warning(message, {
      description,
      style: { background: "#f59e0b", color: "#fff", border: "none" }
    });
  },
  
  // Legacy support for hot-toast if needed elsewhere
  hotSuccess: (message) => hotToast.success(message),
  hotError: (message) => hotToast.error(message),
};

export default showToast;
