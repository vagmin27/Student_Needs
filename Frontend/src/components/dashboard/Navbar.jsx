import React from "react";
import { Search, Menu } from "lucide-react";
import { Input } from "../ui/input";
import { NotificationCenter } from "../ui/NotificationCenter.jsx";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";

const Navbar = ({ onMenuClick, pageTitle = "Dashboard" }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:bg-secondary"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground tracking-tight hidden sm:block">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anything..."
            className="w-full bg-secondary/50 border-none pl-9 h-9 rounded-full focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <NotificationCenter />

        <div className="w-8 h-8 rounded-full bg-secondary border border-border overflow-hidden flex items-center justify-center font-bold text-primary">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs uppercase">{user?.name ? user.name[0] : "U"}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
