import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { User } from "../network/types";
import Socket from "../network/socket";

interface SocketContextType {
  socket: Socket | null;
  users: Map<string, User>;
  emitCursorMove: (x: number, y: number) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

const SOCKET_URL = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_SERVER_URL
  : import.meta.env.VITE_SERVER_URL;

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [users, setUsers] = useState<Map<string, User>>(new Map());

  useEffect(() => {
    if (!user?.nickname) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setUsers(new Map());
      return;
    }

    if (socketRef.current) {
      return;
    }

    const newSocket = new Socket(SOCKET_URL, user.nickname);

    newSocket.on("initial:state", (data) => {
      setUsers((prev) => {
        const usersMap = new Map(prev);
        data.users.forEach((user: User) => {
          usersMap.set(user.userId, user);
        });
        return usersMap;
      });
    });

    newSocket.on("user:joined", (data) => {
      setUsers((prev) => {
        const next = new Map(prev);
        next.set(data.userId, {
          userId: data.userId,
          name: data.name,
          cursor: data.cursor || { x: 0, y: 0 },
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

    newSocket.on("cursor:move", (data) => {
      setUsers((prev) => {
        const next = new Map(prev);
        const user = next.get(data.userId);
        if (user) {
          user.cursor = data.cursor;
          next.set(data.userId, user);
        }
        return next;
      });
    });

    newSocket.connect();
    socketRef.current = newSocket;

    return () => {
      if (socketRef.current) {
        socketRef.current.off("initial:state");
        socketRef.current.off("user:joined");
        socketRef.current.off("user:left");
        socketRef.current.off("cursor:move");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?.nickname]);

  const emitCursorMove = useCallback((x: number, y: number) => {
    if (socketRef.current) {
      socketRef.current.emit("cursor:move", { x, y });
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        users,
        emitCursorMove,
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
