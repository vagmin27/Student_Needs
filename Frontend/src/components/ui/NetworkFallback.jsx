import React, { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export const NetworkFallback = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[9999] bg-red-900/90 text-white px-4 py-2 flex items-center justify-center gap-3 shadow-lg border-b border-red-500 backdrop-blur-md transition-all duration-300 transform translate-y-0">
      <WifiOff className="w-5 h-5 animate-pulse" />
      <span className="font-semibold text-sm tracking-wide">
        System Offline: Connection to UniConnect servers lost. Attempting to reconnect...
      </span>
    </div>
  );
};

export default NetworkFallback;
