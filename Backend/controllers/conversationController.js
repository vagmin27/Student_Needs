import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import ReferralStudent from "../models/Referrals/StudentModel.js";
import Tutor from "../models/Tutorials/Tutor.js";
import User from "../models/Tutorials/user.js";

/**
 * Helper to map and format conversation to unified frontend structure
 */
export const formatConversation = (conv, currentUserId) => {
  const stringUserId = currentUserId.toString();
  // Determine if current user is student in this conversation
  const isStudent = conv.studentId?._id?.toString() === stringUserId || conv.studentId?.toString() === stringUserId;
  
  const partnerIdDoc = isStudent ? conv.tutorId : conv.studentId;
  const partnerModel = isStudent ? conv.tutorModel : conv.studentModel;

  let partnerName = "User";
  let partnerEmail = "";
  let partnerPic = null;
  let partnerExpertise = "";

  if (partnerIdDoc && typeof partnerIdDoc === "object") {
    if (partnerModel === "ReferralStudent") {
      partnerName = `${partnerIdDoc.firstName || ""} ${partnerIdDoc.lastName || ""}`.trim();
      partnerEmail = partnerIdDoc.email;
      partnerPic = partnerIdDoc.image;
    } else if (partnerModel === "Tutor") {
      partnerName = partnerIdDoc.name || `${partnerIdDoc.fName || ""} ${partnerIdDoc.lName || ""}`.trim() || "Tutor";
      partnerEmail = partnerIdDoc.email;
      partnerPic = partnerIdDoc.profilePic;
      partnerExpertise = partnerIdDoc.expertise || (Array.isArray(partnerIdDoc.subjects) ? partnerIdDoc.subjects.join(", ") : "");
    } else if (partnerModel === "User") {
      partnerName = partnerIdDoc.profile?.displayName || `${partnerIdDoc.profile?.fName || ""} ${partnerIdDoc.profile?.lName || ""}`.trim() || partnerIdDoc.user || "User";
      partnerEmail = partnerIdDoc.user;
      partnerPic = partnerIdDoc.pic;
      partnerExpertise = partnerIdDoc.profile?.subjects || "";
    }
  }

  const unreadCount = isStudent ? (conv.unreadCounts?.student || 0) : (conv.unreadCounts?.tutor || 0);
  const isArchived = isStudent ? !!conv.isArchivedByStudent : !!conv.isArchivedByTutor;

  return {
    _id: conv._id,
    conversationKey: conv.conversationKey,
    studentId: conv.studentId?._id || conv.studentId,
    tutorId: conv.tutorId?._id || conv.tutorId,
    lastMessage: conv.lastMessage,
    lastMessageTime: conv.lastMessageTime,
    unreadCount,
    isArchived,
    blockedBy: conv.blockedBy,
    blockedModel: conv.blockedModel,
    isBlocked: !!conv.blockedBy,
    partner: {
      _id: partnerIdDoc?._id || partnerIdDoc,
      name: partnerName,
      email: partnerEmail,
      pic: partnerPic,
      role: isStudent ? "tutor" : "student",
      expertise: partnerExpertise,
    },
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt,
  };
};

/**
 * 🚀 Create or retrieve conversation (ensuring unique conversationKey)
 */
