import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Users, 
  UploadCloud, 
  Activity, 
  BarChart3, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { logout } = useAuth();
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { name: 'Alerts', icon: <AlertTriangle size={20} />, href: '/dashboard/alerts' },
    { name: 'Students', icon: <Users size={20} />, href: '/dashboard/students' },
    { name: 'Upload Data', icon: <UploadCloud size={20} />, href: '/dashboard/upload' },
    { name: 'Drift Monitor', icon: <Activity size={20} />, href: '/dashboard/drift' },
    { name: 'Performance', icon: <BarChart3 size={20} />, href: '/dashboard/performance' },
    { name: 'Settings', icon: <Settings size={20} />, href: '/dashboard/settings' },
  ];

  const handleLogout = async () => {
    toast.success('Logged out successfully');
    logout();
  };

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className="bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 z-50 overflow-hidden"
    >
      <div className="p-6 flex items-center justify-between min-h-[88px]">
        <NavLink to="/" className={cn("transition-opacity duration-300", isCollapsed ? "opacity-0 invisible" : "opacity-100")}>
          <span className="text-2xl font-bold text-indigo-600 tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
            EA-DIF<sup className="text-xs">®</sup>
          </span>
        </NavLink>
        <button 
          onClick={onToggle}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-grow px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative group",
                isActive 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <div className="shrink-0">{item.icon}</div>
            <motion.span 
              animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -10 : 0 }}
              className={cn("whitespace-nowrap", isCollapsed && "hidden")}
            >
              {item.name}
            </motion.span>
            
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all whitespace-nowrap z-50">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all group relative",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
};
