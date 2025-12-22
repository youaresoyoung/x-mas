export interface User {
  userId: string;
  name: string;
  color: string;
  cursor: { x: number; y: number };
}

export interface FloatingMessage {
  id: string;
  userId: string;
  name: string;
  text: string;
  typing: boolean;
}

export interface InitialState {
  users: User[];
}
export interface ServerToClientEvents {
  "initial:state": (data: InitialState) => void;
  "user:joined": (data: {
    userId: string;
    name: string;
    color: string;
    cursor: { x: number; y: number };
  }) => void;
  "user:left": (data: { userId: string }) => void;
  "cursor:move": (data: {
    userId: string;
    cursor: { x: number; y: number };
  }) => void;
  "message:send": (data: FloatingMessage) => void;
  "message:typing": (data: FloatingMessage) => void;
  "message:remove": (data: { userId: string }) => void;
  "light:toggle": (data: { lightId: string; state: boolean }) => void;
}

export interface SocketData {
  userId: string;
  name: string;
}
