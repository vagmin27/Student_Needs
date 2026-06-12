import React, { useState } from "react";
import { Sparkles, X, FileText, List, MessageSquare, PenTool, HelpCircle, RefreshCw, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useTutorialAssistant } from "../../hooks/useTutorialAssistant";

export const TutorialAssistantDrawer = ({ isOpen, onClose, chatContext }) => {
  const { isGenerating, aiResponse, error, fetchAction, setAiResponse } = useTutorialAssistant(chatContext);
  const [lastAction, setLastAction] = useState(null);

  const handleAction = async (actionType) => {
    setLastAction(actionType);
    await fetchAction(actionType);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-card border-l border-border shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-card/50 backdrop-blur-md">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <Sparkles className="w-5 h-5" />
          AI Study Assistant
        </div>
        <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          How can I assist you with this session?
        </div>

        <div className="grid grid-cols-1 gap-2">
          <button onClick={() => handleAction("summarize")} disabled={isGenerating} className="flex items-center gap-3 p-3 bg-muted/50 hover:bg-accent rounded-[var(--radius-md)] text-sm font-medium text-foreground transition-colors border border-border/50 disabled:opacity-50">
            <MessageSquare className="w-4 h-4 text-[var(--primary)]" /> Summarize Chat
          </button>
          <button onClick={() => handleAction("explain")} disabled={isGenerating} className="flex items-center gap-3 p-3 bg-muted/50 hover:bg-accent rounded-[var(--radius-md)] text-sm font-medium text-foreground transition-colors border border-border/50 disabled:opacity-50">
            <HelpCircle className="w-4 h-4 text-green-400" /> Generate Explanation
          </button>
          <button onClick={() => handleAction("notes")} disabled={isGenerating} className="flex items-center gap-3 p-3 bg-muted/50 hover:bg-accent rounded-[var(--radius-md)] text-sm font-medium text-foreground transition-colors border border-border/50 disabled:opacity-50">
            <FileText className="w-4 h-4 text-yellow-400" /> Create Notes
          </button>
          <button onClick={() => handleAction("action_items")} disabled={isGenerating} className="flex items-center gap-3 p-3 bg-muted/50 hover:bg-accent rounded-[var(--radius-md)] text-sm font-medium text-foreground transition-colors border border-border/50 disabled:opacity-50">
            <List className="w-4 h-4 text-[var(--primary)]" /> Extract Action Items
          </button>
          <button onClick={() => handleAction("assignment")} disabled={isGenerating} className="flex items-center gap-3 p-3 bg-muted/50 hover:bg-accent rounded-[var(--radius-md)] text-sm font-medium text-foreground transition-colors border border-border/50 disabled:opacity-50">
            <PenTool className="w-4 h-4 text-red-400" /> Generate Assignment
          </button>
          <button onClick={() => handleAction("follow_up")} disabled={isGenerating} className="flex items-center gap-3 p-3 bg-muted/50 hover:bg-accent rounded-[var(--radius-md)] text-sm font-medium text-foreground transition-colors border border-border/50 disabled:opacity-50">
            <HelpCircle className="w-4 h-4 text-teal-400" /> Suggest Questions
          </button>
          <button onClick={() => handleAction("next_steps")} disabled={isGenerating} className="flex items-center gap-3 p-3 bg-muted/50 hover:bg-accent rounded-[var(--radius-md)] text-sm font-medium text-foreground transition-colors border border-border/50 disabled:opacity-50">
            <Sparkles className="w-4 h-4 text-orange-400" /> Next Session Plan
          </button>
        </div>

        {isGenerating && (
          <div className="mt-6 p-4 rounded-[var(--radius-md)] bg-muted/30 border border-border/30 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-muted-foreground animate-pulse">Analyzing context...</span>
          </div>
        )}

        {error && !isGenerating && (
          <div className="mt-6 p-4 rounded-[var(--radius-md)] bg-red-900/20 border border-red-900/50 flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-xs text-red-300 text-center">{error}</span>
            <button 
              onClick={() => handleAction(lastAction)}
              className="mt-2 text-xs flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {aiResponse && !isGenerating && (
          <div className="mt-6 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{aiResponse.title || 'Response'}</h4>
              <span className="text-[10px] text-muted-foreground">
                {aiResponse.generatedAt ? new Date(aiResponse.generatedAt).toLocaleTimeString() : new Date().toLocaleTimeString()}
              </span>
            </div>
            
            <div className="p-4 rounded-[var(--radius-md)] bg-primary/10 border border-primary/20 text-sm text-foreground whitespace-pre-wrap leading-relaxed shadow-inner overflow-hidden relative">
              {aiResponse.content}
            </div>

            <div className="flex items-center gap-3 mt-3 px-1">
              <button 
                onClick={() => { navigator.clipboard.writeText(aiResponse.content); toast.success("Copied!"); }}
                className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                Copy
              </button>
              <button 
                onClick={() => handleAction(lastAction)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 ml-auto"
              >
                <RefreshCw className="w-3 h-3" /> Regenerate
              </button>
            </div>
          </div>
        )}

        {!aiResponse && !isGenerating && !error && (
          <div className="mt-8 text-center px-4">
            <span className="text-xs text-muted-foreground italic block">
              "Start chatting to unlock AI study assistance"
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialAssistantDrawer;
