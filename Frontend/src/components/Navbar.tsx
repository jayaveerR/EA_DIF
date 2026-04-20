import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { LogOut, User as UserIcon, LayoutDashboard, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Features', href: '/features' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    logout();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex flex-row justify-between items-center transition-all duration-300">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-black p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <NavLink 
              to="/" 
              className="text-2xl sm:text-3xl tracking-tight text-[#000000]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              EA-DIF<sup className="text-xs">®</sup>
            </NavLink>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => 
                  `text-sm transition-colors font-medium ${
                    isActive ? 'text-[#000000]' : 'text-[#6F6F6F] hover:text-[#000000]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-10 h-10 rounded-full border-2 border-black/5 p-0.5 hover:border-black/20 transition-all overflow-hidden bg-white"
                >
                  <div className="w-full h-full bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </div>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account</p>
                          <p className="text-sm font-bold text-black truncate">{user.displayName || user.email}</p>
                        </div>
                        <NavLink 
                          to="/dashboard" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-xl transition-all"
                        >
                          <LogOut size={18} />
                          Admin Console
                        </NavLink>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <LogOut size={18} />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-[#000000] text-white rounded-full px-6 py-2.5 text-sm hover:scale-[1.03] transition-transform cursor-pointer font-bold shadow-lg shadow-black/10"
              >
                Begin Journey
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-gray-50 overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `text-xl font-bold transition-colors ${
                        isActive ? 'text-black' : 'text-gray-400'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
                {!user && (
                   <button 
                    onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                    className="w-full bg-[#000000] text-white rounded-full py-4 text-sm font-bold mt-4"
                  >
                    Begin Journey
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};
