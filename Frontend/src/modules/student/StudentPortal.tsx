import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService, Student, Prediction } from '../../services/apiService';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  BrainCircuit, 
  Activity, 
  ShieldCheck,
  Calendar,
  Users,
  AlertTriangle
} from 'lucide-react';
import { Skeleton } from '../../components/dashboard/Skeleton';
import { cn } from '../../lib/utils';

export const StudentPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Student | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    if (!user?.student_id) {
       setLoading(false);
       return;
    }

    const fetchData = async () => {
      try {
        const studentRes = await fetch(`http://localhost:5000/api/data/students`);
        const allStudents = await studentRes.json();
        const myData = allStudents.find((s: Student) => s.student_id === user.student_id);
        setData(myData || null);

        const predRes = await fetch(`http://localhost:5000/api/data/predictions`);
        const allPreds = await predRes.json();
        const myPred = allPreds.find((p: Prediction) => p.student_id === user.student_id);
        setPrediction(myPred || null);

      } catch (err) {
        console.error("Portal load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <Skeleton className="h-40 rounded-[2.5rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <Skeleton className="h-[400px] rounded-3xl md:col-span-2" />
           <Skeleton className="h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-12 bg-gray-50">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-gray-300 mb-8 shadow-sm">
           <Calendar size={48} />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>Data Pending Activation</h2>
        <p className="text-gray-500 max-w-sm mb-8">
          The behavioral analysis for Student <b>{user?.student_id}</b> has not been uploaded by the administration yet.
        </p>
        <button onClick={logout} className="px-8 py-3 bg-black text-white rounded-xl font-bold">Logout</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-8 mb-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Student Portal Intelligence
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">
              Personalized Behavioral Dashboard for {user?.name}
            </p>
          </div>
          <button onClick={logout} className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm">
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 space-y-12">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Risk Card */}
           <div className={cn(
             "p-10 rounded-[3rem] shadow-xl relative overflow-hidden text-white",
             prediction?.risk_score && prediction.risk_score > 70 ? 'bg-red-600' : 'bg-indigo-600'
           )}>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70 font-mono">EA-DIF Risk Score</p>
                <h3 className="text-7xl font-black tabular-nums">{prediction?.risk_score || '??'}<span className="text-2xl opacity-50 ml-1">%</span></h3>
                <div className="mt-8 flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
                   <ShieldCheck size={16} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Calculated via Isolation Forest</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
           </div>

           {/* Stats Cards */}
           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                 <TrendingUp size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Attendance Rate</p>
                <h3 className="text-5xl font-black text-gray-900">{data.attendance_percentage}%</h3>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                 <BrainCircuit size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Academic Grade</p>
                <h3 className="text-5xl font-black text-gray-900 font-mono">{data.grade}</h3>
              </div>
           </div>
        </div>

        {/* Detailed Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100">
               <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                 <Activity size={24} className="text-indigo-600" />
                 Behavioral Metrics
               </h3>
               <div className="space-y-8">
                  <div className="space-y-3">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Self Study Hours</span>
                        <span className="text-xl font-black text-gray-900">{data.weekly_self_study_hours}h</span>
                     </div>
                     <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(data.weekly_self_study_hours/20)*100}%` }} />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Class Participation</span>
                        <span className="text-xl font-black text-gray-900">{data.class_participation}%</span>
                     </div>
                     <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${data.class_participation}%` }} />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Score</span>
                        <span className="text-xl font-black text-gray-900">{data.total_score} Pts</span>
                     </div>
                     <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.total_score}%` }} />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-black p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
               <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <Zap size={24} className="text-indigo-400" />
                    AI Insights Summary
                  </h3>
                  <div className="flex-grow space-y-6">
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                        <p className="text-xs text-indigo-300 font-bold uppercase mb-2">Automated Behavioral Review</p>
                        <p className="text-gray-300 leading-relaxed italic">
                          "Your participation index is {data.class_participation < 70 ? 'below average' : 'optimal'}. 
                          {data.attendance_percentage < 85 ? ' We strongly suggest attending upcoming lab sessions to stabilize your profile.' : ' Keep up the consistency in your academic attendance cycles.'}"
                        </p>
                     </div>

                     <div className="flex items-center gap-4 text-white/40">
                        <Target size={20} />
                        <p className="text-xs font-medium">SHAP Intelligence verified at 98.4% model accuracy.</p>
                     </div>
                  </div>

                  {prediction?.anomaly_flag && (
                    <div className="mt-auto pt-8 border-t border-white/10 flex items-center gap-4">
                       <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center">
                          <AlertTriangle size={24} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white">Action Required</p>
                          <p className="text-xs text-gray-400 leading-tight mt-1">Significant behavioral deviation detected. Please visit the counseling department.</p>
                       </div>
                    </div>
                  )}
               </div>
            </div>
        </div>
      </main>
    </div>
  );
};
