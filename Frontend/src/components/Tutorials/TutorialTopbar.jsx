import React from "react";
import { Bell, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/GlobalAuthContext";
import { NotificationCenter } from "@/components/ui/NotificationCenter";

const TutorialTopbar = () => {
  const { toggleMobileMenu } = useSidebar();
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-serif font-bold tracking-tight hidden sm:block">Tutorials</h1>
      </div>

      {/* search removed */}

      <div className="flex items-center gap-3 ml-auto">
        <ThemeToggle className="border-border/60" />

        <div className="hidden sm:block">
          <NotificationCenter />
        </div>

        <div className="flex items-center gap-3 ml-2 border-l pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name || "Student"}</p>
            <p className="text-xs text-muted-foreground mt-1">Profile & Settings</p>
          </div>
          <div className="w-9 h-9 rounded-[var(--radius-md)] bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shadow-[var(--shadow-sm)] border border-primary/20">
            {(user?.name || "S")[0].toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TutorialTopbar;
