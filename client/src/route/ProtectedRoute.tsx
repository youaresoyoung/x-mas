import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  requireAuth?: boolean;
};

export const ProtectedRoute = ({ children, requireAuth = true }: Props) => {
  const { user } = useAuth();
  const hasNickname = Boolean(user?.nickname);

  if (requireAuth) {
    if (!hasNickname) {
      return <Navigate to="/entrance" replace />;
    }
    return <>{children}</>;
  }

  if (hasNickname) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
