import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Smile, Send, CornerUpLeft, X, Loader2 } from "lucide-react";

const EMOJIS = ["😊", "👍", "💡", "👋", "🎉", "🔥", "🙏", "💻", "✨", "💯"];

export function MessageInput({ 
  chatId, 
  onSendMessage, 
  onUploadAttachment, 
  onTypingStateChange, 
  replyTarget, 
  onClearReply 
}) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Clear input text when chat changes
  useEffect(() => {
    setText("");
    setShowEmojiPicker(false);
  }, [chatId]);

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (chatId) {
      onTypingStateChange(chatId, true);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        onTypingStateChange(chatId, false);
      }, 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSendMessage(chatId, text.trim(), replyTarget?._id);
    setText("");
    onClearReply();
    setShowEmojiPicker(false);
    onTypingStateChange(chatId, false);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onUploadAttachment(chatId, file, replyTarget?._id);
      onClearReply();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleInsertEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="p-3 border-t border-border/40 bg-card/45 flex-shrink-0">
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Reply Preview Header */}
        {replyTarget && (
          <div className="flex items-center justify-between p-2 rounded-[var(--radius-sm)] bg-secondary/80 border border-border/40 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground truncate">
              <CornerUpLeft className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
              <span className="truncate">
                Replying to: <strong>{replyTarget.text || (replyTarget.file ? replyTarget.file.name : "deleted message")}</strong>
              </span>
            </div>
            <button 
              type="button" 
              onClick={onClearReply}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Composer Frame */}
        <div className="flex items-center gap-2">
          {/* File upload trigger */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".png,.jpg,.jpeg,.webp,.pdf,.doc,.docx"
          />
          <button
            type="button"
            onClick={handleAttachmentClick}
            disabled={uploading}
            className="p-2 hover:bg-secondary rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-all flex-shrink-0"
            title="Add attachment"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Paperclip className="w-5 h-5" />
            )}
          </button>

          {/* Input Element */}
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 py-2 px-3 border border-border/50 rounded-[var(--radius-sm)] text-sm bg-secondary/60 text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
          />

          {/* Emoji Trigger */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-secondary rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-all"
              title="Emojis"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0 p-2 bg-card border border-border rounded-[var(--radius-sm)] shadow-[var(--shadow-lg)] flex gap-1.5 z-50">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleInsertEmoji(emoji)}
                    className="hover:scale-125 transition-transform p-1 text-base"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Send Button */}
          <button
            type="submit"
            disabled={!text.trim() && !replyTarget}
            className="p-2 rounded-[var(--radius-sm)] bg-primary text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-all flex-shrink-0"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
