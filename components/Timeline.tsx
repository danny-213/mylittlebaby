import React from 'react';
import { AnyLog } from '../types';
import { Milk, Moon, Baby, Clock, Trash2 } from 'lucide-react';

interface TimelineProps {
  logs: AnyLog[];
  onDelete: (id: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ logs, onDelete }) => {
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pumping': return <Milk size={20} className="text-purple-600" />;
      case 'feeding': return <Baby size={20} className="text-pink-600" />;
      case 'sleep': return <Moon size={20} className="text-indigo-600" />;
      default: return <Clock size={20} className="text-gray-600" />;
    }
  };

  const getTitle = (log: AnyLog) => {
    switch (log.type) {
      case 'pumping':
        const sideText = log.side === 'both' ? 'Both Sides' : log.side === 'left' ? 'Left' : 'Right';
        return `Pumped ${log.volume_total}ml (${sideText})`;
      case 'feeding':
        return `Fed ${log.amount_ml}ml (${log.feed_type})`;
      case 'sleep':
        return `Slept ${log.duration_minutes} min`;
    }
  };

  const getSubtext = (log: AnyLog) => {
    return log.note ? log.note : '';
  };

  // Group logs by Date
  const groupedLogs = logs.reduce((acc, log) => {
    const dateKey = new Date(log.created_at).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, AnyLog[]>);

  // Sort dates descending (Newest first)
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-400">
        <Clock size={48} className="mb-2 opacity-20" />
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-20">
      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
        Recent Activity
      </h3>

      {sortedDates.map((dateKey) => (
        <div key={dateKey} className="mb-8 last:mb-0">
          <div className="sticky top-0 bg-slate-50 z-20 py-2 mb-2">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
               {formatDateHeader(dateKey)}
             </h4>
          </div>
          
          <div className="space-y-0">
            {groupedLogs[dateKey].map((log) => (
              <div key={log.id} className="relative pl-6 border-l-2 border-gray-200 last:border-transparent pb-6 last:pb-0 group">
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-50 border-2 border-gray-200 flex items-center justify-center z-10">
                  <div className={`w-2 h-2 rounded-full ${
                    log.type === 'pumping' ? 'bg-purple-500' : 
                    log.type === 'feeding' ? 'bg-pink-500' : 'bg-indigo-500'
                  }`} />
                </div>
                
                {/* Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between -mt-2 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      log.type === 'pumping' ? 'bg-purple-50' : 
                      log.type === 'feeding' ? 'bg-pink-50' : 'bg-indigo-50'
                    }`}>
                      {getIcon(log.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{getTitle(log)}</p>
                      <p className="text-xs text-gray-500">{getSubtext(log)}</p>
                      <p className="text-xs font-medium text-gray-400 mt-1">
                        {formatTime(log.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if(window.confirm('Are you sure you want to delete this record?')) {
                            onDelete(log.id);
                        }
                    }}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Delete record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};