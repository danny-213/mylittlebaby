import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import { DailyStats } from '../types';

interface StatsViewProps {
  onBack: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ onBack }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedDateStats, setSelectedDateStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Get chart data (last 7 days pumping)
      const weeklyData = await api.getWeeklyPumpingStats();
      setChartData(weeklyData);

      // 2. Get stats for today (or the last entry in weekly data) by default
      if (weeklyData.length > 0) {
        const lastDay = weeklyData[weeklyData.length - 1];
        const stats = await api.getDailyStats(lastDay.fullDate);
        setSelectedDateStats(stats);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleBarClick = async (data: any) => {
    setLoading(true);
    const stats = await api.getDailyStats(data.fullDate);
    setSelectedDateStats(stats);
    setLoading(false);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-100 shadow-lg rounded-lg text-xs">
          <p className="font-bold text-gray-800">{label}</p>
          <p className="text-purple-600">{`${payload[0].value} ml`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm z-10 sticky top-0">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Statistics</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 mb-6 uppercase tracking-wider">Pumping Volume (7 Days)</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} onClick={(e: any) => e && e.activePayload && handleBarClick(e.activePayload[0].payload)}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#9ca3af'}} 
                    dy={10}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#f3e8ff'}} />
                  <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fullDate === selectedDateStats?.date ? '#7c3aed' : '#d8b4fe'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">Tap a bar to see details</p>
        </div>

        {/* Summary Cards */}
        {selectedDateStats && (
            <div className="space-y-4 animate-fade-in">
                 <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Details for {new Date(selectedDateStats.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                 </h2>
                 <div className="grid grid-cols-3 gap-3">
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <p className="text-xs text-purple-600 mb-1">Times Pumped</p>
                        <p className="text-2xl font-bold text-purple-900">{selectedDateStats.pump_count}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <p className="text-xs text-purple-600 mb-1">Total Volume</p>
                        <p className="text-2xl font-bold text-purple-900">{selectedDateStats.total_pumping_ml}<span className="text-sm ml-1 font-normal">ml</span></p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <p className="text-xs text-purple-600 mb-1">Avg / Pump</p>
                        <p className="text-2xl font-bold text-purple-900">{selectedDateStats.avg_pump_ml}<span className="text-sm ml-1 font-normal">ml</span></p>
                    </div>
                 </div>

                 {/* Other stats */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 flex flex-col justify-between">
                        <p className="text-xs text-pink-600 mb-2">Feeding Total</p>
                        <p className="text-xl font-bold text-pink-900">{selectedDateStats.total_feeding_ml} ml</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col justify-between">
                        <p className="text-xs text-indigo-600 mb-2">Sleep Total</p>
                        <p className="text-xl font-bold text-indigo-900">{selectedDateStats.total_sleep_hours} hrs</p>
                    </div>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};