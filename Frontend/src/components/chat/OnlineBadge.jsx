import React from "react";

export const OnlineBadge = ({ className = "" }) => {
  return (
    <span className={`relative flex h-2.5 w-2.5 ${className}`} title="Online">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
    </span>
  );
};

export default OnlineBadge;
