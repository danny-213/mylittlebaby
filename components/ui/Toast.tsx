import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
      <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center space-x-2">
        <CheckCircle size={18} className="text-green-400" />
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  );
};