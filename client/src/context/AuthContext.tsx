import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AuthService } from "../service/authService";

export interface User {
  nickname: string;
}

interface AuthContextType {
  user: User | null;
  setNickname: (nickname: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "xmas_nickname";

type Props = {
  authService: AuthService;
  children: ReactNode;
};

export function AuthProvider({ authService, children }: Props) {
  const [user, setUser] = useState<User | null>(() => {
    const savedNickname = localStorage.getItem(STORAGE_KEY);
    return savedNickname ? { nickname: savedNickname } : null;
  });

  const setNickname = (nickname: string) => {
    const trimmed = nickname.trim();
    setUser({ nickname: trimmed });
    authService.login(trimmed);
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{ user, setNickname, logout }}>
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
