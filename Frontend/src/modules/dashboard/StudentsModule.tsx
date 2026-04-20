import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, MapPin, Calendar, Activity, ChevronRight, Users, Info, BrainCircuit, Zap, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { Skeleton } from '../../components/dashboard/Skeleton';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Student, Prediction, apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { downloadCSV } from '../../lib/exportUtils';
import { Modal } from '../../components/dashboard/Modal';

export const StudentsModule: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'insights'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIntervening, setIsIntervening] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    student_id: '',
    weekly_self_study_hours: 0,
    attendance_percentage: 0,
    class_participation: 0,
    total_score: 0,
    grade: 'A'
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  useEffect(() => {
    // Initial fetch or search reset
    const fetchData = async () => {
      setLoading(true);
      const fetched = await apiService.getStudents(searchTerm, 1);
      setStudents(fetched);
      setPage(1);
      setHasMore(fetched.length === 100);
      setLoading(false);
      if (fetched.length > 0 && !selectedStudent) setSelectedStudent(fetched[0]);
    };
    
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    // Live Pulse of Predictions
    const unsubscribe = apiService.subscribeToPredictions((preds) => {
      setPredictions(preds);
    });
    return () => unsubscribe();
  }, []);

  const loadMore = async () => {
    if (fetchingMore || !hasMore) return;
    setFetchingMore(true);
    const nextPage = page + 1;
    const moreStudents = await apiService.getStudents(searchTerm, nextPage);
    
    if (moreStudents.length > 0) {
      setStudents(prev => [...prev, ...moreStudents]);
      setPage(nextPage);
      setHasMore(moreStudents.length === 100);
    } else {
      setHasMore(false);
    }
    setFetchingMore(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      loadMore();
    }
  };

  const filteredStudents = students;

  const getStudentPrediction = (sid: string) => {
    return predictions.find(p => p.student_id === sid);
  };

  const handleIntervene = async (type: string) => {
    if (!selectedStudent || !user) return;
    setIsIntervening(true);
    try {
      const res = await apiService.interveneStudent(selectedStudent.student_id, type, { 
        name: user.name || 'Admin', 
        email: user.email 
      });
      if (res.success) {
        toast.success(`Intervention Sent: ${type}`, { 
          description: `Action logged for ${selectedStudent.student_id}` 
        });
      }
    } catch (err) {
      toast.error('Intervention Failed');
    } finally {
      setIsIntervening(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiService.addStudent(newStudent as Student);
      if (res.success) {
        toast.success('Student Added', { description: `${newStudent.student_id} has been manually enrolled.` });
        setIsAddModalOpen(false);
      } else {
        toast.error('Add Failed', { description: res.message });
      }
    } catch (err) {
      toast.error('Error', { description: 'Connection failed.' });
    }
  };

  const handleExportProfile = () => {
    if (!selectedStudent) return;
    downloadCSV([selectedStudent], `student-${selectedStudent.student_id}-profile.csv`);
    toast.success('Exporting started');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="h-[600px] rounded-3xl" />
        <Skeleton className="lg:col-span-2 h-[600px] rounded-3xl" />
      </div>
    );
  }

  const currentPred = selectedStudent ? getStudentPrediction(selectedStudent.student_id) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sidebar List */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[700px]">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Find any Student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-sm font-bold"
              />
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-black/10 shrink-0 text-[10px] font-black uppercase tracking-widest"
            >
              <Users size={16} />
              Add Student
            </button>
          </div>

          <div 
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto custom-scrollbar p-1"
          >
            <div className="space-y-2">
              {filteredStudents.map((student) => {
                const pred = getStudentPrediction(student.student_id);
                return (
                  <button
                    key={student._id || student.student_id}
                    onClick={() => setSelectedStudent(student)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all border group",
                      selectedStudent?.student_id === student.student_id 
                        ? 'bg-black border-black text-white shadow-lg shadow-black/10' 
                        : 'bg-white border-transparent hover:bg-gray-50 text-gray-600'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm uppercase transition-colors",
                        selectedStudent?.student_id === student.student_id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                      )}>
                        {student.student_id.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className={cn("text-sm font-bold truncate max-w-[120px]", selectedStudent?.student_id === student.student_id ? 'text-white' : 'text-gray-900')}>
                          {student.student_id}
                        </p>
                        <p className={cn("text-[10px] font-bold tracking-widest uppercase", selectedStudent?.student_id === student.student_id ? 'text-gray-400' : 'text-gray-400')}>
                          Risk: {pred?.risk_score || '??'}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {pred?.anomaly_flag && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                      <ChevronRight size={16} className={selectedStudent?.student_id === student.student_id ? 'text-white' : 'text-gray-300'} />
                    </div>
                  </button>
                );
              })}

              {fetchingMore && (
                <div className="py-6 flex flex-col items-center justify-center gap-2 animate-in fade-in">
                  <RefreshCw className="text-indigo-600 animate-spin" size={20} />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fetching more...</p>
                </div>
              )}

              {!hasMore && filteredStudents.length > 0 && (
                <div className="py-6 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  Maximum Records Loaded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Detail */}
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {selectedStudent ? (
            <motion.div 
              key={selectedStudent._id || selectedStudent.student_id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[700px] flex flex-col"
            >
              <div className="p-8 bg-[#F9FAFB] border-b border-gray-100">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-[2.5rem] bg-black flex items-center justify-center text-white font-black text-4xl uppercase shadow-2xl shadow-black/10">
                      {selectedStudent.student_id.charAt(0)}
                    </div>
                    {currentPred?.anomaly_flag && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white border-4 border-white">
                        <Zap size={14} fill="white" />
                      </div>
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      {selectedStudent.student_id}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile: {selectedStudent.grade} Grade</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                         <ShieldCheck size={12} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Verified Anomaly Score: {currentPred?.risk_score || 0}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:ml-auto text-center md:text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Predictive Risk</p>
                    <p className={cn(
                      "text-3xl font-black",
                      (currentPred?.risk_score || 0) > 70 ? 'text-red-600' : 'text-gray-900'
                    )}>
                      {currentPred?.risk_score || '0'}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-8 pt-6">
                 <div className="flex items-center gap-8 border-b border-gray-100">
                    {[
                      { id: 'overview', label: 'Performance Metrics', icon: <Info size={16} /> },
                      { id: 'insights', label: 'AI Intelligence Hub', icon: <BrainCircuit size={16} /> },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          "flex items-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
                          activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                        )}
                      >
                        {tab.icon}
                        {tab.label}
                        {activeTab === tab.id && (
                          <motion.div layoutId="activeTabProp" className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full" />
                        )}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="p-8 flex-grow">
                 {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-300">
                       <div className="space-y-10">
                          <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-l-4 border-indigo-600 pl-3">Raw Metrics</h3>
                            <div className="space-y-6">
                              <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                  <Calendar size={20} />
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-end mb-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Self Study Hours</p>
                                    <p className="text-sm font-black text-gray-900">{selectedStudent.weekly_self_study_hours}h</p>
                                  </div>
                                  <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                     <div className="h-full bg-indigo-600" style={{ width: `${(selectedStudent.weekly_self_study_hours/20)*100}%` }} />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                  <Activity size={20} />
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-end mb-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Attendance</p>
                                    <p className="text-sm font-black text-gray-900">{selectedStudent.attendance_percentage}%</p>
                                  </div>
                                  <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                     <div className="h-full bg-amber-500" style={{ width: `${selectedStudent.attendance_percentage}%` }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                       </div>
                       
                        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                           <div className="relative z-10">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Engagement Index</h4>
                                <span className={cn(
                                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                  selectedStudent.class_participation > 80 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                )}>
                                  Rank: Top {Math.max(1, 100 - selectedStudent.class_participation)}%
                                </span>
                              </div>
                              <p className="text-3xl font-black text-gray-900 mb-4">{selectedStudent.class_participation}%</p>
                              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                 <Info size={14} className="text-indigo-600 shrink-0" />
                                 <p className="text-[9px] font-bold text-gray-500 leading-tight">
                                    Student is performing {selectedStudent.class_participation > 70 ? 'optimal behavior' : 'below standard engagement'}.
                                 </p>
                              </div>
                           </div>
                           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-12 -translate-y-12 blur-3xl opacity-50 group-hover:scale-150 transition-all duration-700" />
                        </div>
                    </div>
                 )}

                 {activeTab === 'insights' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                       <div className="bg-black p-10 rounded-[3rem] text-white relative overflow-hidden">
                          <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                               <BrainCircuit size={28} className="text-indigo-400" />
                               Executive Summary
                            </h3>
                            <div className="space-y-6">
                               <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                  <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-4">Behavioral Root Causes (SHAP Factors)</p>
                                  <div className="space-y-3">
                                     {currentPred?.reason ? currentPred.reason.split(', ').map((r, i) => (
                                       <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                          <span className="text-sm font-bold text-gray-200">{r}</span>
                                       </div>
                                     )) : (
                                       <p className="text-gray-400 text-sm italic">Stable metrics detected. No anomalous factors found.</p>
                                     )}
                                  </div>
                               </div>
                               <div className="flex items-center gap-4 text-white/30">
                                 <ShieldCheck size={20} />
                                 <p className="text-[10px] font-bold uppercase tracking-widest">Model Accuracy: 97.4% | Verified by EA-DIF System</p>
                               </div>
                            </div>
                          </div>
                          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full translate-x-1/2 -translate-y-1/2 blur-[80px] opacity-20" />
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-8 border-t border-gray-50 bg-[#F9FAFB] flex flex-wrap gap-4">
                 <button 
                   disabled={isIntervening}
                   onClick={() => handleIntervene('WARNING')}
                   className="flex-1 min-w-[160px] py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                 >
                    {isIntervening ? 'Sending...' : 'Issue Smart Warning'}
                 </button>
                 <button 
                   onClick={handleExportProfile}
                   className="flex-1 min-w-[160px] py-4 border border-gray-200 bg-white text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                 >
                    Export Intel
                 </button>
                 <button 
                   disabled={isIntervening}
                   onClick={() => handleIntervene('COUNSELING')}
                   className="flex-1 min-w-[160px] py-4 border border-red-100 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-100 transition-all disabled:opacity-50"
                 >
                    Request Counseling
                 </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[700px] bg-white rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 mb-8 border border-gray-100">
                <Users size={40} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>Behavioral Hub</h3>
              <p className="text-gray-400 max-w-sm font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                Select a student profile from the left directory to generate SHAP-based intelligent behavioral analysis.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Student Manual Enrollment"
      >
        <form onSubmit={handleAddStudent} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Student ID</label>
              <input
                required
                type="text"
                placeholder="e.g. S1082"
                onChange={(e) => setNewStudent({...newStudent, student_id: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-sm font-black uppercase"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Grade Level</label>
              <select
                onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-sm font-black"
              >
                <option value="A">Grade A (Optimal)</option>
                <option value="B">Grade B (Good)</option>
                <option value="C">Grade C (Average)</option>
                <option value="D">Grade D (At Risk)</option>
                <option value="F">Grade F (Failing)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Attendance %</label>
               <input
                 type="number"
                 placeholder="0-100"
                 onChange={(e) => setNewStudent({...newStudent, attendance_percentage: parseFloat(e.target.value) || 0})}
                 className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-4 focus:ring-black/5 transition-all text-xs font-bold"
               />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Participation %</label>
               <input
                 type="number"
                 placeholder="0-100"
                 onChange={(e) => setNewStudent({...newStudent, class_participation: parseFloat(e.target.value) || 0})}
                 className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-4 focus:ring-black/5 transition-all text-xs font-bold"
               />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Study Hours</label>
               <input
                 type="number"
                 placeholder="Weekly"
                 onChange={(e) => setNewStudent({...newStudent, weekly_self_study_hours: parseFloat(e.target.value) || 0})}
                 className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-4 focus:ring-black/5 transition-all text-xs font-bold"
               />
             </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-2xl shadow-black/20"
          >
            Authenticate Enrollment
          </button>
        </form>
      </Modal>
    </div>
  );
};
