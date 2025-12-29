import React, { useState } from 'react';
import { LogFeeding } from '../../types';
import { Save } from 'lucide-react';

interface FeedingFormProps {
  onSubmit: (data: Omit<LogFeeding, 'id'>) => void;
}

export const FeedingForm: React.FC<FeedingFormProps> = ({ onSubmit }) => {
  const [feedType, setFeedType] = useState<'formula' | 'breast'>('formula');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const payload: Omit<LogFeeding, 'id'> = {
      baby_id: 'baby_01',
      created_at: new Date(date).toISOString(),
      type: 'feeding',
      feed_type: feedType,
      amount_ml: parseInt(amount)
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
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Type</label>
        <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setFeedType('formula')}
            className={`py-3 text-sm font-medium rounded-lg transition-all ${
              feedType === 'formula' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Formula
          </button>
          <button
            type="button"
            onClick={() => setFeedType('breast')}
            className={`py-3 text-sm font-medium rounded-lg transition-all ${
              feedType === 'breast' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Breast Milk
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Amount (ml)</label>
        <div className="relative">
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full p-4 text-3xl font-bold text-center bg-pink-50 border-2 border-pink-100 rounded-2xl focus:border-pink-500 focus:ring-0 outline-none text-pink-900 placeholder-pink-200"
            autoFocus
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300 font-medium">ml</span>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full bg-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-200 active:scale-95 transition-transform flex items-center justify-center space-x-2 mt-8"
      >
        <Save size={20} />
        <span>Add Feeding</span>
      </button>
    </form>
  );
};