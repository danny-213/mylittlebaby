import { AnyLog, BabyProfile, DailyStats, LogPumping } from '../types';

// Mock Data
let localBaby: BabyProfile = {
  id: 'baby_01',
  name: 'Tít',
  dob: '2023-09-15',
  height: 65,
  weight: 7.2,
  gender: 'male',
};

const generateMockLogs = (): AnyLog[] => {
  const logs: AnyLog[] = [];
  const now = new Date();
  
  // Create some data for the last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add 2-3 pumping sessions per day
    for (let j = 0; j < 3; j++) {
      logs.push({
        id: `pump_${i}_${j}`,
        baby_id: localBaby.id,
        created_at: new Date(date.setHours(8 + j * 4, 30)).toISOString(),
        type: 'pumping',
        side: j % 2 === 0 ? 'both' : 'left',
        volume_total: 120 + Math.floor(Math.random() * 50),
        note: 'Good session'
      });
    }

    // Add feeding
    for (let k = 0; k < 4; k++) {
       logs.push({
        id: `feed_${i}_${k}`,
        baby_id: localBaby.id,
        created_at: new Date(date.setHours(7 + k * 4, 0)).toISOString(),
        type: 'feeding',
        feed_type: 'formula',
        amount_ml: 150
      });
    }

    // Add sleep
    for (let l = 0; l < 2; l++) {
      const sleepStart = new Date(date.setHours(13 + l * 6, 0));
      const sleepEnd = new Date(sleepStart.getTime() + 90 * 60000); // 90 mins
       logs.push({
        id: `sleep_${i}_${l}`,
        baby_id: localBaby.id,
        created_at: sleepStart.toISOString(),
        type: 'sleep',
        start_time: sleepStart.toISOString(),
        end_time: sleepEnd.toISOString(),
        duration_minutes: 90
      });
    }
  }
  return logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

// In-memory store
let localLogs: AnyLog[] = generateMockLogs();

export const api = {
  getBabyProfile: async (): Promise<BabyProfile> => {
    return new Promise((resolve) => setTimeout(() => resolve(localBaby), 300));
  },

  updateBabyProfile: async (profile: BabyProfile): Promise<BabyProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localBaby = profile;
        resolve(localBaby);
      }, 500);
    });
  },

  getLogs: async (limit = 20): Promise<AnyLog[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localLogs.slice(0, limit));
      }, 300);
    });
  },

  addLog: async (log: Omit<AnyLog, 'id'>): Promise<AnyLog> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLog = { ...log, id: Math.random().toString(36).substr(2, 9) } as AnyLog;
        localLogs = [newLog, ...localLogs];
        resolve(newLog);
      }, 500);
    });
  },

  deleteLog: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localLogs = localLogs.filter(l => l.id !== id);
        resolve();
      }, 300);
    });
  },

  getDailyStats: async (dateStr: string): Promise<DailyStats> => {
    // Filter logs for the specific date
    const targetDate = new Date(dateStr).toDateString();
    
    const daysLogs = localLogs.filter(l => new Date(l.created_at).toDateString() === targetDate);
    
    const pumpLogs = daysLogs.filter(l => l.type === 'pumping') as LogPumping[];
    const feedLogs = daysLogs.filter(l => l.type === 'feeding') as import('../types').LogFeeding[];
    const sleepLogs = daysLogs.filter(l => l.type === 'sleep') as import('../types').LogSleep[];

    const totalPump = pumpLogs.reduce((sum, l) => sum + l.volume_total, 0);
    const totalFeed = feedLogs.reduce((sum, l) => sum + l.amount_ml, 0);
    const totalSleepMins = sleepLogs.reduce((sum, l) => sum + l.duration_minutes, 0);

    return {
      date: dateStr,
      total_pumping_ml: totalPump,
      total_feeding_ml: totalFeed,
      total_sleep_hours: parseFloat((totalSleepMins / 60).toFixed(1)),
      avg_pump_ml: pumpLogs.length ? Math.round(totalPump / pumpLogs.length) : 0,
      pump_count: pumpLogs.length
    };
  },
  
  getWeeklyPumpingStats: async (): Promise<{name: string; volume: number; fullDate: string}[]> => {
    const today = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const stats = await api.getDailyStats(dateStr);
        // Format: "Mon", "Tue" etc.
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        result.push({
            name: dayName,
            fullDate: dateStr,
            volume: stats.total_pumping_ml
        });
    }
    return result;
  }
};