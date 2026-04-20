import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Activity, 
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Zap,
  Target
} from 'lucide-react';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import { Skeleton } from '../../components/dashboard/Skeleton';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { WEEKLY_ANOMALIES } from '../../lib/mock-data';
import { apiService } from '../../services/apiService';

export const DashboardOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeAlerts: 0,
    avgRisk: 0,
    accuracy: 97.4,
    avgScore: 0,
    avgAttendance: 0
  });

  useEffect(() => {
    // Subscribe to live dashboard stats aggregation
    const unsubscribe = apiService.getDashboardStats((newStats) => {
      setStats(newStats);
      setLoading(false);
    });

    // Safety timeout to ensure dashboard is visible even if API lags
    const timer = setTimeout(() => setLoading(false), 2000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 rounded-2xl w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
           <div className="relative z-10">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Users size={20} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Students</p>
              <h3 className="text-2xl font-black text-gray-900">{stats.totalStudents}</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
           <div className="relative z-10">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-all">
                <AlertTriangle size={20} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Anomalies</p>
              <h3 className="text-2xl font-black text-gray-900">{stats.activeAlerts}</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
           <div className="relative z-10">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Activity size={20} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Risk</p>
              <h3 className="text-2xl font-black text-gray-900">{stats.avgRisk}%</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
           <div className="relative z-10">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-all">
                <BrainCircuit size={20} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Accuracy</p>
              <h3 className="text-2xl font-black text-gray-900">{stats.accuracy}%</h3>
           </div>
        </div>

        {/* New Advanced Cards */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
           <div className="relative z-10">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Zap size={20} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Score</p>
              <h3 className="text-2xl font-black text-gray-900">{stats.avgScore}</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
           <div className="relative z-10">
              <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <TrendingUp size={20} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Attendance</p>
              <h3 className="text-2xl font-black text-gray-900">{stats.avgAttendance}%</h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Main Chart */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                 <Target size={24} className="text-indigo-600" />
                 Behavioral Drift Analysis
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time isolation forest stream</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-gray-500 uppercase">Live Feed</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_ANOMALIES}>
                <defs>
                  <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 800}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 800}} 
                  dx={-10} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderRadius: '24px', border: 'none', color: '#fff', padding: '16px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="anomalies" 
                  stroke="#4F46E5" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorAnomalies)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictive Card */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-black p-10 rounded-[3.5rem] shadow-2xl h-full flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                       <Zap size={24} />
                    </div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">AI Forecast Engine</span>
                 </div>
                 <h4 className="text-3xl font-black text-white mb-4 italic" style={{ fontFamily: "'Instrument Serif', serif" }}>
                    Attendance Predictor
                 </h4>
                 <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    Based on current engagement metrics, we anticipate a **15% increase** in anomalies for the upcoming lab sessions.
                 </p>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all">
                       <span className="text-xs font-bold text-gray-300">Predictive Confidence</span>
                       <span className="text-xs font-black text-indigo-400">92.4%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all">
                       <span className="text-xs font-bold text-gray-300">Suggested Action</span>
                       <span className="text-[10px] font-black text-amber-500 uppercase">Proactive Alert</span>
                    </div>
                 </div>
              </div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full translate-x-1/2 translate-y-1/2 blur-[100px]" />
           </div>
        </div>
      </div>
    </div>
  );
};
