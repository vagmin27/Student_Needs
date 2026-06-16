import React, { useState } from "react";
import { Search, Archive, ArchiveRestore, Ban, CircleAlert, MoreVertical } from "lucide-react";
import OnlineBadge from "./OnlineBadge.jsx";
import { cn } from "@/lib/utils.js";

export const ChatSidebar = ({
  chats,
  activeChatId,
  onSelectChat,
  onlineUsersList,
  onToggleArchive,
  onToggleBlock,
  onReportChat,
}) => {
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState("active"); // "active" | "archived"
  const [openMenuId, setOpenMenuId] = useState(null);

  // Format timestamps nicely
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: "short" });
      } else {
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
      }
    } catch (_) {
      return "";
    }
  };

  const handleToggleMenu = (e, chatId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === chatId ? null : chatId);
  };

  // Deduplicate conversations (merging legacy duplicates by partner)
  const deduplicatedChats = [];
  const seenPartners = new Set();

  chats.forEach((chat) => {
    const partnerId = chat.partner?._id?.toString();
    if (!partnerId) return;
    if (!seenPartners.has(partnerId)) {
      seenPartners.add(partnerId);
      deduplicatedChats.push({ ...chat });
    } else {
      // Merge unread counts from legacy duplicates
      const existing = deduplicatedChats.find(c => c.partner?._id?.toString() === partnerId);
      if (existing) {
        existing.unreadCount += (chat.unreadCount || 0);
      }
    }
  });

  // Filter conversations
  const filteredChats = deduplicatedChats.filter((chat) => {
    const isArchived = !!chat.isArchived;
    const matchesTab = filterTab === "archived" ? isArchived : !isArchived;
    
    if (!matchesTab) return false;

    const matchesSearch =
      chat.partner?.name?.toLowerCase().includes(search.toLowerCase()) ||
      chat.partner?.email?.toLowerCase().includes(search.toLowerCase()) ||
      chat.partner?.expertise?.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  // Apply sorting priority: Unread -> recent message -> recent booking
  filteredChats.sort((a, b) => {
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (b.unreadCount > 0 && a.unreadCount === 0) return 1;
    const dateA = a.latestAt ? new Date(a.latestAt).getTime() : 0;
    const dateB = b.latestAt ? new Date(b.latestAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="w-full h-full flex flex-col bg-card border-r border-border/45 select-none relative z-10">
      {/* Search Header */}
      <div className="p-4 flex flex-col gap-3 shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tutor or student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm outline-none focus:border-primary placeholder-muted-foreground/60 transition-colors"
          />
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex px-4 border-b border-border/30 gap-4 shrink-0">
        <button
          onClick={() => {
            setFilterTab("active");
            setOpenMenuId(null);
          }}
          className={cn(
            "pb-2.5 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors cursor-pointer",
            filterTab === "active"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Active
        </button>
        <button
          onClick={() => {
            setFilterTab("archived");
            setOpenMenuId(null);
          }}
          className={cn(
            "pb-2.5 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors cursor-pointer",
            filterTab === "archived"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Archived
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-hide">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground/60 px-4">
            <span className="text-sm">No chats found</span>
            <span className="text-[11px] mt-1">Select a tutor from search to start talking</span>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isActive = chat._id === activeChatId;
            const isOnline = onlineUsersList.has(chat.partner?._id?.toString());
            const hasUnread = chat.unreadCount > 0;

            return (
              <div
                key={chat._id}
                onClick={() => {
                  onSelectChat(chat);
                  setOpenMenuId(null);
                }}
                className={cn(
                  "relative flex items-center gap-3 p-3 rounded-[var(--radius-md)] cursor-pointer group transition-all duration-200 border border-transparent",
                  isActive
                    ? "bg-primary/10 border-primary/20 text-foreground"
                    : "hover:bg-secondary/40 text-foreground/80 hover:text-foreground"
                )}
              >
                {/* Avatar with Online indicator */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--bg-nav-hover)] border border-[var(--border-subtle)] overflow-hidden flex items-center justify-center font-bold text-primary shadow-[var(--shadow-sm)]">
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
                    <OnlineBadge className="absolute -bottom-0.5 -right-0.5 border-2 border-[var(--bg-nav-container)] rounded-full w-3 h-3" />
                  )}
                </div>

                {/* Details Section */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-semibold truncate text-foreground leading-tight">
                      {chat.partner?.name || (chat.partner?.role === "student" ? "Unknown Student" : "Unknown Tutor")}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0 select-none">
                      {formatTime(chat.lastMessageTime || chat.updatedAt)}
                    </span>
                  </div>

                  <span className="text-[11px] text-primary/80 font-medium truncate select-none leading-none">
                    {chat.partner?.role === "tutor" ? "Tutor" : "Student"} • {chat.booking?.subject || chat.partner?.expertise || "No Subjects"}
                  </span>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p
                      className={cn(
                        "text-[12px] truncate leading-tight flex-1",
                        hasUnread ? "text-foreground font-semibold" : "text-muted-foreground"
                      )}
                    >
                      {(() => {
                        if (chat.lastMessage?.deleted) return "This message was deleted";
                        if (chat.lastMessage?.type === "call" && chat.lastMessage?.metadata) {
                          const m = chat.lastMessage.metadata;
                          const icon = m.status === "missed" ? "🔴" : (m.callType === "video" ? "📹" : "📞");
                          let textStr = chat.lastMessage.text || chat.lastMessage.message || "Call";
                          if (m.duration > 0) {
                            const mins = Math.floor(m.duration / 60);
                            const durationStr = mins > 0 ? `${mins}m` : `${m.duration}s`;
                            return `${icon} ${textStr} • ${durationStr}`;
                          }
                          return `${icon} ${textStr}`;
                        }
                        return chat.lastMessage?.text || chat.lastMessage?.message || (chat.lastMessage?.attachments?.length > 0 ? "sent attachment" : "") || "No messages yet";
                      })()}
                    </p>

                    {/* Unread Counter Badge */}
                    {hasUnread && (
                      <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px] font-bold text-white bg-primary rounded-full animate-pulse shrink-0">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action dropdown button (visible on hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 ml-1">
                  <button
                    onClick={(e) => handleToggleMenu(e, chat._id)}
                    className="p-1 hover:bg-[var(--bg-nav-hover)] rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground"
                    title="Chat actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Context menu popup */}
                  {openMenuId === chat._id && (
                    <div className="absolute right-3 top-12 bg-[var(--bg-nav-container)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] z-50 py-1.5 min-w-[150px] animate-in fade-in zoom-in-95 duration-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleArchive(chat._id, !chat.isArchived);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary/40 text-left transition-colors cursor-pointer"
                      >
                        {chat.isArchived ? (
                          <>
                            <ArchiveRestore className="w-3.5 h-3.5" /> Unarchive Chat
                          </>
                        ) : (
                          <>
                            <Archive className="w-3.5 h-3.5" /> Archive Chat
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBlock(chat._id, !chat.isBlocked);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-950/20 text-left transition-colors cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5" /> {chat.isBlocked ? "Unblock User" : "Block User"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReportChat(chat._id);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-yellow-400 hover:bg-yellow-950/20 text-left transition-colors cursor-pointer"
                      >
                        <CircleAlert className="w-3.5 h-3.5" /> Report User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
