import React from 'react';
import { StudentsModule } from '../../modules/dashboard/StudentsModule';

const StudentsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Students
          </h1>
          <p className="text-gray-500 text-sm mt-1">Comprehensive list of all monitored students and their behavioral profiles.</p>
        </div>
      
      </div>
      <StudentsModule />
    </div>
  );
};

export default StudentsPage;
