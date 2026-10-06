import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage (or via httpOnly cookie, but we can verify by hitting /me)
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch('https://rameshwar-portfolio-website.vercel.app/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (data.success) {
          setAdmin(data.data);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('https://rameshwar-portfolio-website.vercel.app/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    if (data.success) {
      setAdmin(data.admin);
      localStorage.setItem('token', data.token); // Store token as fallback for Authorization header
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = async () => {
    await fetch('https://rameshwar-portfolio-website.vercel.app/api/v1/auth/logout', { method: 'POST' });
    setAdmin(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
