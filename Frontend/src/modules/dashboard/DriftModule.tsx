import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, RefreshCw, CheckCircle2, History, TrendingDown, Target, BrainCircuit } from 'lucide-react';
import { apiService, DriftLog } from '../../services/apiService';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export const DriftModule: React.FC = () => {
  const [logs, setLogs] = useState<DriftLog[]>([]);
  const [isRetraining, setIsRetraining] = useState(false);
  const [status, setStatus] = useState('Healthy');

  useEffect(() => {
    const unsubscribe = apiService.subscribeToDriftLogs((newLogs) => {
      setLogs(newLogs);
      // Simulate healthy status if accuracy > 95
      if (newLogs[0]?.accuracy > 95) setStatus('Healthy');
      else setStatus('Drift Detected');
    });
    return () => unsubscribe();
  }, []);

  const handleRetrain = async () => {
    setIsRetraining(true);
    toast.loading('Initializing ML Compute Engine...');
    
    try {
      await apiService.triggerRetraining();
      toast.success('Model Optimization Complete', { description: 'Weight matrices synchronized and updated.' });
    } catch (err) {
      toast.error('Retraining Failed');
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Card */}
        <div className="lg:col-span-2 bg-black p-10 rounded-[3rem] text-white relative overflow-hidden group">
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                       <BrainCircuit size={28} />
                    </div>
                    <span className={cn(
                      "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      status === 'Healthy' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                    )}>
                      System {status}
                    </span>
                 </div>
                 <h2 className="text-3xl font-black mb-4 italic" style={{ fontFamily: "'Instrument Serif', serif" }}>
                    Advanced Concept Drift Monitor
                 </h2>
                 <p className="text-gray-400 text-sm max-w-lg mb-8">
                    Tracking statistical deviations in incoming student behavior data. Current entropy remains within acceptable operational boundaries.
                 </p>
              </div>
              <div className="flex gap-4">
                 <button 
                   disabled={isRetraining}
                   onClick={handleRetrain}
                   className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                 >
                    {isRetraining ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    Retrain Model
                 </button>
                 <button className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">
                    View Specs
                 </button>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-20" />
        </div>

        {/* Real-time accuracy metrics */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 flex flex-col justify-center items-center text-center">
            <Target size={48} className="text-indigo-600 mb-6" />
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Operational Precision</h3>
            <p className="text-5xl font-black text-gray-900 mb-2">97.4%</p>
            <p className="text-xs font-bold text-green-600">+0.2% Gain from last cycle</p>
        </div>
      </div>

      {/* Drift History Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <History size={18} className="text-gray-400" />
            Anomaly History Logs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Model Version</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Accuracy Status</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Action Taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 text-sm font-bold text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-8 py-6 text-xs font-black text-indigo-600 uppercase">v2.4.0-release</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-bold text-gray-900">{log.accuracy}% Accuracy</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="px-3 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 rounded-full">Automated Sync</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
