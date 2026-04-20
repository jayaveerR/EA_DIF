import React from 'react';
import { SettingsModule } from '../../modules/dashboard/SettingsModule';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Account Settings
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
          Manage your administrative profile and system preferences
        </p>
      </div>

      <SettingsModule />
    </div>
  );
};

export default SettingsPage;
