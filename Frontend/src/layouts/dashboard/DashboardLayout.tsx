import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';
import { Loader } from '../../components/dashboard/Loader';
import { Toaster } from 'sonner';

export const DashboardLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Toaster position="top-right" richColors />
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-[60] lg:relative transition-transform duration-300 lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
      </div>

      <div className="flex-grow flex flex-col min-w-0">
        <DashboardNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="p-4 sm:p-8 flex-grow overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Add cn import if missing or just use template literals if preferred, but cn is in lib/utils
import { cn } from '../../lib/utils';
