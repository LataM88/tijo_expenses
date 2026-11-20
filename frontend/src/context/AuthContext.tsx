import { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContextTypes';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = (newToken: string, tokenType: string = 'bearer') => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('token_type', tokenType);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        isLoading: false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
