import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  const [renderBase, setRenderBase] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRenderBase(true);
      requestAnimationFrame(() => {
        setAnimateIn(true);
      });
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setRenderBase(false);
      }, 300); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!renderBase) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal core */}
      <div 
        className={`relative w-full max-w-lg glass-panel modal-core-container max-h-[90vh] overflow-y-auto flex flex-col transition-all duration-300 transform ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-card/95 backdrop-blur-md rounded-t-2xl">
          <h2 className="text-xl font-bold text-foreground tracking-wide">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-[var(--radius-md)] transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 modal-body w-full flex-grow flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;