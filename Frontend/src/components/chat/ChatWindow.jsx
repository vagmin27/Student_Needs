import React, { useRef, useEffect, useState } from "react";
import { ArrowLeft, Phone, Video, Bot, Ban, AlertCircle, MoreHorizontal, Loader2 } from "lucide-react";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import OnlineBadge from "./OnlineBadge.jsx";
import { cn } from "@/lib/utils.js";
import toast from "react-hot-toast";
import VideoCallModal from "../Tutorials/calls/VideoCallModal.jsx";
import TutorialAssistantDrawer from "./TutorialAssistantDrawer.jsx";

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
  socket,
}) => {
  const scrollRef = useRef(null);
  const topObserverRef = useRef(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  // AI Drawer state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // WebRTC Call state
  const [callState, setCallState] = useState(null); // 'incoming', 'calling', 'active', null
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [isCallLoading, setIsCallLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;
    
    const handleCallAccepted = (data) => {
      setIsCallLoading(false);
      setCallState("active");
    };

    const handleCallDeclined = (data) => {
      setIsCallLoading(false);
      setCallState(null);
      toast.error("Call was declined.");
    };

    const handleCallError = (data) => {
      setIsCallLoading(false);
      setCallState(null);
      toast.error(data.message || "Call error.");
    };

    const handleUserOffline = (data) => {
      setIsCallLoading(false);
      setCallState(null);
      toast.error(data.message || "User unavailable. Try later.");
    };

    const handleCancelDuplicate = (data) => {
      if (callState === "incoming") {
        setIsCallLoading(false);
        setCallState(null);
        setIncomingCallData(null);
      }
    };

    socket.on("call:accepted", handleCallAccepted);
    socket.on("call:declined", handleCallDeclined);
    socket.on("call:error", handleCallError);
    socket.on("call:user_offline", handleUserOffline);
    socket.on("call:cancel_duplicate", handleCancelDuplicate);

    return () => {
      socket.off("call:accepted", handleCallAccepted);
      socket.off("call:declined", handleCallDeclined);
      socket.off("call:error", handleCallError);
      socket.off("call:user_offline", handleUserOffline);
      socket.off("call:cancel_duplicate", handleCancelDuplicate);
    };
  }, [socket, callState]);

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

  const isOnline = chat ? onlineUsersList.has(chat.partner?._id?.toString()) : false;
  // Adding log for testing
  useEffect(() => {
    if (chat?.partner?._id) {
      console.log(`[ONLINE USERS RECEIVED] timestamp=${new Date().toISOString()} isOnline=${isOnline} partnerId=${chat.partner._id}`);
    }
  }, [isOnline, chat?.partner?._id]);

  if (!chat) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center text-center p-6 bg-card/40 select-none">
        <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-primary/10 flex items-center justify-center text-primary mb-4 animate-pulse">
          <Bot className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Start Learning & Solving Needs</h3>
        <p className="text-sm text-muted-foreground/75 mt-1.5 max-w-sm">
          Select an active tutor chat from the sidebar or book a session to open real-time consultation.
        </p>
      </div>
    );
  }

  const handleStartCall = async (type) => {
    console.log(`[START CALL CLICKED] timestamp=${new Date().toISOString()} type=${type} conversationId=${chat?._id}`);
    if (!socket || !chat?.partner?._id) return;
    setIsCallLoading(true);

    // Wait for socket to be ready
    if (socket.waitForSocket) {
      const isReady = await socket.waitForSocket();
      if (!isReady) {
        setIsCallLoading(false);
        toast.error("Failed to connect to server");
        return;
      }
    }

    // Join conversation explicitly
    socket.emit("joinConversation", { conversationId: chat._id });

    console.log("[CALL DEBUG]", {
      socketExists: !!socket,
      socketConnected: socket?.connected,
      waitForSocketExists: !!socket.waitForSocket
    });

    setIncomingCallData({ type }); // store our own intent
    socket.emit("call:start", {
      conversationId: chat._id,
      receiverId: chat.partner._id,
      type
    }, () => {
      console.log("[CALL ACK RECEIVED]");
    });
    setCallState("calling");
  };

  const handleAskAi = () => {
    setIsAiDrawerOpen(true);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-card/25 backdrop-blur-md relative select-none">
      {/* Chat Window Header */}
      <div className="h-16 border-b border-border/45 bg-card/75 backdrop-blur-md px-4 flex items-center justify-between shrink-0 relative z-20">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back button on mobile */}
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-850 rounded-[var(--radius-md)] text-slate-400 hover:text-foreground md:hidden shrink-0 transition-colors cursor-pointer"
            title="Back to conversations"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>

          {/* User Status Details */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-primary">
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
            disabled={chat.isBlocked || isCallLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-[var(--radius-md)] text-xs font-medium text-slate-300 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-40 border border-slate-700/50"
            title="Audio call tutor"
          >
            {isCallLoading && incomingCallData?.type === "audio" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Phone className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">Audio Call</span>
          </button>
          <button
            onClick={() => handleStartCall("video")}
            disabled={chat.isBlocked || isCallLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-[var(--radius-md)] text-xs font-medium text-slate-300 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-40 border border-slate-700/50"
            title="Video consult tutor"
          >
            {isCallLoading && incomingCallData?.type === "video" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
            <span className="hidden lg:inline">Video Session</span>
          </button>
          <button
            onClick={handleAskAi}
            disabled={chat.isBlocked}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-[var(--radius-md)] text-xs font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 border border-primary/20 shadow-sm"
            title="Concept check with AI Tutor"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden md:inline">✨ AI Study Assistant</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
              className="p-2.5 hover:bg-slate-850 rounded-[var(--radius-md)] text-slate-400 hover:text-foreground transition-all duration-200 cursor-pointer"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {headerMenuOpen && (
              <div className="absolute right-0 top-12 bg-slate-950 border border-slate-800 rounded-[var(--radius-md)] shadow-xl z-50 py-1.5 min-w-[150px] animate-in fade-in zoom-in-95 duration-100">
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
                  className="flex-1 md:flex-none justify-center px-3 py-1.5 bg-card hover:bg-slate-800 border border-border rounded-[var(--radius-sm)] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  📋 Copy
                </button>
                <a
                  href={chat.booking.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 md:flex-none justify-center px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-[var(--radius-sm)] text-xs font-medium transition-colors flex items-center gap-1.5"
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
                className="w-full md:w-auto justify-center px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-[var(--radius-sm)] text-sm font-medium transition-colors flex items-center gap-1.5 shadow-lg shadow-primary/20"
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

      {/* AI Assistant Drawer */}
      <TutorialAssistantDrawer 
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        chatContext={{ conversationId: chat._id, messages, booking: chat.booking }}
      />

      {/* Video Call Modal for Caller */}
      {callState && callState !== "incoming" && (
        <VideoCallModal 
          socket={socket}
          conversationId={chat._id}
          currentUserId={currentUserId}
          callState={callState}
          incomingCallData={incomingCallData}
          onAccept={() => setCallState("active")}
          onClose={() => {
            setCallState(null);
            setIncomingCallData(null);
            setIsCallLoading(false);
          }}
          onSwitchToBrowser={() => {
            // Fallback to meetingLink or generated route
            window.open(chat.booking?.meetingLink || `/tutorials/live/${chat._id}`, '_blank');
          }}
          meetingLink={chat.booking?.meetingLink}
        />
      )}
    </div>
  );
};

export default ChatWindow;
