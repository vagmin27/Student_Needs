import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { useWebSocket } from "@/hooks/useWebSocket.js";
import { chatApi } from "@/services/Referrals/chat.js";
import { ChatList } from "@/components/Referrals/Chat/ChatList.jsx";
import { ChatWindow } from "@/components/Referrals/Chat/ChatWindow.jsx";
import { ChatSkeleton } from "@/components/Referrals/Chat/ChatSkeleton.jsx";
import { showToast } from "@/components/Referrals/TransactionToast.jsx";
import { X, ExternalLink, Download } from "lucide-react";
import { cn } from "@/lib/Referrals/utils.js";
import { LayoutContext } from "@/components/layouts/DashboardLayout.jsx";
import BackToStudentDashboard from "@/components/dashboard/BackToStudentDashboard";
import { TabNavigation } from "@/components/Referrals/Student/TabNavigation.jsx";
import { StatusBadge } from "@/components/Referrals/StatusBadge.jsx";
import { storage } from "@/lib/Referrals/storage.js";
import { opportunitiesApi } from "@/services/Referrals/opportunities.js";
import { PageLayout } from "@/components/dashboard/shared/Primitives";

export default function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatIdParam = searchParams.get("chatId");
  const { isConnected, on, off, emit } = useWebSocket();

  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagePage, setMessagePage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);

  // In-memory set of online user IDs
  const [onlineUsersList, setOnlineUsersList] = useState(new Set());
  
  // Typing indicators: Map conversation IDs to true/false
  const [typingStates, setTypingStates] = useState({});

  // Image lightbox preview state
  const [lightbox, setLightbox] = useState(null);

  const activeChatRef = useRef(null);
  activeChatRef.current = activeChat;

  const currentRole = (user?.role || user?.accountType || "student").toLowerCase();

  const isUnifiedLayout = useContext(LayoutContext);
  const [student, setStudent] = useState(null);
  const [appliedCount, setAppliedCount] = useState(0);

  useEffect(() => {
    if (currentRole === "student") {
      const userId = localStorage.getItem('user_id') || 'guest';
      setStudent(storage.getStudent(userId));

      opportunitiesApi.getMyApplications().then(response => {
        if (response.success && response.data) {
          setAppliedCount(response.data.applications?.length || 0);
        }
      }).catch(console.error);
    }
  }, [currentRole]);

  // 1. Initial Load of Chats
  const loadChats = async (selectFirst = false) => {
    try {
      setLoadingChats(true);
      const response = await chatApi.getChats();
      if (response.success) {
        setChats(response.data);
        
        // If a chatId query parameter is passed, select it
        const targetChatId = searchParams.get("chatId");
        if (targetChatId) {
          const targetChat = response.data.find(c => c._id.toString() === targetChatId.toString());
          if (targetChat) {
            handleSelectChat(targetChat);
            return;
          }
        }

        // Check for preselected userId or alumniId
        const targetUserId = searchParams.get("userId") || searchParams.get("alumniId");
        if (targetUserId) {
          const targetChat = response.data.find(c => {
            const partnerId = currentRole === "alumni" ? c.student?._id : c.alumni?._id;
            return partnerId?.toString() === targetUserId.toString();
          });
          if (targetChat) {
            handleSelectChat(targetChat);
            return;
          } else if (currentRole === "student") {
            // CASE 2: No conversation exists. Automatically create it!
            try {
              const createRes = await chatApi.createChat(targetUserId);
              if (createRes.success) {
                // Reload chats list
                const reloadRes = await chatApi.getChats();
                if (reloadRes.success) {
                  setChats(reloadRes.data);
                  const newChat = reloadRes.data.find(c => c._id.toString() === createRes.data._id.toString());
                  if (newChat) {
                    handleSelectChat(newChat);
                    return;
                  }
                }
              }
            } catch (createErr) {
              console.error("Auto-create conversation failed:", createErr);
            }
          }
        }

        // Optionally select first conversation if on desktop
        if (selectFirst && response.data.length > 0 && window.innerWidth >= 768) {
          handleSelectChat(response.data[0]);
        }
      }
    } catch (err) {
      console.error("Load chats error:", err);
      showToast({
        type: "error",
        message: "Failed to load active chats",
      });
    } finally {
      setLoadingChats(false);
    }
  };

  // Run on startup
  useEffect(() => {
    const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
    if (!token) {
      navigate(`/auth/${currentRole}/login`);
      return;
    }
    loadChats(true);
  }, []);

  // Sync active chat if query param changes
  useEffect(() => {
    const targetChatId = searchParams.get("chatId");
    const targetUserId = searchParams.get("userId") || searchParams.get("alumniId");

    if (chats.length > 0) {
      if (targetChatId) {
        const targetChat = chats.find(c => c._id.toString() === targetChatId.toString());
        if (targetChat && activeChat?._id !== targetChat._id) {
          handleSelectChat(targetChat);
        }
      } else if (targetUserId) {
        const targetChat = chats.find(c => {
          const partnerId = currentRole === "alumni" ? c.student?._id : c.alumni?._id;
          return partnerId?.toString() === targetUserId.toString();
        });
        if (targetChat && activeChat?._id !== targetChat._id) {
          handleSelectChat(targetChat);
        } else if (!targetChat && currentRole === "student") {
          loadChats();
        }
      }
    }
  }, [searchParams, chats]);

  // 2. Fetch Messages for Selected Chat
  const loadMessages = async (chatId, page = 1) => {
    if (page === 1) setLoadingMessages(true);
    try {
      const response = await chatApi.getMessages(chatId, { page, limit: 30 });
      if (response.success) {
        if (page === 1) {
          setMessages(response.data);
        } else {
          setMessages((prev) => [...prev, ...response.data]);
        }
        setHasMoreMessages(response.pagination.hasMore);
        setMessagePage(page);
      }
    } catch (err) {
      console.error("Load messages error:", err);
    } finally {
      if (page === 1) setLoadingMessages(false);
    }
  };

  // Handle selecting a chat from list
  const handleSelectChat = (selectedChat) => {
    setActiveChat(selectedChat);
    setMessages([]);
    loadMessages(selectedChat._id, 1);
    
    // Clear typing states
    setTypingStates(prev => ({ ...prev, [selectedChat._id]: false }));

    // Reset unread count locally and in DB
    if (selectedChat.unreadCount > 0) {
      setChats(prev => prev.map(c => 
        c._id === selectedChat._id ? { ...c, unreadCount: 0 } : c
      ));
      chatApi.markRead(selectedChat._id).catch(console.error);
    }
  };

  // 3. Socket Event Binds
  useEffect(() => {
    if (!isConnected) return;

    // A. Receive Message
    const onMessageReceived = (msg) => {
      const currentActive = activeChatRef.current;
      
      // Update Message list if it belongs to current active chat
      if (currentActive && msg.chat.toString() === currentActive._id.toString()) {
        setMessages((prev) => [msg, ...prev]);
        
        // Reset unreads in DB
        chatApi.markRead(currentActive._id).catch(console.error);
      } else {
        // Increment unread count in sidebar for other conversations
        setChats((prev) => prev.map(c => 
          c._id.toString() === msg.chat.toString() 
            ? { ...c, unreadCount: c.unreadCount + 1, lastMessage: msg }
            : c
        ));
      }

      // Update sidebar latest message & sorting
      setChats((prev) => {
        const index = prev.findIndex(c => c._id.toString() === msg.chat.toString());
        if (index === -1) {
          // If conversation list doesn't have it, reload list
          loadChats();
          return prev;
        }
        const updatedChats = [...prev];
        updatedChats[index] = { ...updatedChats[index], lastMessage: msg, updatedAt: new Date().toISOString() };
        // Sort conversations by latest message activity
        return updatedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    };

    // B. Message Edited/Deleted updates
    const onMessageUpdate = (update) => {
      const currentActive = activeChatRef.current;
      if (currentActive) {
        setMessages((prev) => prev.map(m => 
          m._id.toString() === update.messageId.toString()
            ? { ...m, text: update.text, isEdited: update.isEdited || m.isEdited, isDeleted: update.isDeleted || m.isDeleted, editedAt: update.editedAt, file: update.file === null ? null : m.file }
            : m
        ));
      }
      
      // Update lastMessage snippet in sidebar
      setChats((prev) => prev.map(c => {
        if (c.lastMessage?._id?.toString() === update.messageId.toString()) {
          return {
            ...c,
            lastMessage: {
              ...c.lastMessage,
              text: update.text,
              isDeleted: update.isDeleted || c.lastMessage.isDeleted,
              file: update.file === null ? null : c.lastMessage.file
            }
          };
        }
        return c;
      }));
    };

    // C. Typing Event
    const onTyping = (data) => {
      const { chatId, isTyping } = data;
      setTypingStates(prev => ({ ...prev, [chatId]: isTyping }));
    };

    // D. User status changes
    const onUserStatus = (data) => {
      const { userId, status } = data;
      setOnlineUsersList(prev => {
        const next = new Set(prev);
        if (status === "online") next.add(userId);
        else next.delete(userId);
        return next;
      });

      // Update chat model flags in list
      setChats(prev => prev.map(c => {
        if (c.student?._id === userId) {
          c.student.isOnline = (status === "online");
        }
        if (c.alumni?._id === userId) {
          c.alumni.isOnline = (status === "online");
        }
        return c;
      }));
    };

    // E. Mark read update checks
    const onMessageRead = (data) => {
      const { chatId } = data;
      const currentActive = activeChatRef.current;
      if (currentActive && chatId.toString() === currentActive._id.toString()) {
        setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
      }
    };

    // Bind event listeners
    on("message", onMessageReceived);
    on("message_update", onMessageUpdate);
    on("typing", onTyping);
    on("user_status", onUserStatus);
    on("message_read", onMessageRead);

    // Initial fetch of online users
    emit("get_online_users", (users) => {
      if (Array.isArray(users)) {
        setOnlineUsersList(new Set(users));
      }
    });

    return () => {
      off("message", onMessageReceived);
      off("message_update", onMessageUpdate);
      off("typing", onTyping);
      off("user_status", onUserStatus);
      off("message_read", onMessageRead);
    };
  }, [isConnected, on, off, emit]);

  // 4. Send message handler
  const handleSendMessage = async (chatId, text, replyTo) => {
    try {
      const response = await chatApi.sendMessage(chatId, { text, replyTo });
      if (response.success) {
        // Optimistically insert / socket will update, but manually pushing to keep instantaneous feedback
        // Check if message is already in list to avoid duplicates
        setMessages(prev => {
          if (prev.some(m => m._id === response.data._id)) return prev;
          return [response.data, ...prev];
        });
        
        // Update sidebar last message
        setChats(prev => prev.map(c => 
          c._id === chatId ? { ...c, lastMessage: response.data, updatedAt: new Date().toISOString() } : c
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
      }
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        message: "Failed to send message",
      });
    }
  };

  // 5. Upload Attachment handler
  const handleUploadAttachment = async (chatId, file, replyTo) => {
    try {
      const response = await chatApi.uploadAttachment(chatId, file, replyTo);
      if (response.success) {
        setMessages(prev => {
          if (prev.some(m => m._id === response.data._id)) return prev;
          return [response.data, ...prev];
        });
        setChats(prev => prev.map(c => 
          c._id === chatId ? { ...c, lastMessage: response.data, updatedAt: new Date().toISOString() } : c
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
        showToast({
          type: "success",
          message: "Attachment sent!",
        });
      }
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        message: err.response?.data?.message || "File upload failed",
      });
      throw err;
    }
  };

  // 6. Message actions (Edit, Delete, Typing status, Read receipt)
  const handleEditMessage = async (messageId, text) => {
    try {
      const response = await chatApi.editMessage(messageId, text);
      if (response.success) {
        setMessages(prev => prev.map(m => m._id === messageId ? response.data : m));
      }
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        message: "Failed to edit message",
      });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const response = await chatApi.deleteMessage(messageId);
      if (response.success) {
        setMessages(prev => prev.map(m => 
          m._id === messageId ? { ...m, isDeleted: true, text: "This message was deleted", file: null } : m
        ));
      }
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        message: "Failed to delete message",
      });
    }
  };

  const handleMarkRead = async (chatId) => {
    try {
      await chatApi.markRead(chatId);
      emit("mark_read", { chatId });
    } catch (err) {
      console.error(err);
    }
  };

  const handleTypingStateChange = (chatId, isTyping) => {
    emit("typing", { chatId, isTyping });
  };

  // Update browser tab unread counts
  useEffect(() => {
    const count = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
    if (count > 0) {
      document.title = `(${count}) UniConnect - Referrals Chat`;
    } else {
      document.title = "UniConnect - Referrals Chat";
    }
    
    // Dispatch custom event to notify other components (like TabNavigation)
    window.dispatchEvent(new CustomEvent("chat_unread_count_changed", { detail: { count } }));

    return () => {
      document.title = "UniConnect";
    };
  }, [chats]);

  const totalUnreads = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const isReferralRoute = location.pathname.startsWith("/referrals");  return (
    <PageLayout
      className={cn(
        "pb-8",
        currentRole === "student" && !isReferralRoute ? (isUnifiedLayout ? "mt-0" : "mt-20 sm:mt-24") : ""
      )}
    >
      {currentRole === "student" && isUnifiedLayout && !isReferralRoute && <BackToStudentDashboard />}

      {currentRole === "student" && !isReferralRoute && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col items-start justify-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
              Student Referral Chat
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your resume and apply for referrals
            </p>
          </div>
          {student && <StatusBadge status={student.resumeStatus} />}
        </div>
      )}

      {currentRole === "student" && !isReferralRoute && (
        <TabNavigation
          activeTab="chat"
          student={student}
          appliedCount={appliedCount}
          unreadChatsCount={totalUnreads}
        />
      )}

      <div className={cn(
        "flex bg-card border border-border/45 rounded-[var(--radius-lg)] overflow-hidden glass-panel relative",
        currentRole === "student" && !isReferralRoute
          ? "h-[calc(100vh-270px)] md:h-[calc(100vh-320px)]"
          : "h-[calc(100vh-130px)] md:h-[calc(100vh-160px)]"
      )}>
        {/* Sidebar List (Visible on desktop, hidden on mobile if chat is active) */}
        <div className={cn(
          "w-full md:w-[320px] lg:w-[360px] h-full flex flex-col flex-shrink-0 transition-all",
          activeChat ? "hidden md:flex" : "flex"
        )}>
          {loadingChats ? (
            <ChatSkeleton />
          ) : (
            <ChatList
              chats={chats}
              activeChatId={activeChat?._id}
              onSelectChat={handleSelectChat}
              onlineUsersList={onlineUsersList}
            />
          )}
        </div>

        {/* Main Chat Panel (Visible on desktop, hidden on mobile if no chat is active) */}
        <div className={cn(
          "flex-1 h-full flex flex-col transition-all",
          activeChat ? "flex" : "hidden md:flex"
        )}>
          <ChatWindow
            chat={activeChat}
            messages={messages}
            loadingMessages={loadingMessages}
            onSendMessage={handleSendMessage}
            onUploadAttachment={handleUploadAttachment}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
            onMarkRead={handleMarkRead}
            isTyping={typingStates[activeChat?._id] || false}
            otherUserTyping={typingStates[activeChat?._id] || false}
            onBack={() => setActiveChat(null)}
            onTypingStateChange={handleTypingStateChange}
            onOpenAttachment={(url, name) => setLightbox({ url, name })}
          />
        </div>

        {/* Lightbox attachment preview overlay */}
        {lightbox && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6">
            {/* Lightbox controls */}
            <div className="absolute top-4 right-4 flex gap-3 text-white">
              <a 
                href={lightbox.url} 
                download={lightbox.name}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </a>
              <button 
                onClick={() => setLightbox(null)}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large image display */}
            <img 
              src={lightbox.url} 
              alt={lightbox.name} 
              className="max-w-full max-h-[85vh] object-contain rounded-[var(--radius-sm)] shadow-2xl border border-white/10"
            />
            <p className="text-white/60 text-xs mt-3 select-none">{lightbox.name}</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
