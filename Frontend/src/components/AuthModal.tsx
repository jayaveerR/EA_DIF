import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'student'>('admin');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    
    if (!(hasUpper && hasLower && hasNumber && hasSpecial)) {
      return "Password should include uppercase, lowercase, numbers, and special characters.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, role, role === 'student' ? studentId : undefined);
      }
      onClose();
      // Role-based redirection will happen in the App component or via Auth state, 
      // but let's force a refresh or routing here:
      window.location.reload(); 
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row min-h-[600px]"
          >
            {/* Left Side: 3D Animation/Visual */}
            <div className="hidden md:flex flex-1 bg-black relative items-center justify-center p-12 overflow-hidden">
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-black to-black" />
                <motion.div 
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full"
                />
                <motion.div 
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 15, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/20 rounded-full"
                />
              </div>
              
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-6xl mb-8"
                >
                  ✨
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Welcome to EA-DIF
                </h2>
                <p className="text-gray-400 max-w-xs mx-auto">
                  Join the future of student behavior analysis and academic excellence.
                </p>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 p-8 md:p-12 relative bg-white">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>

              <div className="max-w-sm mx-auto">
                <h3 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h3>
                <p className="text-gray-500 mb-8">
                  {isLogin ? 'Enter your details to continue.' : 'Start your journey with us today.'}
                </p>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100 flex items-start gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          placeholder="Full Name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                        />
                      </div>
                      
                      <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100 mt-2">
                        <button
                          type="button"
                          onClick={() => setRole('admin')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'admin' ? 'bg-black text-white' : 'text-gray-400'}`}
                        >
                          Administrator
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('student')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'student' ? 'bg-black text-white' : 'text-gray-400'}`}
                        >
                          Student
                        </button>
                      </div>

                      {role === 'student' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="relative mt-2"
                        >
                          <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="Student ID (e.g. S1082)"
                            required
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                          />
                        </motion.div>
                      )}
                    </>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {!isLogin && (
                    <div className="text-[10px] text-gray-400 px-1">
                      Min. 8 characters with uppercase, lowercase, number & special char.
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full py-4 rounded-xl font-bold"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-black font-bold hover:underline"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
