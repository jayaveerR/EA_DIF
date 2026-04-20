import React from 'react';
import { BarChart3, PieChart, Target, Zap, CheckCircle2, TrendingUp } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { PERFORMANCE_METRICS } from '../../lib/mock-data';

const confusionMatrix = [
  { name: 'True Pos', value: 42, color: '#10B981' },
  { name: 'True Neg', value: 51, color: '#4F46E5' },
  { name: 'False Pos', value: 3, color: '#F59E0B' },
  { name: 'False Neg', value: 4, color: '#EF4444' },
];

export const PerformanceModule: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Accuracy', value: '98.4%', icon: <Target size={20} />, color: 'text-brand-primary', bg: 'bg-indigo-50' },
          { label: 'Precision', value: '96.2%', icon: <CheckCircle2 size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Recall', value: '94.8%', icon: <Zap size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'F1 Score', value: '95.5%', icon: <TrendingUp size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((m, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
            <div className={`w-12 h-12 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
              {m.icon}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{m.label}</p>
            <h3 className="text-4xl font-black text-gray-900 font-mono tracking-tighter tabular-nums">{m.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Model Performance Metrics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={PERFORMANCE_METRICS}>
                <PolarGrid stroke="#F3F4F6" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#9CA3AF', fontSize: 12}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                <Radar
                  name="EA-DIF Model"
                  dataKey="A"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Confusion Matrix Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confusionMatrix} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                  {confusionMatrix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {confusionMatrix.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-bold text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900">ROC Curve Analysis</h3>
          <button className="text-sm text-indigo-600 font-bold hover:underline">Download Detailed Report</button>
        </div>
        <div className="h-64 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border border-gray-100">
          <BarChart3 size={40} className="text-indigo-200 mb-4" />
          <p className="text-sm text-gray-500 font-bold">AUC-ROC Curve Data Verified</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs text-center">Stability at 97.1%. Historical logs confirm consistent performance across all cohorts.</p>
        </div>
      </div>
    </div>
  );
};
