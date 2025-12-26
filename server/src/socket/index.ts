import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import type { FloatingMessage, ServerToClientEvents, User } from "./types.js";
import { getUserColor } from "../utils/color.js";

type SocketServer = Server<ServerToClientEvents>;

const connectedUsers = new Map<string, User>();
const usedNicknames = new Set<string>();
const activeMessages = new Map<string, FloatingMessage>();
const messageTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const lightStates = new Map<string, boolean>();

export function isNicknameInUse(nickname: string): boolean {
  return usedNicknames.has(nickname);
}

export class Socket {
  io: SocketServer;
  private MESSAGE_LIFETIME = 30000;

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
      socket.data.color = getUserColor(socket.id);

      socket.once("disconnect", () => {
        usedNicknames.delete(trimmed);
      });

      next();
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      const { userId, name, color } = socket.data;

      const user: User = {
        userId,
        name,
        color,
        cursor: { x: 0, y: 0 },
      };

      socket.emit("initial:state", {
        users: Array.from(connectedUsers.values()),
        messages: [],
        lights: Object.fromEntries(lightStates),
      });

      connectedUsers.set(userId, user);

      socket.broadcast.emit("user:joined", {
        userId,
        name,
        color: user.color,
        cursor: user.cursor,
      });

      socket.on(
        "cursor:move",
        (data: { userId: string; cursor: { x: number; y: number } }) => {
          const user = connectedUsers.get(data.userId);
          if (user) {
            user.cursor = { x: data.cursor.x, y: data.cursor.y };
            socket.broadcast.emit("cursor:move", {
              userId: data.userId,
              cursor: user.cursor,
            });
          }
        }
      );

      socket.on("message:typing", (data: { text: string }) => {
        const existingTimeout = messageTimeouts.get(userId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        if (!data.text || data.text.trim() === "") {
          activeMessages.delete(userId);
          messageTimeouts.delete(userId);
          this.io.emit("message:remove", { userId });
          return;
        }

        const message: FloatingMessage = {
          id: crypto.randomUUID(),
          userId,
          name,
          text: data.text,
          typing: true,
        };

        activeMessages.set(userId, message);

        this.io.emit("message:typing", message);

        const timeout = setTimeout(() => {
          activeMessages.delete(userId);
          messageTimeouts.delete(userId);
          this.io.emit("message:remove", { userId });
        }, this.MESSAGE_LIFETIME);

        messageTimeouts.set(userId, timeout);
      });

      socket.on("light:toggle", (data) => {
        const currentState = lightStates.get(data.lightId) || false;
        const newState = !currentState;
        lightStates.set(data.lightId, newState);

        this.io.emit("light:toggle", {
          lightId: data.lightId,
          state: newState,
        });
      });

      socket.on("disconnect", () => {
        const disconnectedUser = connectedUsers.get(userId);

        if (disconnectedUser) {
          connectedUsers.delete(userId);
          usedNicknames.delete(disconnectedUser.name);

          const timeout = messageTimeouts.get(userId);
          if (timeout) {
            clearTimeout(timeout);
            messageTimeouts.delete(userId);
          }
          activeMessages.delete(userId);

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
