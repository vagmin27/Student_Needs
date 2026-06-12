import React, { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Search, Check, Trash2, Calendar, User, MessageSquare, AlertCircle } from "lucide-react";

export default function ContactMessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRead, setFilterRead] = useState("all"); // "all" | "unread" | "read"
  const [replyNotes, setReplyNotes] = useState({}); // Stores inline mock reply drafts

  useEffect(() => {
    document.title = "Admin - Contact Messages Control Panel";
    loadMessages();
  }, []);

  const authHeaders = {
    headers: {
      Authorization: "Bearer admin-mock-token"
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8000/api/contact", authHeaders);
      if (response.data.success) {
        setMessages(response.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:8000/api/contact/${id}/read`, {}, authHeaders);
      if (response.data.success) {
        setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
      }
    } catch (err) {
      alert("Failed to mark message as read: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const response = await axios.delete(`http://localhost:8000/api/contact/${id}`, authHeaders);
      if (response.data.success) {
        setMessages(messages.filter(m => m._id !== id));
      }
    } catch (err) {
      alert("Failed to delete message: " + err.message);
    }
  };

  const handleMockReply = (id) => {
    const note = replyNotes[id];
    if (!note || !note.trim()) {
      alert("Please enter reply text first.");
      return;
    }
    alert(`Mock reply sent to message verifier: "${note}"`);
    setReplyNotes({ ...replyNotes, [id]: "" });
  };

  // Filtering logs
  const filteredMessages = messages.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterRead === "all" ||
      (filterRead === "read" && item.isRead) ||
      (filterRead === "unread" && !item.isRead);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container px-6 py-12 max-w-5xl mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border/60 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            📥 Messages Admin Panel
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Review, track, and reply to student support inquiries.</p>
        </div>
        <button
          onClick={loadMessages}
          className="px-4 py-2 bg-secondary border border-border rounded-[var(--radius-sm)] text-xs font-semibold text-foreground hover:bg-secondary/80 cursor-pointer"
        >
          Refresh Feeds
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-[var(--radius-md)] text-xs flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Admin Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 select-none">
        {/* Search bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries name, email, text..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-[var(--radius-sm)] text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        {/* Read status filter */}
        <div className="flex gap-2 justify-end">
          {["all", "unread", "read"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterRead(status)}
              className={`px-4 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-all ${filterRead === status ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border/60 hover:text-foreground"}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Messages inquiries table list */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-xs">Fetching message logs...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs bg-card border border-border rounded-[var(--radius-md)]">No contact inquiries found.</div>
        ) : (
          filteredMessages.map((msg) => (
            <div key={msg._id} className={`p-6 bg-card border rounded-[var(--radius-md)] relative ${msg.isRead ? "border-border/60 opacity-85" : "border-primary/45 shadow-[0_0_12px_rgba(99,102,241,0.06)]"}`}>
              {/* Top info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/30 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground shrink-0" />
                  <strong className="text-xs text-foreground font-bold">{msg.name}</strong>
                  <span className="text-[10px] text-muted-foreground">&lt;{msg.email}&gt;</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${msg.isRead ? "bg-slate-800 text-slate-400" : "bg-primary/20 text-primary border border-primary/25 animate-pulse"}`}>
                    {msg.isRead ? "Read" : "New"}
                  </span>
                </div>
              </div>

              {/* Message text */}
              <div className="space-y-2 mb-4">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" /> {msg.subject}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed pl-5 whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>

              {/* Actions row */}
              <div className="border-t border-border/30 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Mock reply area */}
                <div className="flex-1 flex gap-2 w-full sm:max-w-md">
                  <input
                    type="text"
                    value={replyNotes[msg._id] || ""}
                    onChange={(e) => setReplyNotes({ ...replyNotes, [msg._id]: e.target.value })}
                    placeholder="Type a mock reply draft..."
                    className="flex-grow px-3 py-1 bg-secondary/50 border border-border rounded text-[11px] text-foreground focus:outline-none"
                  />
                  <button
                    onClick={() => handleMockReply(msg._id)}
                    className="px-3 py-1 bg-primary text-white text-[11px] font-bold rounded hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    Reply
                  </button>
                </div>

                {/* Operations */}
                <div className="flex gap-2 select-none shrink-0 w-full sm:w-auto justify-end">
                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkRead(msg._id)}
                      className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded hover:bg-emerald-500 hover:text-white flex items-center gap-1 text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded hover:bg-rose-500 hover:text-white flex items-center gap-1 text-[11px] font-semibold transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
