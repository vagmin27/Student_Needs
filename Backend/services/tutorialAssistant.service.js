import TutorialConversation from "../models/Tutorials/TutorialConversation.js";
import TutorialMessage from "../models/Tutorials/TutorialMessage.js";

// Cache for results
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Helper to filter valid text messages
const getValidMessages = (messages) => {
  return messages.filter(
    (m) =>
      m.type === "text" &&
      !m.deleted &&
      m.text &&
      m.text.trim().length > 0 &&
      !m.text.toLowerCase().includes("call started") &&
      !m.text.toLowerCase().includes("meeting link")
  );
};

// Simple heuristic keyword extractor
const extractKeywords = (text) => {
  const stopWords = new Set(["the", "is", "at", "which", "on", "and", "a", "an", "to", "in", "of", "for", "with", "this", "that", "it", "as", "be", "are", "was", "will", "can", "how", "what", "why", "we", "you", "i", "have", "do", "not", "but", "by", "from", "they", "or", "so", "if"]);
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const counts = {};
  words.forEach(w => {
    if (!stopWords.has(w)) {
      counts[w] = (counts[w] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(e => e[0]);
};

// Action generators based on heuristics
const generateSummary = (messages, subject) => {
  if (messages.length === 0) return "No sufficient conversation history to summarize.";
  
  const allText = messages.map(m => m.text).join(" ");
  const keywords = extractKeywords(allText);
  
  if (keywords.length === 0) return "Recent discussion was too brief to summarize.";

  const capitalizedKeywords = keywords.map(w => w.charAt(0).toUpperCase() + w.slice(1));
  
  return `Today's session regarding ${subject || 'the subject'} covered:\n• ${capitalizedKeywords.slice(0, 2).join(' & ')}\n• Discussed key concepts around ${capitalizedKeywords[2] || 'recent topics'}\n• Addressed related edge cases.`;
};

const generateExplanation = (messages, subject) => {
  if (messages.length === 0) return "Not enough context to explain.";
  
  const allText = messages.map(m => m.text).join(" ");
  const keywords = extractKeywords(allText);
  const mainTopic = keywords[0] ? (keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)) : (subject || "The topic");

  return `Topic: ${mainTopic}\n\nExplanation:\nBased on the recent context, ${mainTopic} is a core concept that requires understanding its basic structure and rules. It connects with other discussed concepts like ${keywords[1] || 'related topics'}.\n\nTips:\n- Always review the foundational definitions.\n- Practice with variations of the problem.`;
};

const generateNotes = (messages, subject) => {
  const allText = messages.map(m => m.text).join(" ");
  const keywords = extractKeywords(allText);
  
  return `# Revision Notes: ${subject || 'Recent Session'}\n\n**Key Points:**\n- Focused heavily on ${keywords[0] || 'core concepts'}.\n- Touched upon ${keywords.slice(1, 3).join(', ') || 'various topics'}.\n\n**Next Steps:**\n- Ensure you memorize the properties of ${keywords[0] || 'the main topic'}.`;
};

const generateActionItems = (messages) => {
  const allText = messages.map(m => m.text).join(" ");
  const keywords = extractKeywords(allText);
  const topic1 = keywords[0] || "core concept";
  const topic2 = keywords[1] || "related concepts";

  return `Action Items:\n□ Review notes on ${topic1}.\n□ Practice problems related to ${topic2}.\n□ Prepare a list of doubts for the next session.`;
};

const generateAssignments = (messages, subject) => {
  const allText = messages.map(m => m.text).join(" ");
  const keywords = extractKeywords(allText);
  const topic = keywords[0] || subject || "current topic";

  return `Suggested Assignment:\n\n1. Write a short summary explaining ${topic} in your own words.\n2. Solve 3 practice problems focusing on ${topic}.\n3. Identify one real-world application of ${keywords[1] || 'this concept'}.`;
};

const generateQuestions = (messages) => {
  const allText = messages.map(m => m.text).join(" ");
  const keywords = extractKeywords(allText);
  const topic = keywords[0] || "this topic";

  return `Questions you may want to ask your tutor:\n\n1. Could you provide a simpler example of ${topic}?\n2. What are the most common mistakes students make with ${keywords[1] || 'this'}?\n3. How does this connect to what we will learn next?`;
};

const generateNextSteps = (messages, subject) => {
  const allText = messages.map(m => m.text).join(" ");
  const keywords = extractKeywords(allText);
  
  return `Next Session Plan:\n\nTopics to cover:\n- Advanced applications of ${keywords[0] || subject || 'the current topic'}\n\nPreparation:\n- Complete the assignment on ${keywords[1] || 'recent concepts'}.\n- Review previous notes.`;
};

export const analyzeConversation = async (conversationId, action) => {
  const cacheKey = `${conversationId}_${action}`;
  const cachedResult = cache.get(cacheKey);
  
  if (cachedResult && (Date.now() - cachedResult.timestamp < CACHE_TTL)) {
    return cachedResult.data;
  }

  const conversation = await TutorialConversation.findById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Fetch recent messages
  const rawMessages = await TutorialMessage.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(50);

  const messages = getValidMessages(rawMessages);
  const subject = conversation.latestSubject || "Tutorial";

  let title = "Assistant Response";
  let content = "";

  if (messages.length === 0) {
    content = "Start chatting to unlock AI study assistance. Context is currently empty.";
  } else {
    switch (action) {
      case "summarize":
        title = "Chat Summary";
        content = generateSummary(messages, subject);
        break;
      case "explain":
        title = "Concept Explanation";
        content = generateExplanation(messages, subject);
        break;
      case "notes":
        title = "Session Notes";
        content = generateNotes(messages, subject);
        break;
      case "action_items":
        title = "Action Items";
        content = generateActionItems(messages);
        break;
      case "assignment":
        title = "Assignment";
        content = generateAssignments(messages, subject);
        break;
      case "follow_up":
        title = "Suggested Questions";
        content = generateQuestions(messages);
        break;
      case "next_steps":
        title = "Next Steps";
        content = generateNextSteps(messages, subject);
        break;
      default:
        content = "Unknown action requested.";
    }
  }

  const resultObj = {
    title,
    content
  };

  cache.set(cacheKey, {
    data: resultObj,
    timestamp: Date.now()
  });

  return resultObj;
};
