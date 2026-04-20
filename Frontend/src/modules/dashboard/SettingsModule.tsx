import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Cpu, 
  History, 
  Clock, 
  Monitor, 
  Zap, 
  Database,
  Lock,
  Mail,
  ToggleRight,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService, AuditLog } from '../../services/apiService';
import { cn } from '../../lib/utils';
import { Skeleton } from '../../components/dashboard/Skeleton';
import { toast } from 'sonner';

export const SettingsModule: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile Information');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  
  // Local Settings State
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      riskWarning: true,
      weeklyReport: false,
      driftAlert: true
    },
    system: {
      highPrecisionMode: true,
      autoIntervene: false,
      backupFrequency: 'Daily'
    }
  });

  useEffect(() => {
    if (activeTab === 'Audit Logs') {
      setLoadingLogs(true);
      const unsubscribe = apiService.subscribeToAuditLogs((logs) => {
        setAuditLogs(logs);
        setLoadingLogs(false);
      });
      return () => unsubscribe();
    }
  }, [activeTab]);

  const handleToggle = (category: 'notifications' | 'system', setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof typeof prev.notifications]
      }
    }));
    toast.success('Preference Updated', { description: `${setting} change has been synchronized.` });
  };

  const sections = [
    { name: 'Profile Information', icon: <User size={20} /> },
    { name: 'Notifications', icon: <Bell size={20} /> },
    { name: 'Security & Privacy', icon: <Lock size={20} /> },
    { name: 'System Settings', icon: <LayoutDashboard size={20} /> },
    { name: 'Audit Logs', icon: <History size={20} /> },
  ];

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden min-h-[650px]">
        <div className="flex flex-col md:flex-row h-full min-h-[650px]">
          {/* Sidebar */}
          <div className="w-full md:w-72 bg-gray-50/50 border-r border-gray-100 p-8 space-y-3">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-4">Preference Hub</p>
            {sections.map(section => (
              <button
                key={section.name}
                onClick={() => setActiveTab(section.name)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-3xl text-sm font-bold transition-all group",
                  activeTab === section.name 
                    ? 'bg-black text-white shadow-2xl shadow-black/20' 
                    : 'text-gray-500 hover:bg-white hover:text-black'
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-colors",
                  activeTab === section.name ? 'text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-black group-hover:text-white'
                )}>
                   {React.cloneElement(section.icon as React.ReactElement<any>, { size: 18 })}
                </div>
                {section.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-grow p-10 md:p-14 overflow-auto max-h-[750px]">
            
            {/* 1. Profile Information */}
            {activeTab === 'Profile Information' && (
              <div className="space-y-12 animate-in fade-in duration-300">
                <div className="flex items-center gap-10">
                   <div className="w-32 h-32 rounded-[3.5rem] bg-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-100 italic">
                      {user?.name?.charAt(0) || user?.email?.charAt(0)}
                   </div>
                   <div>
                      <h3 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                         {user?.name || 'Administrator'}
                      </h3>
                      <p className="text-sm font-bold text-gray-400 mb-4">{user?.email}</p>
                      <div className="flex gap-3">
                         <span className="px-5 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl">Verified Identity</span>
                         <span className="px-5 py-2 border border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-2xl">Full Access</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Display Name</label>
                      <input type="text" defaultValue={user?.name} className="w-full px-6 py-5 bg-gray-50 rounded-[1.5rem] focus:ring-4 focus:ring-black/5 outline-none font-bold text-gray-700 border-2 border-transparent focus:border-gray-100 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Institutional Email</label>
                      <input type="email" value={user?.email} disabled className="w-full px-6 py-5 bg-gray-100 rounded-[1.5rem] text-gray-400 font-bold cursor-not-allowed" />
                   </div>
                </div>

                <div className="pt-10 border-t border-gray-50">
                    <button className="px-12 py-5 bg-black text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 transition-all shadow-2xl shadow-black/20">
                       Update Intelligence Profile
                    </button>
                </div>
              </div>
            )}

            {/* 2. Notifications */}
            {activeTab === 'Notifications' && (
              <div className="space-y-10 animate-in fade-in duration-300">
                 <h3 className="text-3xl font-black text-gray-900 italic" style={{ fontFamily: "'Instrument Serif', serif" }}>Notification Strategies</h3>
                 <div className="space-y-4">
                    {[
                      { id: 'emailAlerts', label: 'Email Security Alerts', desc: 'Notify on unauthorized login attempts' },
                      { id: 'riskWarning', label: 'Instant Risk Warnings', desc: 'Push notifications when student risk score > 80%' },
                      { id: 'weeklyReport', label: 'Automated Weekly Reports', desc: 'Analytical summaries delivered every Monday' },
                      { id: 'driftAlert', label: 'Model Drift Alerts', desc: 'Notify if system accuracy drops below 95%' }
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between p-7 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all group">
                         <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               <Bell size={20} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-gray-900">{item.label}</p>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">{item.desc}</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => handleToggle('notifications', item.id)}
                           className={cn(
                             "w-12 h-6 rounded-full transition-all relative",
                             settings.notifications[item.id as keyof typeof settings.notifications] ? 'bg-indigo-600' : 'bg-gray-200'
                           )}
                         >
                            <div className={cn(
                              "w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm",
                              settings.notifications[item.id as keyof typeof settings.notifications] ? 'right-1' : 'left-1'
                            )} />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* 3. Security & Privacy */}
            {activeTab === 'Security & Privacy' && (
              <div className="space-y-12 animate-in fade-in duration-300 text-center py-10">
                 <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-50">
                    <ShieldCheck size={48} />
                 </div>
                 <div className="max-w-md mx-auto space-y-4">
                    <h3 className="text-3xl font-black text-gray-900 italic" style={{ fontFamily: "'Instrument Serif', serif" }}>Secure Infrastructure</h3>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest leading-relaxed">System-wide encryption and multi-factor authentication are currently optimizing your workspace.</p>
                 </div>
                 <div className="pt-8 flex flex-col gap-4 max-w-sm mx-auto">
                    <button className="w-full py-5 bg-black text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px]">Reset Security Credentials</button>
                    <button className="w-full py-5 border border-gray-100 text-gray-600 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px]">Audit Security Protocol</button>
                 </div>
              </div>
            )}

            {/* 4. System Settings */}
            {activeTab === 'System Settings' && (
              <div className="space-y-10 animate-in fade-in duration-300">
                 <h3 className="text-3xl font-black text-gray-900 italic" style={{ fontFamily: "'Instrument Serif', serif" }}>Environment Configuration</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between group hover:bg-black transition-all duration-500">
                       <Zap className="text-indigo-600 group-hover:text-white mb-8" size={32} />
                       <div>
                          <p className="text-sm font-black text-gray-900 group-hover:text-white">High Precision Mode</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-white/50 mt-1">Deep analysis on every data seed</p>
                       </div>
                       <button 
                         onClick={() => handleToggle('system', 'highPrecisionMode')}
                         className={cn(
                           "mt-6 py-2 px-6 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                           settings.system.highPrecisionMode ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-400'
                         )}
                       >
                          {settings.system.highPrecisionMode ? 'Active' : 'Disabled'}
                       </button>
                    </div>

                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between group hover:bg-black transition-all duration-500">
                       <Database className="text-emerald-600 group-hover:text-white mb-8" size={32} />
                       <div>
                          <p className="text-sm font-black text-gray-900 group-hover:text-white">Backup Frequency</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-white/50 mt-1">Last backup: 4h ago</p>
                       </div>
                       <div className="mt-6 flex gap-2">
                          {['Daily', 'Weekly'].map(freq => (
                            <button 
                              key={freq}
                              onClick={() => setSettings(p => ({...p, system: {...p.system, backupFrequency: freq}}))}
                              className={cn(
                                "flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                settings.system.backupFrequency === freq ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-100 text-gray-400'
                              )}
                            >
                               {freq}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* 5. Audit Logs */}
            {activeTab === 'Audit Logs' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-gray-900 italic" style={{ fontFamily: "'Instrument Serif', serif" }}>Intelligence Stream</h3>
                  <div className="flex items-center gap-3 px-4 py-2 bg-green-50 text-green-600 rounded-2xl border border-green-100">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Logs Live</span>
                  </div>
                </div>

                {loadingLogs ? (
                  <div className="space-y-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-[2rem]" />)}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {auditLogs.length > 0 ? auditLogs.slice(0, 10).map((log) => (
                      <div key={log._id} className="p-7 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group relative overflow-hidden">
                         <div className="relative z-10 flex items-start justify-between">
                            <div className="flex items-start gap-5">
                               <div className="p-4 bg-gray-50 rounded-2xl text-indigo-600 group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                                  <Clock size={20} />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-gray-900 uppercase tracking-widest">{log.action}</p>
                                  <p className="text-xs text-gray-400 font-bold mt-1 line-clamp-1">{log.details}</p>
                                  <div className="flex items-center gap-5 mt-4">
                                     <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-full">
                                        <User size={12} strokeWidth={3} /> {log.adminName}
                                     </span>
                                     <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.1em] flex items-center gap-1.5">
                                        <Monitor size={12} /> {new Date(log.timestamp).toLocaleTimeString()}
                                     </span>
                                  </div>
                               </div>
                            </div>
                            <div className="hidden sm:block text-right">
                               <span className="px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronized</span>
                            </div>
                         </div>
                         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-12 -translate-y-12 blur-3xl opacity-30 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )) : (
                      <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                         <History className="mx-auto text-gray-300 mb-6" size={64} />
                         <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Awaiting System Events...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
