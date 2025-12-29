import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const ActionDrawer: React.FC<ActionDrawerProps> = ({ isOpen, onClose, title, children }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setVisible(false), 300); // Wait for animation
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 pointer-events-auto ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer Content */}
      <div 
        className={`relative w-full max-w-lg bg-white rounded-t-[2rem] shadow-2xl transform transition-transform duration-300 ease-out pointer-events-auto flex flex-col max-h-[90vh] ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle Bar */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto no-scrollbar pb-24">
          {children}
        </div>
      </div>
    </div>
  );
};