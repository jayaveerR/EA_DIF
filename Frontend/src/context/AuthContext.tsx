import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  token?: string;
  role: 'admin' | 'student';
  student_id?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string, student_id?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user session exists in localStorage
    const savedUser = localStorage.getItem('ea_dif_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    const authUser: AuthUser = {
      id: data._id,
      email: data.email,
      name: data.name,
      token: data.token,
      role: data.role,
      student_id: data.student_id
    };

    setUser(authUser);
    localStorage.setItem('ea_dif_user', JSON.stringify(authUser));
  };

  const register = async (name: string, email: string, password: string, role: string, student_id?: string) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, student_id })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    const authUser: AuthUser = {
      id: data._id,
      email: data.email,
      name: data.name,
      token: data.token,
      role: data.role,
      student_id: data.student_id
    };

    setUser(authUser);
    localStorage.setItem('ea_dif_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ea_dif_user');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
