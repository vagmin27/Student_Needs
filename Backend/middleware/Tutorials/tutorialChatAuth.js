import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import TutorialConversation from "../../models/Tutorials/TutorialConversation.js";
import Booking from "../../models/Tutorials/Booking.js";

export const verifyTutorialConversationAccess = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let userId;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id || decoded._id;
      } catch (err) {
        return res.status(401).json({ msg: "Token is not valid" });
      }
    } else if (req.session?.user?.id) {
      userId = req.session.user.id;
    } else if (req.user?.id || req.user?._id) {
      userId = req.user.id || req.user._id;
    } else {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    req.userId = userId.toString();

    // If there is a conversationId in params, verify membership
    const { conversationId } = req.params;
    if (conversationId) {
      if (!mongoose.isValidObjectId(conversationId)) {
        return res.status(400).json({ msg: "Invalid conversation ID" });
      }

      const conversation = await TutorialConversation.findById(conversationId)
        .populate("latestBookingId")
        .populate("activeBookings");
      if (!conversation) {
        return res.status(404).json({ msg: "Conversation not found" });
      }

      // Check if user is a participant
      const isParticipant = conversation.participants.some((p) => p.userId.toString() === req.userId);
      if (!isParticipant) {
        return res.status(403).json({ msg: "Unauthorized chat access" });
      }

      req.conversation = conversation;
      req.booking = conversation.latestBookingId;
    }

    next();
  } catch (err) {
    console.error("verifyTutorialConversationAccess error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