export const createOrGetConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role.toLowerCase();
    
    let studentId, tutorId;

    if (currentUserRole === "tutor" || currentUserRole === "teacher") {
      tutorId = currentUserId;
      studentId = req.body.studentId;
    } else {
      studentId = currentUserId;
      tutorId = req.body.tutorId;
    }

    if (!studentId || !tutorId) {
      return res.status(400).json({ success: false, message: "Missing studentId or tutorId" });
    }

    const conversationKey = `${studentId}_${tutorId}`;

    // 1. Try to find existing conversation
    let conversation = await Conversation.findOne({ conversationKey })
      .populate("studentId")
      .populate("tutorId")
      .populate("lastMessage");

    if (conversation) {
      // Re-activate if marked inactive
      if (!conversation.isActive) {
        conversation.isActive = true;
        await conversation.save();
      }
      return res.status(200).json({
        success: true,
        data: formatConversation(conversation, currentUserId),
      });
    }

    // 2. Resolve collections dynamically
    let studentModel = "ReferralStudent";
    const refStudentExists = await ReferralStudent.exists({ _id: studentId });
    if (!refStudentExists) {
      const userExists = await User.exists({ _id: studentId });
      if (userExists) {
        studentModel = "User";
      } else {
        return res.status(404).json({ success: false, message: "Student account not found" });
      }
    }

    let tutorModel = "Tutor";
    const tutorExists = await Tutor.exists({ _id: tutorId });
    if (!tutorExists) {
      const userExists = await User.exists({ _id: tutorId });
      if (userExists) {
        tutorModel = "User";
      } else {
        return res.status(404).json({ success: false, message: "Tutor account not found" });
      }
    }

    // 3. Create conversation document
    conversation = await Conversation.create({
      conversationKey,
      participants: [studentId, tutorId],
      studentId,
      studentModel,
      tutorId,
      tutorModel,
      unreadCounts: { student: 0, tutor: 0 },
    });

    // Populate and format response
    const populated = await Conversation.findById(conversation._id)
      .populate("studentId")
      .populate("tutorId");

    return res.status(201).json({
      success: true,
      data: formatConversation(populated, currentUserId),
    });
  } catch (error) {
    console.error("🔥 Create Conversation Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🔍 Get conversations for logged-in user (supporting search, sorting, archiving filters)
 */
export const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role.toLowerCase();
    const isTutor = currentUserRole === "tutor" || currentUserRole === "teacher";
    
    const { search, includeArchived } = req.query;

    const query = {
      participants: currentUserId,
      isActive: true,
    };

    // Filter out archived unless specified
    if (includeArchived !== "true") {
      if (isTutor) {
        query.isArchivedByTutor = false;
      } else {
        query.isArchivedByStudent = false;
      }
    }

    let conversations = await Conversation.find(query)
      .populate("studentId")
      .populate("tutorId")
      .populate("lastMessage")
      .sort({ lastMessageTime: -1 });

    // Format all conversations
    let formatted = conversations.map(c => formatConversation(c, currentUserId));

    // Keyword search filter (filtering by partner name on the formatted array)
    if (search && search.trim() !== "") {
      const keyword = search.trim().toLowerCase();
      formatted = formatted.filter(
        c => c.partner?.name?.toLowerCase().includes(keyword) || c.partner?.email?.toLowerCase().includes(keyword)
      );
    }

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error("🔥 Get Conversations Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🔍 Get Conversation by ID
 */
export const getConversationById = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { id } = req.params;

    const conversation = await Conversation.findOne({
      _id: id,
      participants: currentUserId,
    })
      .populate("studentId")
      .populate("tutorId")
      .populate("lastMessage");

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    return res.status(200).json({
      success: true,
      data: formatConversation(conversation, currentUserId),
    });
  } catch (error) {
    console.error("🔥 Get Conversation ID Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 📦 Archive / Unarchive Conversation
 */
export const toggleArchiveConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role.toLowerCase();
    const isTutor = currentUserRole === "tutor" || currentUserRole === "teacher";
    const { id } = req.params;
    const { archive } = req.body; // boolean

    const conv = await Conversation.findOne({ _id: id, participants: currentUserId });
    if (!conv) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    if (isTutor) {
      conv.isArchivedByTutor = archive === true;
    } else {
      conv.isArchivedByStudent = archive === true;
    }

    await conv.save();

    return res.status(200).json({
      success: true,
      message: archive ? "Conversation archived" : "Conversation unarchived",
      data: { isArchived: archive === true },
    });
  } catch (error) {
    console.error("🔥 Toggle Archive Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🚫 Block / Unblock user in Conversation
 */
export const toggleBlockConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role.toLowerCase();
    const { id } = req.params;
    const { block } = req.body; // boolean

    const conv = await Conversation.findOne({ _id: id, participants: currentUserId });
    if (!conv) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    if (block === true) {
      conv.blockedBy = currentUserId;
      // Resolve senderModel
      let senderModel = "ReferralStudent";
      if (currentUserRole === "tutor" || currentUserRole === "teacher") {
        senderModel = "Tutor";
        const isTutorModel = await Tutor.exists({ _id: currentUserId });
        if (!isTutorModel) senderModel = "User";
      } else {
        const isStudModel = await ReferralStudent.exists({ _id: currentUserId });
        if (!isStudModel) senderModel = "User";
      }
      conv.blockedModel = senderModel;
    } else {
      // Only the user who blocked can unblock
      if (conv.blockedBy && conv.blockedBy.toString() !== currentUserId.toString()) {
        return res.status(403).json({ success: false, message: "Cannot unblock. Blocked by other party." });
      }
      conv.blockedBy = null;
      conv.blockedModel = null;
    }

    await conv.save();

    return res.status(200).json({
      success: true,
      message: block ? "Conversation blocked" : "Conversation unblocked",
      data: { blockedBy: conv.blockedBy, isBlocked: !!conv.blockedBy },
    });
  } catch (error) {
    console.error("🔥 Toggle Block Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
