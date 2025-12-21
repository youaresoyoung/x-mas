export interface User {
  userId: string;
  name: string;
}

export interface ServerToClientEvents {
  "user:joined": (data: { userId: string; name: string }) => void;
  "user:left": (data: { userId: string }) => void;
}

export interface SocketData {
  userId: string;
  name: string;
}
