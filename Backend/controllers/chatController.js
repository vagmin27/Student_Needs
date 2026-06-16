import ChatReport from "../models/ChatReport.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import ReferralStudent from "../models/Referrals/StudentModel.js";
import Tutor from "../models/Tutorials/Tutor.js";
import User from "../models/Tutorials/user.js";

/**
 * 📢 Report conversation / user
 */
export const reportConversation = async (req, res) => {
  try {
    const reporterId = req.user.id;
    const { conversationId, reason } = req.body;

    if (!conversationId || !reason) {
      return res.status(400).json({ success: false, message: "conversationId and reason are required" });
    }

    const conversation = await Conversation.findOne({ _id: conversationId, participants: reporterId });
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found or unauthorized" });
    }

    const isStudent = conversation.studentId.toString() === reporterId.toString();
    const reporterModel = isStudent ? conversation.studentModel : conversation.tutorModel;
    
    const reportedUser = isStudent ? conversation.tutorId : conversation.studentId;
    const reportedUserModel = isStudent ? conversation.tutorModel : conversation.studentModel;

    const report = await ChatReport.create({
      reporter: reporterId,
      reporterModel,
      reportedUser,
      reportedUserModel,
      reason,
      conversationId,
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully. Admins will review the conversation.",
      data: report,
    });
  } catch (error) {
    console.error("🔥 Report Conversation Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 📊 Admin: Get Chat Analytics
 */
export const getChatAnalytics = async (req, res) => {
  try {
    const totalConversations = await Conversation.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalReports = await ChatReport.countDocuments();
    const pendingReports = await ChatReport.countDocuments({ status: "pending" });

    // Count active user ids (unique senders in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeUserCountArr = await Message.distinct("senderId", {
      createdAt: { $gte: sevenDaysAgo },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalConversations,
        totalMessages,
        totalReports,
        pendingReports,
        activeUsers7Days: activeUserCountArr.length,
      },
    });
  } catch (error) {
    console.error("🔥 Get Chat Analytics Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 📋 Admin: List Chat Reports
 */
export const getChatReports = async (req, res) => {
  try {
    const reports = await ChatReport.find()
      .populate("conversationId")
      .populate("reporter")
      .populate("reportedUser")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("🔥 Get Chat Reports Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🚫 Admin: Block Abusive Accounts (Sets account to disabled/inactive)
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // "block" or "unblock"
    const isBlocked = action === "block";

    // Try finding in Student collection
    let userDoc = await ReferralStudent.findById(userId);
    let modelName = "ReferralStudent";

    if (!userDoc) {
      userDoc = await Tutor.findById(userId);
      modelName = "Tutor";
    }

    if (!userDoc) {
      userDoc = await User.findById(userId);
      modelName = "User";
    }

    if (!userDoc) {
      return res.status(404).json({ success: false, message: "User account not found" });
    }

    // Set block / inactive flags dynamically based on model schemas
    if (modelName === "ReferralStudent") {
      userDoc.isVerified = !isBlocked; // Or similar blocking parameter
      // If there's an isBlocked field we can set it dynamically
      userDoc.set("isBlocked", isBlocked);
    } else if (modelName === "Tutor") {
      userDoc.set("isBlocked", isBlocked);
    } else {
      userDoc.set("isBlocked", isBlocked);
    }

    await userDoc.save();

    return res.status(200).json({
      success: true,
      message: `User successfully ${isBlocked ? "blocked" : "unblocked"}.`,
      data: { userId, isBlocked },
    });
  } catch (error) {
    console.error("🔥 Update User Status Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
