import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudentPortal } from './modules/student/StudentPortal';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Features from './pages/Features';
import Contact from './pages/Contact';

// Dashboard Imports
import { DashboardLayout } from './layouts/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Alerts from './pages/dashboard/Alerts';
import Students from './pages/dashboard/Students';
import Upload from './pages/dashboard/Upload';
import Drift from './pages/dashboard/Drift';
import Performance from './pages/dashboard/Performance';
import Settings from './pages/dashboard/Settings';

const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white font-black text-xs uppercase tracking-widest text-[#4F46E5] animate-pulse">
        Initializing Intelligence...
      </div>
    );
  }

  // Redirect Logic: If logged in but at root, or accessing /dashboard
  // Admin -> DashboardLayout (Full Sidebar)
  // Student (has student_id) -> StudentPortal (Standalone)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isDashboard && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />

          {/* PROTECTED DASHBOARD ROUTES */}
          <Route 
            path="/dashboard" 
            element={
              !user ? <Navigate to="/" replace /> : 
              (user.student_id ? <StudentPortal /> : <DashboardLayout />)
            }
          >
            {/* Child routes only render for Admin via DashboardLayout's Outlet */}
            {!user?.student_id && (
              <>
                <Route index element={<Dashboard />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="students" element={<Students />} />
                <Route path="upload" element={<Upload />} />
                <Route path="drift" element={<Drift />} />
                <Route path="performance" element={<Performance />} />
                <Route path="settings" element={<Settings />} />
              </>
            )}
          </Route>

          {/* Catch-all redirects */}
          <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
