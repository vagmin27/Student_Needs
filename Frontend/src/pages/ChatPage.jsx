import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { useSocket } from "@/hooks/useSocket.js";
import { tutorsApiClient } from "@/services/apiClient.js";
import ChatSidebar from "@/components/chat/ChatSidebar.jsx";
import ChatWindow from "@/components/chat/ChatWindow.jsx";
import { X, Download } from "lucide-react";
import { cn } from "@/lib/utils.js";
import toast from "react-hot-toast";

export default function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatIdParam = conversationId || searchParams.get("chatId");

  const {
    isConnected,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendTypingStatus,
    markConversationSeen,
    on,
    off,
    emit,
    socket,
    waitForSocket,
  } = useSocket();

  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagePage, setMessagePage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);

  // Typing state for partner
  const [partnerTyping, setPartnerTyping] = useState(false);

  // Lightbox preview for attachments
  const [lightbox, setLightbox] = useState(null);

  const activeChatRef = useRef(null);
  activeChatRef.current = activeChat;

  const currentRole = (user?.role || user?.accountType || "student").toLowerCase();

  // 1. Load active conversations
  const loadChats = async (selectFirst = false) => {
    try {
      setLoadingChats(true);
      const { data } = await tutorsApiClient.get("/tutorial-chat/conversations");
      if (data?.success) {
        setChats(data.data);

        // A. Select target chat if query param chatId or path param conversationId exists
        if (activeChatIdParam) {
          const target = data.data.find(c => c._id === activeChatIdParam);
          if (target) {
            handleSelectChat(target);
            return;
          }
        }

        // B. Select target partner if query param tutorId or studentId exists
        const targetUserId = searchParams.get("tutorId") || searchParams.get("studentId");
        if (targetUserId) {
          const target = data.data.find(c => c.partner?._id === targetUserId);
          if (target) {
            handleSelectChat(target);
            return;
          } else if (currentRole === "student") {
            // Try to initialize the conversation if the user has a valid booking
            try {
              const initRes = await tutorsApiClient.post("/tutorial-chat/init", { tutorId: targetUserId });
              if (initRes.data?.success) {
                // Reload chats to get the full formatted conversation object and select it
                const refreshRes = await tutorsApiClient.get("/tutorial-chat/conversations");
                if (refreshRes.data?.success) {
                  setChats(refreshRes.data.data);
                  const newTarget = refreshRes.data.data.find(c => c.partner?._id === targetUserId);
                  if (newTarget) {
                    handleSelectChat(newTarget);
                    return;
                  }
                }
              }
            } catch (err) {
              // DO NOT auto create conversation without booking
              toast.error(err.response?.data?.msg || "You can only chat with tutors you have booked.");
            }
          }
        }

        // Select first if on desktop and no preselected chat
        if (selectFirst && data.data.length > 0 && window.innerWidth >= 768) {
          handleSelectChat(data.data[0]);
        }
      }
    } catch (err) {
      console.error("Load chats failed:", err);
      toast.error("Failed to load conversation history.");
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
    if (!token && !user) {
      navigate("/login");
      return;
    }
    loadChats(true);
  }, []);

  // Sync active conversation when search parameters or route params update
  useEffect(() => {
    if (chats.length > 0) {
      if (activeChatIdParam) {
        const target = chats.find(c => c._id === activeChatIdParam);
        if (target && activeChat?._id !== target._id) {
          handleSelectChat(target);
        }
      } else {
        const targetUserId = searchParams.get("tutorId") || searchParams.get("studentId");
        if (targetUserId) {
          const target = chats.find(c => c.partner?._id === targetUserId);
          if (target && activeChat?._id !== target._id) {
            handleSelectChat(target);
          }
        }
      }
    }
  }, [searchParams, chats, activeChatIdParam]);

  // 2. Load messages for active chat
  const loadMessages = async (chatId, page = 1) => {
    if (page === 1) setLoadingMessages(true);
    try {
      const { data } = await tutorsApiClient.get(`/tutorial-chat/${chatId}/messages?page=${page}&limit=20`);
      if (data?.success) {
        if (page === 1) {
          setMessages(data.data.messages);
          if (data.data.isReadOnly) {
            setActiveChat(prev => ({ ...prev, booking: { ...prev.booking, isReadOnly: true, statusMessage: data.data.statusMessage }}));
          }
        } else {
          // Append older messages to top of stack
          setMessages(prev => [...data.data, ...prev]);
        }
        setHasMoreMessages(data.pagination?.hasMore ?? false);
        setMessagePage(page);
      }
    } catch (err) {
      console.error("Load messages failed:", err);
    } finally {
      if (page === 1) setLoadingMessages(false);
    }
  };

  const handleSelectChat = async (chat) => {
    if (activeChatRef.current) {
      leaveConversation(activeChatRef.current._id);
    }

    setActiveChat(chat);
    setMessages([]);
    setPartnerTyping(false);
    navigate(`/tutorials/chat/${chat._id}`);

    // Join room
    await waitForSocket();
    joinConversation(chat._id);

    // Load history
    loadMessages(chat._id, 1);

    // Reset unreads
    if (chat.unreadCount > 0) {
      setChats(prev => prev.map(c => (c._id === chat._id ? { ...c, unreadCount: 0 } : c)));
    }
  };

  const handleLoadMoreMessages = () => {
    if (activeChat) {
      loadMessages(activeChat._id, messagePage + 1);
    }
  };

  // 3. Socket real-time events handling
  useEffect(() => {
    if (!isConnected) return;

    // A. Receive new message
    const onReceiveMessage = (msg) => {
      const currentActive = activeChatRef.current;
      if (currentActive && msg.conversationId === currentActive._id) {
        // Add to viewport
        setMessages(prev => {
          // Avoid duplicate appends
          if (prev.some(m => m._id === msg._id)) {
            return prev.map(m => (m._id === msg._id ? msg : m));
          }
          return [...prev, msg];
        });
        // Clear unread receipt immediately
        markConversationSeen(currentActive._id);
      } else {
        // Increment unread count in sidebar list
        setChats(prev => prev.map(c => 
          c._id === msg.conversationId ? { ...c, unreadCount: c.unreadCount + 1 } : c
        ));
      }

      // Update sidebar latest message snippet
      setChats(prev => {
        const index = prev.findIndex(c => c._id === msg.conversationId);
        if (index === -1) {
          loadChats();
          return prev;
        }
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          lastMessage: msg,
          lastMessageTime: msg.createdAt,
          updatedAt: msg.createdAt,
        };
        // Sort newest first
        return updated.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      });
    };

    // B. Typing indicators
    const onTyping = (data) => {
      const currentActive = activeChatRef.current;
      if (currentActive && data.conversationId === currentActive._id && data.userId !== user.id) {
        setPartnerTyping(data.isTyping);
      }
    };

    // C. Read receipts
    const onMessageSeen = (data) => {
      const currentActive = activeChatRef.current;
      if (currentActive && data.conversationId === currentActive._id) {
        setMessages(prev => prev.map(m => (m.senderId === user.id ? { ...m, seen: true, delivered: true } : m)));
      }
    };

    on("receiveMessage", onReceiveMessage);
    on("typing", onTyping);
    on("messageSeen", onMessageSeen);

    return () => {
      off("receiveMessage", onReceiveMessage);
      off("typing", onTyping);
      off("messageSeen", onMessageSeen);
    };
  }, [isConnected, user?.id, on, off, markConversationSeen]);

  // 4. Send Message HTTP Call
  const handleSendMessage = async (chatId, text) => {
    try {
      // POST call to API
      const { data } = await tutorsApiClient.post(`/tutorial-chat/${chatId}/messages`, { text });
      if (data?.success) {
        const savedMsg = data.data;
        setMessages(prev => {
          if (prev.some(m => m._id === savedMsg._id)) return prev;
          return [...prev, savedMsg];
        });
      }
    } catch (err) {
      toast.error("Message delivery failed.");
    }
  };

  // 5. Upload Attachment HTTP Call
  const handleUploadAttachment = async (chatId, file, text) => {
    toast.error("File upload is not yet supported in tutorial chat.");
    // Implementation for attachment
  };


  // 6. Edit Message
  const handleEditMessage = async (messageId, text) => {
    try {
      const { data } = await tutorsApiClient.put(`/chat/message/edit/${messageId}`, { text });
      if (data?.success) {
        setMessages(prev => prev.map(m => (m._id === messageId ? data.data : m)));
      }
    } catch (_) {
      toast.error("Editing failed.");
    }
  };

  // 7. Delete Message
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const { data } = await tutorsApiClient.delete(`/chat/message/${messageId}`);
      if (data?.success) {
        setMessages(prev => prev.map(m => (m._id === messageId ? data.data : m)));
        toast.success("Message deleted.");
      }
    } catch (_) {
      toast.error("Deletion failed.");
    }
  };

  // 8. Toggle Archive
  const handleToggleArchive = async (chatId, archive) => {
    try {
      const { data } = await tutorsApiClient.put(`/chat/conversation/${chatId}/archive`, { archive });
      if (data?.success) {
        setChats(prev => prev.map(c => (c._id === chatId ? { ...c, isArchived: archive } : c)));
        toast.success(archive ? "Conversation archived." : "Conversation unarchived.");
        if (activeChat?._id === chatId) {
          setActiveChat(null);
          navigate("/tutorials/chat");
        }
      }
    } catch (_) {
      toast.error("Action failed.");
    }
  };

  // 9. Toggle Block
  const handleToggleBlock = async (chatId, block) => {
    const text = block ? "block" : "unblock";
    if (!window.confirm(`Are you sure you want to ${text} this user?`)) return;
    try {
      const { data } = await tutorsApiClient.put(`/chat/conversation/${chatId}/block`, { block });
      if (data?.success) {
        setChats(prev => prev.map(c => (c._id === chatId ? { ...c, isBlocked: block, blockedBy: data.data.blockedBy } : c)));
        if (activeChat?._id === chatId) {
          setActiveChat(prev => ({ ...prev, isBlocked: block, blockedBy: data.data.blockedBy }));
        }
        toast.success(`User successfully ${text}ed.`);
      }
    } catch (_) {
      toast.error("Action failed.");
    }
  };

  // 10. Report Chat
  const handleReportChat = async (chatId) => {
    const reason = window.prompt("State your reason for reporting this user / conversation:");
    if (!reason || reason.trim() === "") return;
    try {
      const { data } = await tutorsApiClient.post("/chat/report", { conversationId: chatId, reason });
      if (data?.success) {
        toast.success("Report submitted successfully. Admins will review this chat.");
      }
    } catch (_) {
      toast.error("Failed to submit report.");
    }
  };

  // Typing emit coordinator
  const handleTypingStateChange = (chatId, typing) => {
    sendTypingStatus(chatId, typing);
  };

  return (
    <div
      className={cn(
        "flex bg-card border border-border/45 rounded-[var(--radius-lg)] overflow-hidden glass-panel relative",
        currentRole === "student"
          ? "h-[calc(100vh-200px)] md:h-[calc(100vh-220px)] mt-20 md:mt-0"
          : "h-[calc(100vh-130px)] md:h-[calc(100vh-160px)]"
      )}
    >
      {/* Sidebar - Collapsed on Mobile when chat is active */}
      <div
        className={cn(
          "w-full md:w-[320px] lg:w-[360px] h-full flex flex-col flex-shrink-0 transition-all",
          activeChat ? "hidden md:flex" : "flex"
        )}
      >
        {loadingChats ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="spinner spinner-lg" />
          </div>
        ) : (
          <ChatSidebar
            chats={chats}
            activeChatId={activeChat?._id}
            onSelectChat={handleSelectChat}
            onlineUsersList={onlineUsers}
            onToggleArchive={handleToggleArchive}
            onToggleBlock={handleToggleBlock}
            onReportChat={handleReportChat}
          />
        )}
      </div>

      {/* Main Chat window - Collapsed on Mobile when no chat is active */}
      <div
        className={cn(
          "flex-1 h-full flex flex-col transition-all",
          activeChat ? "flex" : "hidden md:flex"
        )}
      >
        <ChatWindow
          chat={activeChat}
          socket={socket}
          waitForSocket={waitForSocket}
          messages={messages}
          loadingMessages={loadingMessages}
          onSendMessage={handleSendMessage}
          onUploadAttachment={handleUploadAttachment}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
          onMarkRead={(chatId) => markConversationSeen(chatId)}
          isTyping={partnerTyping}
          onlineUsersList={onlineUsers}
          onBack={() => {
            if (activeChat) leaveConversation(activeChat._id);
            setActiveChat(null);
            navigate("/tutorials/chat");
          }}
          onTypingStateChange={handleTypingStateChange}
          onOpenAttachment={(url, name) => setLightbox({ url, name })}
          onToggleBlock={handleToggleBlock}
          onReportChat={handleReportChat}
          onLoadMore={handleLoadMoreMessages}
          hasMore={hasMoreMessages}
          currentUserId={user?.id || user?._id}
          socket={socket}
        />
      </div>

      {/* Image Lightbox Preview Overlay */}
      {lightbox && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6">
          <div className="absolute top-4 right-4 flex gap-3 text-white">
            <a
              href={lightbox.url}
              download={lightbox.name}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-[var(--border-color)] hover:bg-[var(--bg-tertiary)] rounded-full transition-all cursor-pointer"
              title="Download image"
            >
              <Download className="w-5 h-5" />
            </a>
            <button
              onClick={() => setLightbox(null)}
              className="p-2.5 bg-[var(--border-color)] hover:bg-[var(--bg-tertiary)] rounded-full transition-all cursor-pointer"
              title="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <img
            src={lightbox.url}
            alt={lightbox.name}
            className="max-w-full max-h-[85vh] object-contain rounded-[var(--radius-sm)] shadow-[var(--shadow-lg)] border border-[var(--border-color)]"
          />
          <p className="text-white/60 text-xs mt-3 select-none">{lightbox.name}</p>
        </div>
      )}
    </div>
  );
}
