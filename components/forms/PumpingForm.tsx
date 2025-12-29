import React, { useState } from 'react';
import { LogPumping } from '../../types';
import { Save } from 'lucide-react';

interface PumpingFormProps {
  onSubmit: (data: Omit<LogPumping, 'id'>) => void;
}

export const PumpingForm: React.FC<PumpingFormProps> = ({ onSubmit }) => {
  const [side, setSide] = useState<'left' | 'right' | 'both'>('both');
  const [volume, setVolume] = useState<string>('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volume) return;

    const payload: Omit<LogPumping, 'id'> = {
      baby_id: 'baby_01', // Should come from context
      created_at: new Date(date).toISOString(),
      type: 'pumping',
      side,
      volume_total: parseInt(volume),
      note
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date & Time */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Date & Time</label>
        <input 
          type="datetime-local" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* Side Toggle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Side</label>
        <div className="grid grid-cols-3 bg-gray-100 p-1 rounded-xl">
          {(['left', 'both', 'right'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={`py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                side === s 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s === 'both' ? 'Both' : s === 'left' ? 'Trái' : 'Phải'}
            </button>
          ))}
        </div>
      </div>

      {/* Volume */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Total Volume (ml)</label>
        <div className="relative">
          <input 
            type="number" 
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="0"
            className="w-full p-4 text-3xl font-bold text-center bg-purple-50 border-2 border-purple-100 rounded-2xl focus:border-purple-500 focus:ring-0 outline-none text-purple-900 placeholder-purple-200"
            autoFocus
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 font-medium">ml</span>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Notes</label>
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional notes..."
          rows={3}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* Sticky Button Placeholder for spacing - real button is fixed */}
      <div className="h-4" />

      {/* Submit Action */}
      <button 
        type="submit"
        className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 active:scale-95 transition-transform flex items-center justify-center space-x-2"
      >
        <Save size={20} />
        <span>Add Record</span>
      </button>
    </form>
  );
};