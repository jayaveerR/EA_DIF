import React, { useState, useEffect } from 'react';
import { AlertTriangle, Eye, MoreVertical, Search, Filter, ArrowUpRight, RefreshCw } from 'lucide-react';
import { Modal } from '../../components/dashboard/Modal';
import { Skeleton } from '../../components/dashboard/Skeleton';
import { toast } from 'sonner';
import { Alert, apiService } from '../../services/apiService';
import { downloadCSV } from '../../lib/exportUtils';

export const AlertsModule: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  useEffect(() => {
    // Initial fetch or search reset
    const fetchData = async () => {
      setLoading(true);
      const fetched = await apiService.getAlerts(searchTerm, 1);
      setAlerts(fetched);
      setPage(1);
      setHasMore(fetched.length === 100);
      setLoading(false);
    };
    
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadMore = async () => {
    if (fetchingMore || !hasMore) return;
    setFetchingMore(true);
    const nextPage = page + 1;
    const moreAlerts = await apiService.getAlerts(searchTerm, nextPage);
    
    if (moreAlerts.length > 0) {
      setAlerts(prev => [...prev, ...moreAlerts]);
      setPage(nextPage);
      setHasMore(moreAlerts.length === 100);
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

  const handleExport = () => {
    downloadCSV(alerts, `ea-dif-alerts-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Exporting started', { description: 'Your alert logs are being downloaded.' });
  };

  const handleClear = async () => {
    if (window.confirm("Are you sure you want to delete ALL alerts?")) {
      await apiService.clearAlerts();
      toast.success('Logs Cleared', { description: 'All risk alerts have been purged from the database.' });
    }
  };

  const filteredAlerts = alerts;

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="p-8 space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search alerts by ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
          />
        </div>
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-100 transition-all shadow-sm"
          >
            Clear All
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Export Logs
          </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div 
          onScroll={handleScroll}
          className="overflow-x-auto h-[600px] overflow-y-auto custom-scrollbar"
        >
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em]">
                <th className="px-8 py-5">Student Identity</th>
                <th className="px-8 py-5">Risk Matrix</th>
                <th className="px-8 py-5">Behavioral Reason</th>
                <th className="px-8 py-5">Detected</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAlerts.map((alert) => (
                <tr 
                  key={alert._id || alert.student_id} 
                  className="hover:bg-indigo-50/30 transition-all group cursor-pointer"
                  onClick={() => setSelectedAlert(alert)}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {alert.student_id.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{alert.student_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={
                        `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          alert.status === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`
                      }>
                        {alert.status}
                      </div>
                      <span className="text-sm font-black text-gray-900">{alert.risk_score}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-medium text-gray-500 max-w-xs leading-relaxed">{alert.reason}</p>
                  </td>
                  <td className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {alert.timestamp instanceof Date ? alert.timestamp.toLocaleString() : new Date(alert.timestamp).toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 text-gray-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-indigo-100">
                        <Eye size={18} />
                      </button>
                      <button className="p-2.5 text-gray-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-indigo-100">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {fetchingMore && (
            <div className="py-8 flex flex-col items-center justify-center gap-3 border-t border-gray-50">
              <RefreshCw className="text-indigo-600 animate-spin" size={24} />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading More Risks...</p>
            </div>
          )}

          {!hasMore && filteredAlerts.length > 0 && (
            <div className="py-8 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest border-t border-gray-50">
              Risk Log Complete
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title="Alert Intelligence Detail"
      >
        {selectedAlert && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedAlert.student_id.charAt(0)}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedAlert.student_id}</h4>
                  <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Risk Detected</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Risk Score</p>
                <p className={`text-4xl font-black ${selectedAlert.status === 'High' ? 'text-red-600' : 'text-amber-600'}`}>
                  {selectedAlert.risk_score}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">SHAP Explanation Highlights</h5>
                <ul className="space-y-3">
                  {[
                    "Drastic change in interaction frequency (-45%)",
                    "Unexpected late-night system access (2AM - 4AM)",
                    "Sentiment drop in collaborative posts (Detected negative tone)"
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-600">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Action Pipeline</h5>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-all border border-indigo-100">
                    Notify Academic Counselor
                    <ArrowUpRight size={14} />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-gray-50 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-all border border-gray-100">
                    Schedule Student Interview
                    <ArrowUpRight size={14} />
                  </button>
                  <button className="w-full flex items-center justify-center p-3 rounded-2xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                    Escalate to Emergency
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-600 rounded-3xl overflow-hidden relative">
              <div className="relative z-10 text-white">
                <h5 className="text-lg font-bold mb-2">Internal Notes</h5>
                <p className="text-indigo-100 text-sm leading-relaxed opacity-80">
                  Student has been flagged for 3 consecutive days. Behavioral patterns indicate potential academic stress or external burnout factor. Early intervention recommended.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-2xl" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
