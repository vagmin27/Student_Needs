import mongoose from "mongoose";
import TutorialConversation from "../../models/Tutorials/TutorialConversation.js";
import TutorialMessage from "../../models/Tutorials/TutorialMessage.js";
import Booking from "../../models/Tutorials/Booking.js";
import ReferralStudent from "../../models/Referrals/StudentModel.js";
import Tutor from "../../models/Tutorials/Tutor.js";
import User from "../../models/Tutorials/user.js";
import { resolveBookingStudentId } from "../../utils/Tutorials/resolveBookingStudentId.js";

export const initConversation = async (req, res) => {
  try {
    const userId = resolveBookingStudentId(req);
    if (!userId) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const { tutorId } = req.body;
    if (!tutorId) {
      return res.status(400).json({ success: false, msg: "Tutor ID is required" });
    }

    // Check if a booking exists with this tutor
    const booking = await Booking.findOne({
      tutorId,
      userId,
      status: { $nin: ["declined", "Cancelled", "cancelled"] }
    });

    if (!booking) {
      return res.status(403).json({ success: false, msg: "You can only chat with tutors you have booked." });
    }

    // Check if conversation already exists
    let conversation = await TutorialConversation.findOne({
      "participants.userId": { $all: [userId, tutorId] }
    });

    if (!conversation) {
      // Create new conversation
      conversation = await TutorialConversation.create({
        participants: [
          { userId: userId, role: "student" },
          { userId: tutorId, role: "tutor" }
        ],
        studentId: userId,
        studentModel: "User", // Defaults to User, can be enhanced
        tutorId,
        activeBookings: [booking._id],
        latestBookingId: booking._id,
        latestSubject: booking.subject || "",
      });

      const message = await TutorialMessage.create({
        conversationId: conversation._id,
        senderId: userId,
        receiverId: tutorId,
        type: "system",
        text: `Class request submitted • Subject: ${booking.subject || ""}`,
      });

      conversation.latestMessage = message._id;
      conversation.latestAt = message.createdAt;
      conversation.unreadCount.tutor += 1;
      await conversation.save();
    } else {
      // Ensure the active booking is in the list
      if (!conversation.activeBookings.includes(booking._id)) {
        conversation.activeBookings.push(booking._id);
        conversation.latestBookingId = booking._id;
        conversation.latestSubject = booking.subject || conversation.latestSubject;
        await conversation.save();
      }
    }

    res.status(200).json({ success: true, data: conversation });
  } catch (err) {
    console.error("initConversation error:", err);
    res.status(500).json({ success: false, msg: "Error initializing conversation" });
  }
};

