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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-panel border border-dashed border-white/20 hover:border-brand-primary/30 transition-colors duration-300 group">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-500 group-hover:text-brand-primary group-hover:scale-110 transition-all duration-300">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl border border-brand-primary/50 text-brand-primary font-semibold hover:bg-brand-primary/10 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;