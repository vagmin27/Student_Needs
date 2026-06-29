import React from "react";

export function TypingIndicator({ otherUserTyping, participantName }) {
  if (!otherUserTyping) return null;

  return (
    <div className="px-6 py-2 text-xs text-muted-foreground/80 italic animate-pulse flex-shrink-0">
      {participantName || "Contact"} is typing...
    </div>
  );
}
