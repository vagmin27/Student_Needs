import React, { useState } from "react";
import { 
  Check, 
  CheckCheck, 
  CornerUpLeft, 
  Edit3, 
  Trash2, 
  Copy, 
  Download, 
  FileText, 
  X, 
  Save, 
  Eye 
} from "lucide-react";
import { cn } from "@/lib/Referrals/utils.js";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { API_BASE_URL } from "@/config/api.js";

export function MessageBubble({ 
  message, 
  onReply, 
  onEdit, 
  onDelete,
  onOpenAttachment
}) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text || "");

  const userId = user?.id || user?._id;
  const isMe = message.sender.toString() === userId.toString();

  // Format message time
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Copy text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text || "");
    alert("Message copied to clipboard!");
  };

  // Trigger Edit submit
  const handleEditSubmit = () => {
    if (!editText.trim() || editText.trim() === message.text) {
      setIsEditing(false);
      return;
    }
    onEdit(message._id, editText);
    setIsEditing(false);
  };

  // Render Attachment card or preview
  const renderAttachment = () => {
    if (!message.file) return null;

    const { url, name, type, size } = message.file;
    const isImage = type.startsWith("image/");

    // Derive absolute download path using token parameter if needed
    const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
    const downloadUrl = `${url.startsWith("http") ? "" : API_BASE_URL.replace(/\/api\/v1$/, "")}${url}?token=${token}`;

    if (isImage) {
      return (
        <div className="relative group max-w-xs rounded-lg overflow-hidden border border-border/20 mt-2 bg-card/60">
          <img 
            src={downloadUrl} 
            alt={name} 
            className="w-full max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={() => onOpenAttachment(downloadUrl, name)}
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
            <a 
              href={downloadUrl} 
              download={name}
              className="p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
              title="Download image"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 p-3 bg-secondary/80 border border-border/40 rounded-xl max-w-xs mt-2">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{name}</p>
          <p className="text-[10px] text-muted-foreground">
            {(size / 1024).toFixed(1)} KB
          </p>
        </div>
        <a 
          href={downloadUrl} 
          download={name}
          className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          title="Download file"
        >
          <Download className="w-4 h-4" />
        </a>
      </div>
    );
  };

  // Render Reply Reference
  const renderReplyReference = () => {
    if (!message.replyTo) return null;

    const refMsg = message.replyTo;
    const refSenderName = refMsg.senderType === "student" ? "Student" : "Alumni";

    return (
      <div className="p-2 mb-1.5 rounded-lg bg-black/5 dark:bg-white/5 border-l-3 border-primary/45 text-left text-xs opacity-75 max-w-full truncate">
        <span className="font-semibold text-[10px] text-primary block uppercase">
          {refSenderName}
        </span>
        <span className="truncate block text-muted-foreground">
          {refMsg.text || (refMsg.file ? `Attachment: ${refMsg.file.name}` : "deleted message")}
        </span>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex w-full group",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex flex-col max-w-[70%] md:max-w-[65%]",
        isMe ? "items-end" : "items-start"
      )}>
        {/* Reply reference preview */}
        {renderReplyReference()}

        {/* Message Bubble Frame */}
        <div className="flex items-center gap-2">
          {/* Action Menu (Visible on Hover for Sent/Received) */}
          {isMe && !message.isDeleted && !isEditing && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <button 
                onClick={() => onReply(message)} 
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
                title="Reply"
              >
                <CornerUpLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setIsEditing(true)} 
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => onDelete(message._id)} 
                className="p-1 hover:bg-secondary rounded text-destructive hover:text-destructive-foreground"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {!isMe && !message.isDeleted && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity order-2">
              <button 
                onClick={() => onReply(message)} 
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
                title="Reply"
              >
                <CornerUpLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Actual Bubble */}
          <div
            className={cn(
              "p-3.5 rounded-2xl relative border",
              message.isDeleted
                ? "bg-muted/15 border-border/10 text-muted-foreground/60 italic"
                : isMe
                  ? "bg-primary text-primary-foreground border-primary/20 rounded-tr-none shadow-sm"
                  : "bg-card text-foreground border-border/40 rounded-tl-none shadow-sm"
            )}
          >
            {/* Inline editing */}
            {isEditing ? (
              <div className="flex flex-col gap-2 min-w-[200px]">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 bg-secondary text-foreground text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={2}
                  autoFocus
                />
                <div className="flex justify-end gap-1.5">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground rounded"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleEditSubmit}
                    className="p-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded"
                    title="Save"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Message text */}
                <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">
                  {message.text}
                </p>

                {/* Render attachment */}
                {renderAttachment()}
              </>
            )}

            {/* Metadata (Time, Status indicator) */}
            {!isEditing && (
              <div className={cn(
                "flex items-center gap-1 text-[10px] mt-1.5 justify-end select-none",
                isMe ? "text-primary-foreground/75" : "text-muted-foreground/75"
              )}>
                <span>{formatTime(message.createdAt)}</span>
                
                {message.isEdited && (
                  <>
                    <span>&middot;</span>
                    <span title={`Edited at: ${new Date(message.editedAt || message.updatedAt).toLocaleString()}`}>Edited</span>
                  </>
                )}

                {isMe && !message.isDeleted && (
                  <span className="ml-0.5">
                    {message.isRead ? (
                      <CheckCheck className="w-3.5 h-3.5 text-sky-300 dark:text-sky-400" />
                    ) : (
                      <Check className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
