import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import type { User } from "./types.ts";

const connectedUsers = new Map<string, User>();
const usedNicknames = new Set<string>();

export function isNicknameInUse(nickname: string): boolean {
  return usedNicknames.has(nickname);
}

export class Socket {
  io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin:
          process.env.NODE_ENV === "development"
            ? process.env.CLIENT_DEV_URL
            : process.env.CLIENT_URL,
        credentials: true,
      },
    });

    this.io.use((socket, next) => {
      const nickname = socket.handshake.auth.nickname;

      if (!nickname) {
        return next(new Error("Nickname is required"));
      }

      const trimmed = nickname.trim();

      if (trimmed.length < 2 || trimmed.length > 10) {
        return next(new Error("Nickname must be between 2 and 10 characters"));
      }

      if (usedNicknames.has(trimmed)) {
        return next(new Error("This nickname is already in use"));
      }

      usedNicknames.add(trimmed);

      socket.data.userId = socket.id;
      socket.data.name = trimmed;

      socket.once("disconnect", () => {
        usedNicknames.delete(trimmed);
      });

      next();
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      const user: User = {
        userId: socket.data.userId,
        name: socket.data.name,
      };

      connectedUsers.set(socket.id, user);

      socket.broadcast.emit("user:joined", {
        userId: user.userId,
        name: user.name,
      });

      socket.on("disconnect", () => {
        const disconnectedUser = connectedUsers.get(socket.id);
        if (disconnectedUser) {
          connectedUsers.delete(socket.id);

          socket.broadcast.emit("user:left", {
            userId: disconnectedUser.userId,
          });
        }
      });
    });
  }
}

let socket: Socket | null = null;
export function initSoket(server: HttpServer) {
  if (!socket) {
    socket = new Socket(server);
  }
}
