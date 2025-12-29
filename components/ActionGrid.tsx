import React from 'react';
import { Milk, Baby, Moon, BarChart3 } from 'lucide-react';

interface ActionGridProps {
  onAction: (action: 'pumping' | 'feeding' | 'sleep' | 'stats') => void;
}

export const ActionGrid: React.FC<ActionGridProps> = ({ onAction }) => {
  const actions = [
    { 
      id: 'pumping', 
      label: 'Hút sữa', 
      icon: <Milk size={32} />, 
      color: 'bg-purple-100 text-purple-600 border-purple-200' 
    },
    { 
      id: 'feeding', 
      label: 'Cho ăn', 
      icon: <Baby size={32} />, 
      color: 'bg-pink-100 text-pink-600 border-pink-200' 
    },
    { 
      id: 'sleep', 
      label: 'Giấc ngủ', 
      icon: <Moon size={32} />, 
      color: 'bg-indigo-100 text-indigo-600 border-indigo-200' 
    },
    { 
      id: 'stats', 
      label: 'Thống kê', 
      icon: <BarChart3 size={32} />, 
      color: 'bg-teal-100 text-teal-600 border-teal-200' 
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 px-6 mb-8">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.id as any)}
          className={`${action.color} border flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 aspect-[4/3]`}
        >
          <div className="mb-3">{action.icon}</div>
          <span className="font-semibold text-lg">{action.label}</span>
        </button>
      ))}
    </div>
  );
};