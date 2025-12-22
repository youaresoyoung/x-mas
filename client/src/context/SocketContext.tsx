import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { FloatingMessage, User } from "../network/types";
import Socket from "../network/socket";

interface SocketContextType {
  socket: Socket;
  users: Map<string, User>;
  messages: Map<string, FloatingMessage>;
  lightStates: Map<string, boolean>;
  emitTyping: (text: string, x: number, y: number) => void;
  emitCursorMove: (x: number, y: number) => void;
  emitLightToggle: (lightId: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

type Props = {
  children: ReactNode;
  socketClient: Socket;
};

export function SocketProvider({ children, socketClient }: Props) {
  const { user } = useAuth();

  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [messages, setMessages] = useState<Map<string, FloatingMessage>>(
    new Map()
  );
  const [lightStates, setLightStates] = useState<Map<string, boolean>>(
    new Map()
  );

  useEffect(() => {
    if (!user?.nickname) {
      if (socketClient) {
        socketClient.disconnect();
      }
      setUsers(new Map());
      return;
    }

    socketClient.on("initial:state", (data) => {
      setUsers((prev) => {
        const usersMap = new Map(prev);
        data.users.forEach((user: User) => {
          usersMap.set(user.userId, user);
        });
        return usersMap;
      });
      setMessages(new Map());
      setLightStates(new Map(Object.entries(data.lights)));
    });

    socketClient.on("user:joined", (data) => {
      setUsers((prev) => {
        const next = new Map(prev);
        next.set(data.userId, {
          userId: data.userId,
          name: data.name,
          color: data.color,
          cursor: data.cursor || { x: 0, y: 0 },
        });
        return next;
      });
    });

    socketClient.on("user:left", (data) => {
      setUsers((prev) => {
        const next = new Map(prev);
        next.delete(data.userId);
        return next;
      });
    });

    socketClient.on("cursor:move", (data) => {
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

    socketClient.on("message:typing", (data) => {
      setMessages((prev) => {
        const next = new Map(prev);
        next.set(data.userId, data);
        return next;
      });
    });

    socketClient.on("message:remove", (data) => {
      setMessages((prev) => {
        const next = new Map(prev);
        next.delete(data.userId);
        return next;
      });
    });

    socketClient.on("light:toggle", (data) => {
      setLightStates((prev) => {
        const next = new Map(prev);
        next.set(data.lightId, data.state);
        return next;
      });
    });

    socketClient.setNickname(user.nickname);
    socketClient.connect();

    return () => {
      socketClient.off("initial:state");
      socketClient.off("user:joined");
      socketClient.off("user:left");
      socketClient.off("cursor:move");
      socketClient.off("message:typing");
      socketClient.off("message:remove");
      socketClient.off("light:toggle");
      socketClient.disconnect();
    };
  }, [user?.nickname]);

  const emitCursorMove = (x: number, y: number) => {
    if (socketClient) {
      socketClient.emit("cursor:move", {
        userId: socketClient.io.id,
        cursor: { x, y },
      });
    }
  };

  const emitTyping = (text: string, x: number, y: number) => {
    if (socketClient) {
      socketClient.emit("message:typing", { text, x, y });
    }
  };

  const emitLightToggle = (lightId: string) => {
    socketClient.emit("light:toggle", { lightId });
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketClient,
        users,
        messages,
        lightStates,
        emitCursorMove,
        emitTyping,
        emitLightToggle,
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
