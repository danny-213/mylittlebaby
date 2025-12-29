import React, { useEffect, useState } from 'react';
import { api } from './services/api';
import { BabyProfile, AnyLog } from './types';
import { BabyHeader } from './components/BabyHeader';
import { ActionGrid } from './components/ActionGrid';
import { Timeline } from './components/Timeline';
import { ActionDrawer } from './components/ActionDrawer';
import { PumpingForm } from './components/forms/PumpingForm';
import { FeedingForm } from './components/forms/FeedingForm';
import { SleepForm } from './components/forms/SleepForm';
import { ProfileForm } from './components/forms/ProfileForm';
import { StatsView } from './components/StatsView';
import { Toast } from './components/ui/Toast';

const App: React.FC = () => {
  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [logs, setLogs] = useState<AnyLog[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'stats'>('dashboard');
  const [activeDrawer, setActiveDrawer] = useState<'pumping' | 'feeding' | 'sleep' | 'profile' | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Initial Load
    const loadData = async () => {
      const [baby, recentLogs] = await Promise.all([
        api.getBabyProfile(),
        api.getLogs()
      ]);
      setProfile(baby);
      setLogs(recentLogs);
    };
    loadData();
  }, []);

  const handleAction = (action: 'pumping' | 'feeding' | 'sleep' | 'stats') => {
    if (action === 'stats') {
      setCurrentView('stats');
    } else {
      setActiveDrawer(action);
    }
  };

  const handleFormSubmit = async (data: any) => {
    // Optimistic UI update or simple wait
    const newLog = await api.addLog(data);
    setLogs([newLog, ...logs]);
    setActiveDrawer(null);
    showNotification('Record added successfully!');
  };

  const handleDeleteLog = async (id: string) => {
    await api.deleteLog(id);
    setLogs(prev => prev.filter(l => l.id !== id));
    showNotification('Record deleted.');
  };

  const handleProfileUpdate = async (updatedProfile: BabyProfile) => {
    const savedProfile = await api.updateBabyProfile(updatedProfile);
    setProfile(savedProfile);
    setActiveDrawer(null);
    showNotification('Profile updated!');
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  if (currentView === 'stats') {
    return <StatsView onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 relative pb-10 max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* Toast Notification */}
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onHide={() => setShowToast(false)} 
      />

      {/* Main Content */}
      <div className="h-full overflow-y-auto no-scrollbar">
        {profile ? (
          <BabyHeader 
            profile={profile} 
            onEdit={() => setActiveDrawer('profile')} 
          />
        ) : (
          <div className="h-48 bg-gray-200 animate-pulse rounded-b-3xl" />
        )}
        
        <ActionGrid onAction={handleAction} />
        
        <Timeline logs={logs} onDelete={handleDeleteLog} />
      </div>

      {/* Drawers */}
      <ActionDrawer 
        isOpen={activeDrawer === 'pumping'} 
        onClose={() => setActiveDrawer(null)}
        title="Log Pumping"
      >
        <PumpingForm onSubmit={handleFormSubmit} />
      </ActionDrawer>

      <ActionDrawer 
        isOpen={activeDrawer === 'feeding'} 
        onClose={() => setActiveDrawer(null)}
        title="Log Feeding"
      >
        <FeedingForm onSubmit={handleFormSubmit} />
      </ActionDrawer>

      <ActionDrawer 
        isOpen={activeDrawer === 'sleep'} 
        onClose={() => setActiveDrawer(null)}
        title="Log Sleep"
      >
        <SleepForm onSubmit={handleFormSubmit} />
      </ActionDrawer>

      <ActionDrawer
        isOpen={activeDrawer === 'profile'}
        onClose={() => setActiveDrawer(null)}
        title="Edit Baby Profile"
      >
        {profile && (
          <ProfileForm 
            initialData={profile} 
            onSubmit={handleProfileUpdate} 
          />
        )}
      </ActionDrawer>
    </div>
  );
};

export default App;