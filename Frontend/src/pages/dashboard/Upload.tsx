import React from 'react';
import { UploadModule } from '../../modules/dashboard/UploadModule';

const UploadPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Upload Data
          </h1>
          <p className="text-gray-500 text-sm mt-1">Import behavioral datasets for model analysis and retraining.</p>
        </div>
      </div>
      <UploadModule />
    </div>
  );
};

export default UploadPage;
