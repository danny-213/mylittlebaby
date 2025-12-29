import React, { useState, useEffect } from 'react';
import { LogSleep } from '../../types';
import { Save } from 'lucide-react';

interface SleepFormProps {
  onSubmit: (data: Omit<LogSleep, 'id'>) => void;
}

export const SleepForm: React.FC<SleepFormProps> = ({ onSubmit }) => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  // Format to local datetime-local string (YYYY-MM-DDTHH:mm)
  const formatLocal = (d: Date) => {
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  };

  const [startTime, setStartTime] = useState(formatLocal(oneHourAgo));
  const [endTime, setEndTime] = useState(formatLocal(now));
  const [duration, setDuration] = useState(60);

  // Recalculate duration when times change
  useEffect(() => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const diffMins = Math.round((end - start) / 60000);
    setDuration(diffMins > 0 ? diffMins : 0);
  }, [startTime, endTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duration <= 0) return;

    const payload: Omit<LogSleep, 'id'> = {
      baby_id: 'baby_01',
      created_at: new Date(endTime).toISOString(), // Log timestamp is typically end time or start time. Let's use End.
      type: 'sleep',
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      duration_minutes: duration
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Start Time</label>
          <input 
            type="datetime-local" 
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">End Time</label>
          <input 
            type="datetime-local" 
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl flex flex-col items-center justify-center border border-indigo-100">
        <span className="text-indigo-600 text-sm font-medium uppercase tracking-wide">Total Duration</span>
        <div className="text-4xl font-bold text-indigo-900 mt-2">
          {Math.floor(duration / 60)}h {duration % 60}m
        </div>
      </div>

      <button 
        type="submit"
        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center space-x-2 mt-4"
      >
        <Save size={20} />
        <span>Log Sleep</span>
      </button>
    </form>
  );
};