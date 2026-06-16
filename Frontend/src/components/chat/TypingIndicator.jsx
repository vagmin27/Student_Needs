import React from "react";

export const TypingIndicator = ({ name = "Someone" }) => {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground/80 py-1.5 px-3 bg-secondary/40 rounded-full w-fit border border-border/10 backdrop-blur-sm select-none animate-pulse">
      <span>{name} is typing</span>
      <div className="flex gap-1 items-center h-2">
        <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
        <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
        <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
