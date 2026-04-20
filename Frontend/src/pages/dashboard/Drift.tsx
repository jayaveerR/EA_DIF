import React from 'react';
import { DriftModule } from '../../modules/dashboard/DriftModule';

const DriftPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Drift Monitor
          </h1>
          <p className="text-gray-500 text-sm mt-1">Monitoring data distribution shifts and model accuracy stability.</p>
        </div>
      </div>
      <DriftModule />
    </div>
  );
};

export default DriftPage;
