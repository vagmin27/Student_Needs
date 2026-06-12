import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils.js";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "pdf", "doc", "docx"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const MessageInput = ({
  onSendMessage,
  onUploadAttachment,
  onTypingStateChange,
  isBlocked,
}) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Trigger typing emits on keystrokes
  const handleInputChange = (e) => {
    const val = e.target.value;
    setText(val);

    if (isBlocked) return;

    if (!isTypingRef.current && val.trim() !== "") {
      isTypingRef.current = true;
      onTypingStateChange(true);
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTypingStateChange(false);
      }
    }, 2000);
  };

  // Clear typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validation: Extension check
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error("Unsupported file type. Only JPG, PNG, PDF, and DOCX are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validation: Size check
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 10MB limit.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (isBlocked || isUploading) return;

    const trimmedText = text.trim();
    if (!trimmedText && !file) return;

    try {
      setIsUploading(true);

      // Reset typing status immediately
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTypingStateChange(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      }

      // If file is selected, upload it
      if (file) {
        await onUploadAttachment(file, trimmedText);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        await onSendMessage(trimmedText);
      }

      setText("");
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const isImageFile = file && ["jpg", "jpeg", "png", "gif", "webp"].includes(file.name.split(".").pop().toLowerCase());

  return (
    <form onSubmit={handleSend} className="border-t border-border/45 bg-card/75 backdrop-blur-md p-3 md:p-4 flex flex-col gap-2 relative">
      {/* File attachment preview bar */}
      {file && (
        <div className="flex items-center justify-between gap-3 p-2.5 bg-slate-900/50 border border-border/20 rounded-[var(--radius-md)] max-w-sm animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 bg-slate-800 rounded-[var(--radius-sm)] text-primary shrink-0">
              {isImageFile ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-foreground truncate">{file.name}</span>
              <span className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="p-1 hover:bg-slate-800 rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main input layout */}
      <div className="flex items-end gap-2 md:gap-3">
        {/* Paperclip upload trigger */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={isBlocked || isUploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBlocked || isUploading}
          className={cn(
            "p-3 rounded-[var(--radius-md)] bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-foreground border border-border/30 hover:border-border transition-all duration-200 cursor-pointer",
            (isBlocked || isUploading) && "opacity-45 cursor-not-allowed"
          )}
          title="Attach study materials (Max 10MB)"
        >
          <Paperclip className="w-4.5 h-4.5" />
        </button>

        {/* Text Area */}
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isBlocked
                ? "This conversation is blocked"
                : "Type message... (Press Enter to send, Shift+Enter for new line)"
            }
            disabled={isBlocked || isUploading}
            rows={1}
            className="w-full min-h-[44px] max-h-[120px] py-2.5 px-4 bg-slate-905 border border-border/30 rounded-[var(--radius-md)] outline-none focus:border-primary text-[14.5px] text-foreground placeholder-muted-foreground/60 transition-colors resize-none overflow-y-auto"
            style={{ height: "44px" }}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isBlocked || isUploading || (!text.trim() && !file)}
          className={cn(
            "p-3 rounded-[var(--radius-md)] bg-primary hover:bg-primary/95 text-white font-medium shadow-sm transition-all duration-200 flex items-center justify-center cursor-pointer",
            (isBlocked || isUploading || (!text.trim() && !file)) && "opacity-45 cursor-not-allowed"
          )}
          title="Send message"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
