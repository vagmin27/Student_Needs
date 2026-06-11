import React, { useState } from "react";
import { Check, CheckCheck, Trash2, Edit2, FileText, Download, X, Save } from "lucide-react";
import { cn } from "@/lib/utils.js";
import CallHistoryCard from "./CallHistoryCard.jsx";

export const MessageBubble = ({
  message,
  currentUserId,
  onEditMessage,
  onDeleteMessage,
  onOpenAttachment,
}) => {
  // Normalize legacy JSON system call messages to the new 'call' format for rendering
  let normalizedMessage = { ...message };
  if (normalizedMessage.type === "system" && normalizedMessage.text && (normalizedMessage.text.includes("audio_call") || normalizedMessage.text.includes("video_call"))) {
    try {
      const parsed = JSON.parse(normalizedMessage.text);
      if (parsed.action) {
        normalizedMessage.type = "call";
        const isVideo = parsed.action === "video_call";
        normalizedMessage.metadata = {
          callType: isVideo ? "video" : "audio",
          status: parsed.duration > 0 ? "completed" : "missed",
          duration: parsed.duration,
          startedAt: parsed.startedAt,
          endedAt: parsed.endedAt,
          initiatedBy: normalizedMessage.senderId
        };
      }
    } catch (e) {
      // Ignore parse errors, just render as normal system text
    }
  }

  // Determine visual direction
  // For normal messages, it's based on senderId
  // For calls, it's based on metadata.initiatedBy
  let isOutgoing = false;
  if (normalizedMessage.type === "call" && normalizedMessage.metadata) {
    isOutgoing = normalizedMessage.metadata.initiatedBy?.toString() === currentUserId?.toString();
  } else {
    isOutgoing = normalizedMessage.senderId?.toString() === currentUserId?.toString();
  }
  
  const isSelf = isOutgoing; // For backward compatibility with other features

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(normalizedMessage.message || normalizedMessage.text || "");

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (_) {
      return "";
    }
  };

  const handleEditSubmit = () => {
    if (editText.trim() === "") return;
    onEditMessage(normalizedMessage._id, editText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(normalizedMessage.message || normalizedMessage.text || "");
    setIsEditing(false);
  };

  const isImage = (mimeType) => {
    return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mimeType);
  };

  // Render checkmarks for self messages
  const renderStatusTicks = () => {
    if (!isSelf) return null;
    
    if (normalizedMessage.seen) {
      return <CheckCheck className="w-3.5 h-3.5 text-cyan-400" title="Seen" />;
    } else if (normalizedMessage.delivered) {
      return <CheckCheck className="w-3.5 h-3.5 text-slate-400" title="Delivered" />;
    } else {
      return <Check className="w-3.5 h-3.5 text-slate-400" title="Sent" />;
    }
  };

  return (
    <div
      className={cn(
        "flex w-full mb-3.5 group",
        normalizedMessage.type === "system" || normalizedMessage.type === "meeting_link" ? "justify-center" : isSelf ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("flex flex-col", normalizedMessage.type === "system" || normalizedMessage.type === "meeting_link" ? "items-center w-full max-w-sm" : isSelf ? "items-end max-w-[75%] md:max-w-[65%]" : "items-start max-w-[75%] md:max-w-[65%]")}>
        {/* Sender Name tag for multi-party look or debug (optional) */}
        
        {/* Message body container */}
        <div className="relative flex items-center">
          {/* Action button overlay on hover for self messages */}
          {isSelf && !normalizedMessage.deleted && !isEditing && (
            <div className="opacity-0 group-hover:opacity-100 flex gap-1.5 mr-2 transition-opacity duration-200">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                title="Edit message"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteMessage(normalizedMessage._id)}
                className="p-1.5 bg-slate-800 hover:bg-red-950/80 text-slate-300 hover:text-red-400 rounded-lg border border-slate-700 hover:border-red-900 transition-colors"
                title="Delete message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div
            className={cn(
              normalizedMessage.type === "system" || normalizedMessage.type === "meeting_link"
                ? "bg-transparent border-transparent text-muted-foreground/80"
                : normalizedMessage.type === "call"
                ? "bg-transparent border-transparent p-0" // Call card has its own styling
                : "px-4 py-2.5 rounded-2xl border backdrop-blur-md shadow-sm",
              normalizedMessage.type !== "system" && normalizedMessage.type !== "meeting_link" && normalizedMessage.type !== "call" && normalizedMessage.deleted
                ? "bg-slate-900/40 border-slate-800 text-muted-foreground/60 italic"
                : normalizedMessage.type !== "system" && normalizedMessage.type !== "meeting_link" && normalizedMessage.type !== "call" && isSelf
                ? "bg-primary/20 border-primary/30 text-foreground rounded-tr-none"
                : normalizedMessage.type !== "system" && normalizedMessage.type !== "meeting_link" && normalizedMessage.type !== "call"
                ? "bg-card border-border/40 text-foreground rounded-tl-none"
                : ""
            )}
          >
            {/* Inline editing mode */}
            {isEditing ? (
              <div className="flex flex-col gap-2 min-w-[200px]">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full text-sm bg-slate-950 border border-border rounded-lg p-2 outline-none text-foreground"
                  rows={2}
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {/* Text / System / Call Message */}
                {normalizedMessage.type === "call" ? (
                  <div title={`Call started: ${formatTime(normalizedMessage.metadata?.startedAt)}\nCall ended: ${formatTime(normalizedMessage.metadata?.endedAt)}`}>
                    <CallHistoryCard message={normalizedMessage} currentUserId={currentUserId} />
                  </div>
                ) : normalizedMessage.type === "system" || normalizedMessage.type === "meeting_link" ? (
                  <div className="text-[12.5px] text-center italic opacity-80 break-words whitespace-pre-wrap px-4 py-1">
                    {normalizedMessage.message || normalizedMessage.text}
                  </div>
                ) : (
                  (normalizedMessage.message || normalizedMessage.text) && <p className="text-[14.5px] leading-relaxed break-words whitespace-pre-wrap">{normalizedMessage.message || normalizedMessage.text}</p>
                )}

                {/* Attachments rendering */}
                {normalizedMessage.attachments && normalizedMessage.attachments.length > 0 && (
                  <div className="flex flex-col gap-2 mt-1">
                    {normalizedMessage.attachments.map((att, idx) => (
                      <div key={idx} className="overflow-hidden rounded-xl">
                        {isImage(att.mimeType) ? (
                          <div 
                            className="relative group/att cursor-zoom-in border border-border/20 rounded-xl overflow-hidden max-w-[280px]"
                            onClick={() => onOpenAttachment(att.url, att.name)}
                          >
                            <img
                              src={att.url}
                              alt={att.name}
                              className="max-h-[180px] w-full object-cover transition-transform duration-300 group-hover/att:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/att:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <span className="text-white text-xs font-medium bg-black/60 px-2.5 py-1 rounded-full">Preview</span>
                            </div>
                          </div>
                        ) : (
                          // Document Cards (PDF, DOCX)
                          <div className="flex items-center justify-between gap-4 p-3 bg-slate-900/60 border border-slate-800 rounded-xl max-w-[280px]">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="p-2 bg-slate-850 rounded-lg text-primary">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium text-foreground truncate" title={att.name}>
                                  {att.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground uppercase">
                                  {att.mimeType.split("/")[1] || "File"}
                                </span>
                              </div>
                            </div>
                            <a
                              href={att.url}
                              download={att.name}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 hover:bg-slate-850 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                              title="Download document"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action button overlay on hover for received messages */}
          {!isSelf && !normalizedMessage.deleted && (
            <div className="opacity-0 group-hover:opacity-100 flex gap-1.5 ml-2 transition-opacity duration-200">
              {/* Optional: Add quick reply or report flags */}
            </div>
          )}
        </div>

        {/* Timestamp and ticks status indicators */}
        {normalizedMessage.type !== "system" && normalizedMessage.type !== "meeting_link" && (
          <div className={cn("flex items-center gap-1.5 mt-1 px-1.5 text-[10px] text-muted-foreground select-none")}>
            <span>{formatTime(normalizedMessage.createdAt)}</span>
            {normalizedMessage.isEdited && <span>• Edited</span>}
            {renderStatusTicks()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
