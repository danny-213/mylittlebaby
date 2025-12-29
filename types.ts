export type ActivityType = 'pumping' | 'feeding' | 'sleep';

export interface BabyProfile {
  id: string;
  name: string;
  dob: string; // ISO date string
  height: number; // cm
  weight: number; // kg
  gender: 'male' | 'female';
}

export interface LogBase {
  id: string;
  baby_id: string;
  created_at: string; // ISO date string
  type: ActivityType;
  note?: string;
}

export interface LogPumping extends LogBase {
  type: 'pumping';
  side: 'left' | 'right' | 'both';
  volume_total: number; // ml
}

export interface LogFeeding extends LogBase {
  type: 'feeding';
  feed_type: 'formula' | 'breast';
  amount_ml: number;
}

export interface LogSleep extends LogBase {
  type: 'sleep';
  start_time: string; // ISO
  end_time?: string; // ISO
  duration_minutes: number;
}

export type AnyLog = LogPumping | LogFeeding | LogSleep;

export interface DailyStats {
  date: string;
  total_pumping_ml: number;
  total_feeding_ml: number;
  total_sleep_hours: number;
  avg_pump_ml: number;
  pump_count: number;
}