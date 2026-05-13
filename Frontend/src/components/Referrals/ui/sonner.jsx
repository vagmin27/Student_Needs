import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

/**
 * Toaster Component
 * Wraps the 'sonner' library to provide theme-aware notifications.
 * It uses 'next-themes' to automatically switch between light, dark, and system modes.
 * * @param {Object} props - Standard Sonner properties (position, expand, richColors, etc.)
 */
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };