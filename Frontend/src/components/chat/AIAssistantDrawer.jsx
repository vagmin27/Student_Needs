import React, { useState } from "react";
import { Sparkles, X, FileText, List, MessageSquare, PenTool, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

export const AIAssistantDrawer = ({ isOpen, onClose, chatContext }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const handleAction = async (actionType) => {
    setIsGenerating(true);
    setAiResponse("");
    
    // Simulate AI API call
    setTimeout(() => {
      let result = "";
      switch (actionType) {
        case "summarize":
          result = "Here is a brief summary of your recent discussion:\n\n- Reviewed sorting algorithms (QuickSort & MergeSort).\n- Discussed time complexity optimizations.\n- Next step: Implement QuickSort in Python.";
          break;
        case "explain":
          result = "Quick explanation based on context:\n\nQuickSort uses a divide-and-conquer strategy, picking a 'pivot' element and partitioning the array around it. It has an average time complexity of O(N log N).";
          break;
        case "notes":
          result = "# Session Notes\n\n**Topics Covered:**\n- Algorithmic Analysis\n- Recursion limits\n\n**Key Takeaways:**\n- Always check base cases in recursive functions.";
          break;
        case "action_items":
          result = "- [ ] Implement QuickSort.\n- [ ] Compare performance with MergeSort.\n- [ ] Read Chapter 4 on graph theory before next session.";
          break;
        case "assignment":
          result = "Suggested Assignment:\n\n1. Write a function to perform QuickSort.\n2. Add a counter to track the number of swaps.\n3. Test it with an array of 1000 random integers.";
          break;
        case "follow_up":
          result = "Suggested Follow-up Questions:\n\n1. How does QuickSort degrade to O(N^2) in the worst case?\n2. What is an in-place sorting algorithm?\n3. How do we choose a good pivot?";
          break;
        default:
          result = "I'm here to help!";
      }
      setAiResponse(result);
      setIsGenerating(false);
      toast.success("AI generated a response!");
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-800 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <Sparkles className="w-5 h-5" />
          AI Study Assistant
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-sm text-slate-400 mb-4">
          How can I assist you with this session?
        </div>

        <div className="grid grid-cols-1 gap-2">
          <button onClick={() => handleAction("summarize")} className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-200 transition-colors border border-slate-700/50">
            <MessageSquare className="w-4 h-4 text-blue-400" /> Summarize Chat
          </button>
          <button onClick={() => handleAction("explain")} className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-200 transition-colors border border-slate-700/50">
            <HelpCircle className="w-4 h-4 text-green-400" /> Generate Explanation
          </button>
          <button onClick={() => handleAction("notes")} className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-200 transition-colors border border-slate-700/50">
            <FileText className="w-4 h-4 text-yellow-400" /> Create Notes
          </button>
          <button onClick={() => handleAction("action_items")} className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-200 transition-colors border border-slate-700/50">
            <List className="w-4 h-4 text-purple-400" /> Extract Action Items
          </button>
          <button onClick={() => handleAction("assignment")} className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-200 transition-colors border border-slate-700/50">
            <PenTool className="w-4 h-4 text-red-400" /> Generate Assignment
          </button>
          <button onClick={() => handleAction("follow_up")} className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-200 transition-colors border border-slate-700/50">
            <Sparkles className="w-4 h-4 text-teal-400" /> Suggest Questions
          </button>
        </div>

        {isGenerating && (
          <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-400">Analyzing context...</span>
          </div>
        )}

        {aiResponse && !isGenerating && (
          <div className="mt-6">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Response</h4>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
              {aiResponse}
            </div>
            <button 
              onClick={() => { navigator.clipboard.writeText(aiResponse); toast.success("Copied!"); }}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Copy to clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantDrawer;
