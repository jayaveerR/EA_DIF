import React, { useState } from 'react';
import { Bell, Search, User, Settings, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface DashboardNavbarProps {
  onMenuClick?: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    toast.success('Logged out successfully');
    logout();
  };

  return (
    <header className="h-[88px] bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-2xl transition-all lg:hidden"
        >
          <Menu size={22} />
        </button>
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Intelligence Search... (⌘K)"
            className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-2xl transition-all relative group"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-6 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold text-gray-900">Intelligence Alerts</h4>
                    <span className="text-[10px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full uppercase">3 New</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { id: 1, title: 'High Anomaly Detected', desc: 'Student S1024 showing unusual patterns.', time: '2m ago' },
                      { id: 2, title: 'Model Drift Warning', desc: 'System accuracy dropped below 98%.', time: '1h ago' },
                    ].map(n => (
                      <div key={n.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:border-indigo-100 transition-all cursor-pointer">
                        <p className="text-sm font-bold text-gray-900 mb-1">{n.title}</p>
                        <p className="text-[11px] text-gray-500 mb-2 leading-relaxed">{n.desc}</p>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
                    Clear All Notifications
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-gray-100" />

        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-4 hover:bg-gray-50 p-2 pr-4 rounded-3xl transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-bold text-gray-900 tracking-tight">{user?.displayName || 'Admin Console'}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Superuser</p>
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-3 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-50 mb-2">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Authenticated As</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <NavLink
                      to="/dashboard/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all"
                    >
                      <User size={18} />
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/dashboard/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all"
                    >
                      <Settings size={18} />
                      System Settings
                    </NavLink>
                    <div className="h-px bg-gray-50 my-2 mx-4" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <LogOut size={18} />
                      Terminate Session
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
