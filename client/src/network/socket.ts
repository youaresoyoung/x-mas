import { io } from "socket.io-client";

export default class Socket {
  io: ReturnType<typeof io>;

  constructor(baseURL: string, nickname?: string) {
    this.io = io(baseURL, {
      auth: {
        nickname: nickname || null,
      },
      autoConnect: false,
    });
  }

  connect() {
    if (!this.io.connected) {
      this.io.connect();
    }
  }

  on(event: string, callback: (data: any) => void) {
    this.io.on(event, callback);
  }

  off(event: string) {
    this.io.off(event);
  }

  disconnect() {
    if (this.io.connected) {
      this.io.disconnect();
    }
  }
}
