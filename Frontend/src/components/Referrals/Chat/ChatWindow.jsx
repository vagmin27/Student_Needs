import React, { useEffect, useRef } from "react";
import { CornerDownRight } from "lucide-react";
import { MessageBubble } from "./MessageBubble.jsx";
import { MessageSkeleton } from "./ChatSkeleton.jsx";
import { ChatHeader } from "./ChatHeader.jsx";
import { MessageInput } from "./MessageInput.jsx";
import { TypingIndicator } from "./TypingIndicator.jsx";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { applicationsApi } from "@/services/Referrals/application.js";

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
  const [replyTarget, setReplyTarget] = React.useState(null);

  const messagesEndRef = useRef(null);
  const feedContainerRef = useRef(null);

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
      <ChatHeader
        participant={participant}
        currentRole={currentRole}
        isOnline={isOnline}
        onBack={onBack}
        onDownloadResume={handleDownloadResume}
      />

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
      <TypingIndicator
        otherUserTyping={otherUserTyping}
        participantName={participant?.firstName}
      />

      {/* Message Input Composer */}
      <MessageInput
        chatId={chat._id}
        onSendMessage={onSendMessage}
        onUploadAttachment={onUploadAttachment}
        onTypingStateChange={onTypingStateChange}
        replyTarget={replyTarget}
        onClearReply={() => setReplyTarget(null)}
      />
    </div>
  );
}
