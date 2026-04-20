import React from 'react';
import { PerformanceModule } from '../../modules/dashboard/PerformanceModule';

const PerformancePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Model Performance
          </h1>
          <p className="text-gray-500 text-sm mt-1">Detailed metrics and evaluation of the EA-DIF behavioral model.</p>
        </div>
      </div>
      <PerformanceModule />
    </div>
  );
};

export default PerformancePage;
