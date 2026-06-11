import React from "react";
import { cn } from "@/lib/utils.js";

export const CallHistoryCard = ({ message, currentUserId }) => {
  const isOutgoing = message.metadata?.initiatedBy?.toString() === currentUserId?.toString();
  const isVideo = message.metadata?.callType === "video";
  const status = message.metadata?.status;
  const duration = message.metadata?.duration || 0;

  let title = isVideo ? "Video Session" : "Voice Call";
  let icon = isVideo ? "📹" : "📞";
  let titleColor = "text-foreground";

  if (status === "missed") {
    title = `Missed ${isVideo ? "Video" : "Voice"} Call`;
    icon = "🔴";
    titleColor = "text-red-500";
  } else if (status === "declined") {
    title = `Declined ${isVideo ? "Video" : "Voice"} Call`;
    titleColor = "text-orange-500";
  } else if (status === "cancelled") {
    title = `Cancelled ${isVideo ? "Video" : "Voice"} Call`;
    titleColor = "text-gray-400";
  } else {
    titleColor = "text-emerald-500"; // green/neutral for answered
  }

  const formatDuration = (seconds) => {
    if (seconds === 0) return "No answer";
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
    }
    return `${seconds} sec`;
  };

  const bgClass = isOutgoing ? "bg-primary/20 border-primary/30" : "bg-card border-border/40";

  return (
    <div className={cn("flex flex-col p-3 rounded-2xl border backdrop-blur-md shadow-sm min-w-[200px]", bgClass, isOutgoing ? "rounded-tr-none" : "rounded-tl-none")}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/50 text-lg">
          {icon}
        </div>
        <div className="flex flex-col flex-1">
          <span className={cn("text-sm font-semibold", titleColor)}>{title}</span>
          <span className="text-[13px] text-muted-foreground/90">
            {status === "missed" && duration === 0 ? "No answer" : `Duration: ${formatDuration(duration)}`}
          </span>
        </div>
      </div>
      {/* Time is rendered in the message bubble footer, so we don't necessarily need it here if MessageBubble handles it, but let's see. The prompt example had Time inside the card or next to it. Since we embed this in MessageBubble, MessageBubble handles the time at the bottom. */}
    </div>
  );
};

export default CallHistoryCard;
