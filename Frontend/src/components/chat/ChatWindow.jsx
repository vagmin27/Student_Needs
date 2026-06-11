import React, { useRef, useEffect, useState } from "react";
import { ArrowLeft, Phone, Video, Bot, Ban, AlertCircle, MoreHorizontal } from "lucide-react";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import OnlineBadge from "./OnlineBadge.jsx";
import { cn } from "@/lib/utils.js";
import toast from "react-hot-toast";

export const ChatWindow = ({
  chat,
  messages,
  loadingMessages,
  onSendMessage,
  onUploadAttachment,
  onEditMessage,
  onDeleteMessage,
  onMarkRead,
  isTyping,
  onlineUsersList,
  onBack,
  onTypingStateChange,
  onOpenAttachment,
  onToggleBlock,
  onReportChat,
  onLoadMore,
  hasMore,
  onStartCall, // Video/audio call callback stub
  onAskAiTutor, // AI tutoring callback stub
  currentUserId,
}) => {
  const scrollRef = useRef(null);
  const topObserverRef = useRef(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (chat && onMarkRead) {
      onMarkRead(chat._id);
    }
  }, [messages.length, chat?._id]);

  // Infinite scroll intersection observer
  useEffect(() => {
    if (!onLoadMore || !hasMore || loadingMessages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentElem = topObserverRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [hasMore, onLoadMore, loadingMessages]);

  if (!chat) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center text-center p-6 bg-card/40 select-none">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 animate-pulse">
          <Bot className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Start Learning & Solving Needs</h3>
        <p className="text-sm text-muted-foreground/75 mt-1.5 max-w-sm">
          Select an active tutor chat from the sidebar or book a session to open real-time consultation.
        </p>
      </div>
    );
  }

  const isOnline = onlineUsersList.has(chat.partner?._id?.toString());

  const handleStartCall = (type) => {
    toast.success(`Calling ${chat.partner?.name}... (Initializing video/audio channels)`);
    if (typeof onStartCall === "function") {
      onStartCall(chat.partner?._id, type);
    }
  };

  const handleAskAi = () => {
    const question = window.prompt("Ask the AI Tutor a conceptual question based on your chat:");
    if (!question || question.trim() === "") return;
    toast.success("Query sent to AI Tutor...");
    if (typeof onAskAiTutor === "function") {
      onAskAiTutor(question, chat.partner?.expertise);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-card/25 backdrop-blur-md relative select-none">
      {/* Chat Window Header */}
      <div className="h-16 border-b border-border/45 bg-card/75 backdrop-blur-md px-4 flex items-center justify-between shrink-0 relative z-20">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back button on mobile */}
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-850 rounded-xl text-slate-400 hover:text-foreground md:hidden shrink-0 transition-colors cursor-pointer"
            title="Back to conversations"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>

          {/* User Status Details */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-primary">
              {chat.partner?.pic ? (
                <img
                  src={chat.partner.pic.startsWith("http") ? chat.partner.pic : `http://localhost:8000/uploads/${chat.partner.pic}`}
                  alt={chat.partner.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm uppercase">{(chat.partner?.name || "U")[0]}</span>
              )}
            </div>
            {isOnline && (
              <OnlineBadge className="absolute -bottom-0.5 -right-0.5 border border-slate-900 rounded-full w-2.5 h-2.5" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-foreground truncate leading-tight">
              {chat.partner?.name || (chat.partner?.role === "student" ? "Unknown Student" : "Unknown Tutor")}
            </span>
            <span className="text-[11px] text-muted-foreground/75 truncate select-none leading-none">
              {chat.booking?.subject || chat.partner?.expertise || (isOnline ? "Online" : "Offline")}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <button
            onClick={() => handleStartCall("audio")}
            disabled={chat.isBlocked}
            className="p-2.5 hover:bg-slate-850 rounded-xl text-slate-400 hover:text-foreground transition-all duration-200 cursor-pointer disabled:opacity-40"
            title="Audio call tutor"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleStartCall("video")}
            disabled={chat.isBlocked}
            className="p-2.5 hover:bg-slate-850 rounded-xl text-slate-400 hover:text-foreground transition-all duration-200 cursor-pointer disabled:opacity-40"
            title="Video consult tutor"
          >
            <Video className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleAskAi}
            disabled={chat.isBlocked}
            className="p-2.5 hover:bg-slate-850 rounded-xl text-slate-400 hover:text-foreground transition-all duration-200 cursor-pointer disabled:opacity-40"
            title="Concept check with AI Tutor"
          >
            <Bot className="w-4.5 h-4.5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
              className="p-2.5 hover:bg-slate-850 rounded-xl text-slate-400 hover:text-foreground transition-all duration-200 cursor-pointer"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {headerMenuOpen && (
              <div className="absolute right-0 top-12 bg-slate-950 border border-slate-800 rounded-xl shadow-xl z-50 py-1.5 min-w-[150px] animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    onToggleBlock(chat._id, !chat.isBlocked);
                    setHeaderMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-950/20 text-left transition-colors cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" /> {chat.isBlocked ? "Unblock User" : "Block User"}
                </button>
                <button
                  onClick={() => {
                    onReportChat(chat._id);
                    setHeaderMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-yellow-400 hover:bg-yellow-950/20 text-left transition-colors cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Report Conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meeting Link Banner */}
      {chat.booking?.meetingLink && !chat.booking?.isReadOnly && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-3 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Class Meeting Link Available</span>
              <span className="text-xs text-muted-foreground">Join your scheduled class here.</span>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {chat.partner?.role === "student" ? (
              // Current user is tutor
              <>
                <button
                  onClick={() => { navigator.clipboard.writeText(chat.booking.meetingLink); toast.success("Copied to clipboard!"); }}
                  className="flex-1 md:flex-none justify-center px-3 py-1.5 bg-card hover:bg-slate-800 border border-border rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  📋 Copy
                </button>
                <a
                  href={chat.booking.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 md:flex-none justify-center px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  🚀 Open
                </a>
              </>
            ) : (
              // Current user is student
              <a
                href={chat.booking.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto justify-center px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 shadow-lg shadow-primary/20"
              >
                🚀 Join Class
              </a>
            )}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 relative z-10 scrollbar-hide"
        data-lenis-prevent="true"
      >
        {/* Lazy loading check anchor */}
        {hasMore && (
          <div ref={topObserverRef} className="flex justify-center py-2 shrink-0">
            {loadingMessages ? (
              <span className="spinner spinner-sm" />
            ) : (
              <span className="text-[10px] text-muted-foreground/50">Scroll up to load older messages</span>
            )}
          </div>
        )}

        {/* Message bubble items */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            currentUserId={currentUserId}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            onOpenAttachment={onOpenAttachment}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="pl-2.5 py-1.5 animate-in fade-in duration-200">
            <TypingIndicator name={chat.partner?.name} />
          </div>
        )}
      </div>

      {/* Message Input bar or Read-only mode */}
      {chat.booking?.isReadOnly ? (
        <div className="p-4 text-center text-sm font-medium text-muted-foreground bg-card/40 border-t border-border/45 italic">
          {chat.booking.statusMessage || "This chat is read-only."}
        </div>
      ) : (
        <MessageInput
          onSendMessage={(text) => onSendMessage(chat._id, text)}
          onUploadAttachment={(file, text) => onUploadAttachment(chat._id, file, text)}
          onTypingStateChange={(typing) => onTypingStateChange(chat._id, typing)}
          isBlocked={chat.isBlocked}
        />
      )}
    </div>
  );
};

export default ChatWindow;
