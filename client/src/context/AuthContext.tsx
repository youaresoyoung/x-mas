import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AuthService } from "../service/authService";

export interface User {
  nickname: string;
  color: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  login: (nickname: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "xmas_user";

type Props = {
  authService: AuthService;
  children: ReactNode;
};

export function AuthProvider({ authService, children }: Props) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = async (nickname: string) => {
    const trimmed = nickname.trim();
    const { color } = await authService.login(trimmed);
    const newUser = { nickname: trimmed, color };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{ user, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
