import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api.js';

export const useTutorialAssistant = (chatContext) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);

  const fetchAction = useCallback(async (actionType) => {
    const conversationId = chatContext?.conversationId;
    if (!conversationId) {
      toast.error('No active conversation');
      return;
    }

    setIsGenerating(true);
    setAiResponse(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tutorial-assistant/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationId, action: actionType }),
      });

      const text = await response.text();
      let result;
      try {
        result = text ? JSON.parse(text) : { success: false, message: 'Empty response' };
      } catch (e) {
        result = { success: false, message: 'Invalid JSON response from server' };
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to analyze conversation');
      }

      setAiResponse(result.data);
      toast.success('AI generated a response!');
    } catch (err) {
      console.error('Tutorial Assistant Error:', err);
      // Fallback mode
      const messages = chatContext?.messages || [];
      const validMessages = messages.filter(m => 
        m.type === 'text' && 
        !m.text?.toLowerCase().includes('call started') && 
        !m.text?.toLowerCase().includes('meeting link')
      );
      
      const fallbackContent = validMessages.length > 0 
        ? `Fallback Summary: We found ${validMessages.length} recent messages. Please try again later for deep analysis.`
        : "No valid messages found to analyze.";

      setAiResponse({
        title: "Assistant temporarily unavailable",
        content: fallbackContent,
        generatedAt: new Date().toISOString()
      });
      
      setError("Assistant API unavailable. Showing fallback response.");
    } finally {
      setIsGenerating(false);
    }
  }, [chatContext]);

  return {
    isGenerating,
    aiResponse,
    error,
    fetchAction,
    setAiResponse,
    setError
  };
};
