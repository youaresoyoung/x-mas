export interface User {
  userId: string;
  name: string;
  cursor: { x: number; y: number };
}

export interface InitialState {
  users: User[];
}
export interface ServerToClientEvents {
  "initial:state": (data: InitialState) => void;
  "user:joined": (data: {
    userId: string;
    name: string;
    cursor: { x: number; y: number };
  }) => void;
  "user:left": (data: { userId: string }) => void;
}

export interface SocketData {
  userId: string;
  name: string;
}
