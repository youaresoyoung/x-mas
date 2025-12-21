import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { User } from "../network/types";
import Socket from "../network/socket";

interface SocketContextType {
  socket: Socket | null;
  users: Map<string, User>;
}

const SocketContext = createContext<SocketContextType | null>(null);

const SOCKET_URL = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_SERVER_URL
  : import.meta.env.VITE_SERVER_URL;

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<Map<string, User>>(new Map());

  useEffect(() => {
    if (!user?.nickname) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = new Socket(SOCKET_URL, user.nickname);
    newSocket.connect();

    newSocket.on("user:joined", (data) => {
      setUsers((prev) => {
        const next = new Map(prev);
        next.set(data.userId, {
          userId: data.userId,
          name: data.name,
        });
        return next;
      });
    });

    newSocket.on("user:left", (data) => {
      setUsers((prev) => {
        const next = new Map(prev);
        next.delete(data.userId);
        return next;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("user:joined");
      newSocket.off("user:left");
      newSocket.disconnect();
    };
  }, [user?.nickname]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        users,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
}
