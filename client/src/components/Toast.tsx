import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, duration = 2000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);

    // Auto-dismiss exactly after 2 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 250);
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-forest-900 text-cream-100 px-4 py-3 rounded-2xl shadow-2xl border border-forest-700/60 flex items-center gap-3 max-w-sm">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <span className="text-cream-100 font-medium">{message}</span>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 200);
          }}
          className="text-stone-400 hover:text-white p-1 ml-auto cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
