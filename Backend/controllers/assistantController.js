import { analyzeConversation } from "../services/tutorialAssistant.service.js";

export const analyzeContext = async (req, res) => {
  try {
    const { conversationId, action } = req.body;

    if (!conversationId || !action) {
      return res.status(400).json({ success: false, message: "Missing conversationId or action" });
    }

    const result = await analyzeConversation(conversationId, action);
    
    return res.status(200).json({
      success: true,
      data: {
        title: result.title,
        content: result.content,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error in analyzeContext:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error during analysis" });
  }
};
