import React from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className="bg-forest-900 text-cream-100 px-4 py-3 rounded-2xl shadow-2xl border border-forest-700/60 flex items-center gap-3 max-w-sm">
        <div className="w-8 h-8 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-white block">Cart Updated</span>
          <span className="text-cream-200">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white p-1 ml-auto"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
