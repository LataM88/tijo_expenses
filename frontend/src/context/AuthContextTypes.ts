import { createContext, useContext } from 'react';

export type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, tokenType?: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
