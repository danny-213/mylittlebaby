import React from 'react';
import { BabyProfile } from '../types';
import { Ruler, Weight, Pencil } from 'lucide-react';

interface BabyHeaderProps {
  profile: BabyProfile;
  onEdit: () => void;
}

export const BabyHeader: React.FC<BabyHeaderProps> = ({ profile, onEdit }) => {
  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    const months = Math.floor(diffDays / 30);
    return `${months} months`;
  };

  return (
    <div className="w-full bg-gradient-to-r from-primary to-primaryLight text-white rounded-b-3xl p-6 shadow-lg mb-6 relative">
      <button 
        onClick={onEdit}
        className="absolute top-6 right-6 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm"
      >
        <Pencil size={18} className="text-white" />
      </button>

      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-2xl">
          {profile.gender === 'female' ? '👧' : '👶'}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-white/80 text-sm">{calculateAge(profile.dob)} old</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white/10 rounded-xl p-3 flex items-center space-x-3 backdrop-blur-sm">
          <div className="p-2 bg-white/20 rounded-full">
            <Ruler size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-white/70">Height</p>
            <p className="font-semibold">{profile.height} cm</p>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-3 flex items-center space-x-3 backdrop-blur-sm">
          <div className="p-2 bg-white/20 rounded-full">
            <Weight size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-white/70">Weight</p>
            <p className="font-semibold">{profile.weight} kg</p>
          </div>
        </div>
      </div>
    </div>
  );
};