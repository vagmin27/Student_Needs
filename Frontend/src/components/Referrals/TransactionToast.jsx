import React from 'react';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Loader2, Info } from 'lucide-react';

/**
 * showToast Utility
 * Renders a custom styled toast notification using Sonner.
 * * @param {Object} params
 * @param {'pending' | 'success' | 'error' | 'info'} params.type - The state of the notification.
 * @param {string} params.message - The main text of the toast.
 * @param {string} [params.description] - Optional supporting text.
 */
export function showToast({ type, message, description }) {
  const toastContent = (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {type === 'pending' && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        {type === 'success' && <CheckCircle className="w-4 h-4 text-success" />}
        {type === 'error' && <XCircle className="w-4 h-4 text-destructive" />}
        {type === 'info' && <Info className="w-4 h-4 text-primary" />}
        <span className="font-medium">{message}</span>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground ml-6">{description}</p>
      )}
    </div>
  );

  // Return different Sonner methods based on type
  if (type === 'pending') {
    return toast.loading(toastContent, { duration: Infinity });
  } else if (type === 'success') {
    return toast.success(toastContent, { duration: 5000 });
  } else if (type === 'error') {
    return toast.error(toastContent, { duration: 5000 });
  } else {
    return toast.info(toastContent, { duration: 5000 });
  }
}

/**
 * dismissToast
 * Manually removes a toast from the queue using its ID.
 * @param {string | number} toastId 
 */
export function dismissToast(toastId) {
  toast.dismiss(toastId);
}

/**
 * showTransactionToast
 * Backward compatibility alias for the old transaction toast function.
 */
export function showTransactionToast({ type, message }) {
  return showToast({ type, message });
}