import React from "react";
import { WifiOff, AlertTriangle } from "lucide-react";

export const CallOverlay = ({ connectionState, duration, onSwitchToBrowser }) => {
  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      {/* Top Bar for Call Info & Timer */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-700/50 flex items-center gap-3 z-50">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <span className="text-sm font-medium text-slate-200 font-mono">
          {formatDuration(duration)}
        </span>
      </div>

      {/* Network Reconnect State */}
      {(connectionState === "disconnected" || connectionState === "failed") && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-40 transition-all">
          <WifiOff className="w-12 h-12 text-yellow-500 mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-white mb-2">Connection Lost</h3>
          <p className="text-slate-400 mb-6 max-w-sm text-center">
            Attempting to reconnect to the network. If this takes too long, you can switch to a browser meeting.
          </p>
          <button
            onClick={onSwitchToBrowser}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-[var(--radius-md)] transition-all shadow-lg"
          >
            <AlertTriangle className="w-4 h-4" />
            Switch to Browser Meeting
          </button>
        </div>
      )}
    </>
  );
};

export default CallOverlay;
