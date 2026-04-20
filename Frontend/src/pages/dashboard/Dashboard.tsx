import React from 'react';
import { DashboardOverview } from '../../modules/dashboard/DashboardOverview';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">Real-time behavioral monitoring and anomaly detection summary.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Updated:</span>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Just Now</span>
        </div>
      </div>
      <DashboardOverview />
    </div>
  );
};

export default DashboardPage;
