import React, { useState, useEffect, useRef } from "react";
import { 
  Paperclip, 
  Send, 
  CornerDownRight, 
  CornerUpLeft, 
  Smile, 
  ArrowLeft, 
  Briefcase, 
  Download, 
  FileText,
  User,
  Globe,
  Loader2,
  X
} from "lucide-react";
import { MessageBubble } from "./MessageBubble.jsx";
import { MessageSkeleton } from "./ChatSkeleton.jsx";
import { cn } from "@/lib/Referrals/utils.js";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { applicationsApi } from "@/services/Referrals/application.js";

// Common Emojis
const EMOJIS = ["😊", "👍", "💡", "👋", "🎉", "🔥", "🙏", "💻", "✨", "💯"];

export function ChatWindow({ 
  chat, 
  messages, 
  loadingMessages, 
  onSendMessage, 
  onUploadAttachment,
  onEditMessage,
  onDeleteMessage,
  onMarkRead,
  isTyping,
  otherUserTyping,
  onBack,
  onTypingStateChange,
  onOpenAttachment
}) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef(null);
  const feedContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const currentRole = (user?.role || user?.accountType || "student").toLowerCase();
  const participant = currentRole === "alumni" ? chat?.student : chat?.alumni;
  const isOnline = chat?.student?.isOnline || chat?.alumni?.isOnline;

  // Auto scroll to bottom when new message arrives or chat changes
  useEffect(() => {
    scrollToBottom();
    if (chat?._id) {
      onMarkRead(chat._id);
    }
  }, [messages?.length, chat?._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle typing state
  const handleInputChange = (e) => {
    setText(e.target.value);

    // Socket typing broadcast
    if (chat?._id) {
      onTypingStateChange(chat._id, true);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        onTypingStateChange(chat._id, false);
      }, 3000);
    }
  };

  // Submit Text Message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSendMessage(chat._id, text.trim(), replyTarget?._id);
    setText("");
    setReplyTarget(null);
    setShowEmojiPicker(false);
    onTypingStateChange(chat._id, false);
  };

  // Trigger File Input Click
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  // Handle File Attachment Selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onUploadAttachment(chat._id, file, replyTarget?._id);
      setReplyTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Insert Emoji
  const handleInsertEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Quick Action: Download Resume (Alumni Only)
  const handleDownloadResume = () => {
    if (currentRole === "alumni" && chat?.student?._id) {
      applicationsApi.downloadStudentResume(chat.student._id);
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-card/10 text-center p-8 border border-border/10 rounded-[var(--radius-lg)] m-2">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <CornerDownRight className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Select a conversation</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1">
          Pick a contact from the sidebar list to start exchanging messages.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-card/25 overflow-hidden">
      {/* Chat Window Header */}
      <div className="p-4 border-b border-border/40 bg-card/45 flex flex-col md:flex-row md:items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          <button 
            onClick={onBack}
            className="md:hidden p-2 hover:bg-secondary rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Participant Info */}
          <div className="relative">
            {participant?.image ? (
              <img
                src={participant.image}
                alt={`${participant.firstName} ${participant.lastName}`}
                className="w-10 h-10 rounded-full border border-border/20 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold border border-primary/30 uppercase">
                {`${participant?.firstName?.[0] || ""}${participant?.lastName?.[0] || ""}`}
              </div>
            )}
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />
            )}
          </div>

          <div>
            <h3 className="font-bold text-sm text-foreground">
              {participant?.firstName} {participant?.lastName}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isOnline ? "Active Now" : "Offline"}
            </p>
          </div>
        </div>

        {/* Quick Actions Header */}
        <div className="flex flex-wrap items-center gap-2">
          {currentRole === "alumni" ? (
            <>
              {/* Alumni Actions */}
              <button 
                onClick={handleDownloadResume}
                className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold bg-secondary/80 border border-border/50 text-foreground hover:bg-secondary transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Resume
              </button>
              {participant?.githubUrl && (
                <a 
                  href={participant.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold bg-secondary/80 border border-border/50 text-foreground hover:bg-secondary transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
              {participant?.linkedinUrl && (
                <a 
                  href={participant.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold bg-secondary/80 border border-border/50 text-foreground hover:bg-secondary transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              )}
            </>
          ) : (
            <>
              {/* Student Actions */}
              {participant?.company && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-sm)] text-[10px] bg-primary/10 border border-primary/20 text-primary font-bold">
                  <Briefcase className="w-3 h-3" />
                  {participant.company}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Message Feed Container */}
      <div 
        ref={feedContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/10 scrollbar-thin scrollbar-thumb-muted"
      >
        {loadingMessages && messages.length === 0 ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
            <CornerDownRight className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs">Exchanging messages regarding the referral request.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {[...messages].reverse().map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                onReply={setReplyTarget}
                onEdit={onEditMessage}
                onDelete={onDeleteMessage}
                onOpenAttachment={onOpenAttachment}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Typing Indicator Panel */}
      {otherUserTyping && (
        <div className="px-6 py-2 text-xs text-muted-foreground/80 italic animate-pulse flex-shrink-0">
          {participant?.firstName || "Contact"} is typing...
        </div>
      )}

      {/* Message Input Composer */}
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
                onClick={() => setReplyTarget(null)}
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
    </div>
  );
}
