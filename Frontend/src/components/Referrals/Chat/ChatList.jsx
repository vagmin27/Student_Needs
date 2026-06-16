import React, { useState } from "react";
import { Search, Briefcase, FileText, ImageIcon } from "lucide-react";
import { cn } from "@/lib/Referrals/utils.js";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";

export function ChatList({ chats, activeChatId, onSelectChat, onlineUsersList }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const currentRole = (user?.role || user?.accountType || "student").toLowerCase();

  // Filter conversations
  const filteredChats = chats.filter((chat) => {
    const participant = currentRole === "alumni" ? chat.student : chat.alumni;
    if (!participant) return false;

    const fullName = `${participant.firstName || ""} ${participant.lastName || ""}`.toLowerCase();
    const company = (participant.company || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) || company.includes(query);
  });

  // Format relative timestamp
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    
    // Check if today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    
    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // Otherwise return date
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Render Last Message Snippet
  const renderMessageSnippet = (msg) => {
    if (!msg) return <span className="text-muted-foreground italic text-xs">No messages yet</span>;
    if (msg.isDeleted) return <span className="text-muted-foreground italic text-xs">This message was deleted</span>;

    if (msg.file) {
      const isImg = msg.file.type.startsWith("image/");
      return (
        <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
          {isImg ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
          {msg.file.name}
        </span>
      );
    }

    return (
      <span className="text-muted-foreground text-xs line-clamp-1 truncate block max-w-[180px]">
        {msg.text}
      </span>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-card/45 border-r border-border/40 overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-border/40 space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground hidden sm:block">Conversations</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts or companies..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-secondary/60 border border-border/50 rounded-[var(--radius-sm)] text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-muted">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <p className="text-sm font-medium text-muted-foreground">No conversations found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Chat connections require active referral requests.</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const participant = currentRole === "alumni" ? chat.student : chat.alumni;
            if (!participant) return null;

            const isChatActive = chat._id === activeChatId;
            const initials = `${participant.firstName?.[0] || ""}${participant.lastName?.[0] || ""}`;
            
            // Live online presence check (via socket online list or chat model flag)
            const isOnline = onlineUsersList.has(participant._id) || participant.isOnline;

            return (
              <button
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-[var(--radius-md)] transition-all border text-left",
                  isChatActive
                    ? "bg-primary/10 border-primary/25 text-foreground"
                    : "bg-transparent border-transparent hover:bg-secondary/45 text-foreground hover:border-border/10"
                )}
              >
                {/* Avatar with Online indicator */}
                <div className="relative flex-shrink-0">
                  {participant.image ? (
                    <img
                      src={participant.image}
                      alt={`${participant.firstName} ${participant.lastName}`}
                      className="w-11 h-11 rounded-full border border-border/20 object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold border border-primary/30 uppercase">
                      {initials}
                    </div>
                  )}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-semibold text-sm truncate block">
                      {participant.firstName} {participant.lastName}
                    </span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {formatTime(chat.lastMessage?.createdAt || chat.updatedAt)}
                    </span>
                  </div>

                  {/* Company/Academic Role Info */}
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate mb-1">
                    {currentRole === "student" && participant.company ? (
                      <span className="flex items-center gap-1 text-[10px] bg-primary/5 text-primary border border-primary/10 px-1.5 py-0.2 rounded-[var(--radius-sm)] font-medium">
                        <Briefcase className="w-2.5 h-2.5" />
                        {participant.company}
                      </span>
                    ) : (
                      <span className="truncate text-muted-foreground/80">
                        {participant.branch || "Student"} {participant.graduationYear ? `(${participant.graduationYear})` : ""}
                      </span>
                    )}
                  </div>

                  {/* Message Snippet */}
                  <div className="flex justify-between items-center gap-1 mt-0.5">
                    {renderMessageSnippet(chat.lastMessage)}
                    {chat.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 min-w-[18px] text-[10px] font-bold bg-primary text-primary-foreground rounded-full text-center leading-none flex-shrink-0 animate-pulse">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