// Utility to get user details
const getUserDetails = async (userId, role, studentModel) => {
  if (role === "tutor") {
    const tutor = await Tutor.findById(userId).select("name fName lName profilePic email subjects");
    if (tutor) {
      return {
        _id: tutor._id,
        name: tutor.name || `${tutor.fName || ""} ${tutor.lName || ""}`.trim() || "Tutor",
        avatar: tutor.profilePic,
        subject: tutor.subjects?.join(", ") || "",
        email: tutor.email,
      };
    }
  } else {
    // Check User first
    let u = await User.findById(userId).select("user profile pic name email firstName lastName fName lName");
    if (u) {
      const fallbackName = u.name || u.user || "Student";
      return {
        _id: u._id,
        name: u.profile?.displayName || u.firstName || u.fName || fallbackName,
        avatar: u.pic || u.profile?.pic,
        email: u.email || u.user || "",
      };
    }
    
    // Fallback to ReferralStudent if not found in User (since studentModel is often hardcoded to "User")
    const s = await ReferralStudent.findById(userId).select("firstName lastName image email");
    if (s) {
      return {
        _id: s._id,
        name: `${s.firstName || ""} ${s.lastName || ""}`.trim() || "Student",
        avatar: s.image,
        email: s.email,
      };
    }
  }
  return { _id: userId, name: "Unknown Student", avatar: "" };
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.userId;
    const { search } = req.query;

    const conversations = await TutorialConversation.find({
      "participants.userId": userId,
    })
      .populate("latestBookingId")
      .populate("activeBookings")
      .populate("latestMessage")
      .sort({ latestAt: -1 })
      .lean();

    const formatted = await Promise.all(
      conversations.map(async (conv) => {
        const me = conv.participants.find((p) => p.userId.toString() === userId);
        const partner = conv.participants.find((p) => p.userId.toString() !== userId);
        
        const partnerRole = partner ? partner.role : "student";
        const partnerDetails = await getUserDetails(partner.userId, partnerRole, conv.studentModel);

        const latestBooking = conv.latestBookingId;
        const bookingStatus = latestBooking?.status || "pending";
        
        // Chat is only read only if there are NO active bookings that are NOT cancelled/declined
        const hasActive = conv.activeBookings && conv.activeBookings.some(b => 
          !["declined", "Cancelled", "cancelled"].includes(b.status?.toLowerCase())
        );
        const isReadOnly = conv.activeBookings?.length > 0 && !hasActive;
        
        let statusMessage = "";
        if (isReadOnly) statusMessage = "All bookings with this user are currently cancelled or declined.";

        const unreadCount = me.role === "student" ? conv.unreadCount.student : conv.unreadCount.tutor;
        
        // Extract unique subjects
        const subjectsList = Array.from(new Set(
          (conv.activeBookings || []).map(b => b.subject).filter(Boolean)
        ));
        const subjectsStr = subjectsList.length > 0 ? subjectsList.join(" • ") : conv.latestSubject || "";

        return {
          _id: conv._id,
          booking: {
            _id: latestBooking?._id,
            subject: subjectsStr || latestBooking?.subject,
            status: bookingStatus,
            meetingLink: latestBooking?.meetingLink || "",
            isReadOnly,
            statusMessage,
          },
          partner: {
            ...partnerDetails,
            role: partnerRole,
          },
          latestMessage: conv.latestMessage,
          latestAt: conv.latestAt,
          unreadCount: unreadCount || 0,
        };
      })
    );

    // Apply search filter (debounce handled by frontend)
    let filtered = formatted;
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      filtered = formatted.filter((c) => c.partner.name.toLowerCase().includes(q));
    }

    // Sort: Unread first -> then latestAt
    filtered.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (b.unreadCount > 0 && a.unreadCount === 0) return 1;
      const dateA = a.latestAt ? new Date(a.latestAt).getTime() : 0;
      const dateB = b.latestAt ? new Date(b.latestAt).getTime() : 0;
      return dateB - dateA;
    });

    res.status(200).json({ success: true, data: filtered });
  } catch (err) {
    console.error("getConversations error:", err);
    res.status(500).json({ success: false, msg: "Error fetching conversations" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;
    const conversation = req.conversation;
    const booking = req.booking;

    const messages = await TutorialMessage.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    // Mark as seen
    const me = conversation.participants.find((p) => p.userId.toString() === userId);
    const hasUnread = me.role === "student" ? conversation.unreadCount.student > 0 : conversation.unreadCount.tutor > 0;

    if (hasUnread) {
      if (me.role === "student") {
        conversation.unreadCount.student = 0;
      } else {
        conversation.unreadCount.tutor = 0;
      }
      await conversation.save();

      const partner = conversation.participants.find((p) => p.userId.toString() !== userId);
      await TutorialMessage.updateMany(
        { conversationId, senderId: partner.userId, seen: false },
        { $set: { seen: true, delivered: true } }
      );

      // Emit seen event
      import("../../../sockets/index.js").then(({ getIO }) => {
        try {
          getIO().to(partner.userId.toString()).emit("chat:seen", { conversationId, readerId: userId });
        } catch (e) {}
      }).catch(() => {});
    }

    const bookingStatus = booking?.status || "pending";
    const isReadOnly = ["declined", "Cancelled", "cancelled"].includes(bookingStatus.toLowerCase());
    
    let statusMessage = "";
    if (bookingStatus.toLowerCase() === "declined") statusMessage = "This booking was declined.";
    if (bookingStatus.toLowerCase() === "cancelled") statusMessage = "This booking was cancelled.";

    res.status(200).json({
      success: true,
      data: {
        messages,
        isReadOnly,
        statusMessage,
        meetingLink: booking?.meetingLink || "",
      },
    });
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ success: false, msg: "Error fetching messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text, type = "text" } = req.body;
    const userId = req.userId;
    const conversation = req.conversation;
    const booking = req.booking;

    const bookingStatus = booking?.status || "pending";
    const isReadOnly = ["declined", "Cancelled", "cancelled"].includes(bookingStatus.toLowerCase());

    if (isReadOnly) {
      return res.status(403).json({ success: false, msg: "This chat is read-only. The booking was " + bookingStatus });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ success: false, msg: "Message cannot be empty" });
    }

    const partner = conversation.participants.find((p) => p.userId.toString() !== userId);

    const message = await TutorialMessage.create({
      conversationId,
      senderId: userId,
      receiverId: partner.userId,
      text,
      type,
    });

    conversation.latestMessage = message._id;
    conversation.latestAt = message.createdAt;
    
    if (partner.role === "student") {
      conversation.unreadCount.student += 1;
    } else {
      conversation.unreadCount.tutor += 1;
    }

    await conversation.save();

    // Emit socket
    import("../../../sockets/index.js").then(({ getIO }) => {
      try {
        const io = getIO();
        io.to(partner.userId.toString()).emit("chat:new_message", message);
        io.to(userId).emit("chat:new_message", message);
      } catch (e) {}
    }).catch(() => {});

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ success: false, msg: "Error sending message" });
  }
};
