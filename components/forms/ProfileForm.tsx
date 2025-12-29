import React, { useState } from 'react';
import { BabyProfile } from '../../types';
import { Save } from 'lucide-react';

interface ProfileFormProps {
  initialData: BabyProfile;
  onSubmit: (data: BabyProfile) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSubmit }) => {
  const [name, setName] = useState(initialData.name);
  const [dob, setDob] = useState(initialData.dob.split('T')[0]); // Handle potentially different formats, but mostly expect YYYY-MM-DD
  const [height, setHeight] = useState(initialData.height.toString());
  const [weight, setWeight] = useState(initialData.weight.toString());
  const [gender, setGender] = useState(initialData.gender);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob || !height || !weight) return;

    const updatedProfile: BabyProfile = {
      ...initialData,
      name,
      dob: new Date(dob).toISOString().split('T')[0], // Ensure consistent format
      height: parseFloat(height),
      weight: parseFloat(weight),
      gender
    };
    onSubmit(updatedProfile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Baby's Name</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Date of Birth</label>
        <input 
          type="date" 
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Gender</label>
        <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`py-3 text-sm font-medium rounded-lg transition-all ${
              gender === 'male' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Boy
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`py-3 text-sm font-medium rounded-lg transition-all ${
              gender === 'female' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Girl
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Height (cm)</label>
          <input 
            type="number" 
            step="0.1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
          <input 
            type="number" 
            step="0.01"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
      </div>

      {/* Submit Action */}
      <button 
        type="submit"
        className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 active:scale-95 transition-transform flex items-center justify-center space-x-2 mt-8"
      >
        <Save size={20} />
        <span>Save Profile</span>
      </button>
    </form>
  );
};