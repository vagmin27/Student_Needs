import React from 'react';
import { MdOutlineInbox } from 'react-icons/md';

const EmptyState = ({ 
  icon: Icon = MdOutlineInbox, 
  title = "No Data Found", 
  message = "There's nothing here yet. Try adjusting your filters or adding a new entry.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-panel border border-dashed border-border hover:border-primary/30 transition-colors duration-300 group">
      <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl border border-primary/50 text-primary font-semibold hover:bg-primary/10 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;