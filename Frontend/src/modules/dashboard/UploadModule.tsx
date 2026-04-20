import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { apiService } from '../../services/apiService';

export const UploadModule: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ total: 0, errors: 0 });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv' || file?.name.endsWith('.csv')) {
      processFile(file);
    } else {
      toast.error('Invalid file type', { description: 'Please upload a CSV file.' });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setFileName(file.name);
    setUploadStatus('uploading');
    setProgress(40);

    try {
      const res = await apiService.uploadCSVBuffer(file);
      setProgress(100);
      
      if (res.success) {
        setUploadStatus('success');
        setStats({ total: res.successCount || 0, errors: res.failCount || 0 });
        toast.success('Batch Processing Complete', {
          description: `Successfully synchronized ${res.successCount} student records.`
        });
        if (res.invalidRows && res.invalidRows.length > 0) {
          toast.warning(`Warning: ${res.invalidRows.length} rows were invalid and skipped.`);
        }
      } else {
        setUploadStatus('error');
        toast.error('Upload Failed', { description: res.message || 'Error occurred.' });
      }
    } catch (err: any) {
      console.error(err);
      setUploadStatus('error');
      toast.error('Transmission Failed', { description: err.message || 'Could not communicate with the backend.' });
    }
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setFileName(null);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Intelligence Intake
        </h2>
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
          Upload behavioral telemetry in CSV format to trigger real-time AI predictions
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-12 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full translate-x-32 -translate-y-32 blur-3xl" />
        
        <AnimatePresence mode="wait">
          {uploadStatus === 'idle' ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center transition-all duration-300 relative z-10 cursor-pointer",
                isDragging 
                  ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]' 
                  : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50/50'
              )}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <input 
                type="file" 
                id="fileInput" 
                className="hidden" 
                accept=".csv" 
                onChange={handleFileSelect} 
              />
              <div className="w-24 h-24 rounded-3xl bg-white border border-gray-100 shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                 <UploadCloud className="text-indigo-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Drop CSV intelligence here</h3>
              <p className="text-gray-400 font-medium mb-8">or click to browse departmental logs</p>
              
              <div className="flex gap-4">
                 <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Max 50MB
                 </div>
                 <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <Sparkles size={14} /> AI Processing
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10 relative z-10"
            >
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 truncate max-w-xs">{fileName}</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {uploadStatus === 'uploading' ? 'Transmitting Data...' : uploadStatus === 'processing' ? 'Thinking...' : 'Analysis Complete'}
                    </p>
                  </div>
                </div>
                {uploadStatus === 'success' && (
                  <button onClick={resetUpload} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <X size={24} />
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-indigo-600">
                  <span>Stream Integrity</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"
                  />
                </div>
              </div>

              {uploadStatus === 'processing' && (
                <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
                  <Loader2 className="animate-spin text-indigo-600" size={32} />
                  <p className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em]">Running EA-DIF Predictions...</p>
                </div>
              )}

              {uploadStatus === 'success' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
                  <div className="p-6 bg-green-50 rounded-3xl border border-green-100 text-center">
                    <CheckCircle2 className="mx-auto text-green-600 mb-4" size={32} />
                    <p className="text-[10px] font-black text-green-700 uppercase mb-1">Total Uploaded</p>
                    <p className="text-2xl font-black text-green-800">{stats.total}</p>
                  </div>
                  <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 text-center">
                    <AlertCircle className="mx-auto text-amber-600 mb-4" size={32} />
                    <p className="text-[10px] font-black text-amber-700 uppercase mb-1">Parse Errors</p>
                    <p className="text-2xl font-black text-amber-800">{stats.errors}</p>
                  </div>
                  <div className="p-6 bg-indigo-600 rounded-3xl text-white text-center cursor-pointer hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100" onClick={resetUpload}>
                    <p className="text-[10px] font-black opacity-60 uppercase mb-1">Actions</p>
                    <p className="text-sm font-bold">New Upload</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-indigo-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 max-w-lg">
          <h4 className="text-xl font-bold mb-2">Automated Behavioral Guard</h4>
          <p className="text-indigo-200 text-sm leading-relaxed">
            The EA-DIF system will automatically process the uploaded data against established academic baselines. Any significant deviations will be flagged for immediate review in the Alerts console.
          </p>
        </div>
        <button className="relative z-10 px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shrink-0">
           View Requirements
        </button>
      </div>
    </div>
  );
};
