import React from 'react';
import { AlertsModule } from '../../modules/dashboard/AlertsModule';

const AlertsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Alerts
          </h1>
          <p className="text-gray-500 text-sm mt-1">Flagged behavioral anomalies requiring immediate attention.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
            Resolve All
          </button>
        </div>
      </div>
      <AlertsModule />
    </div>
  );
};

export default AlertsPage;
