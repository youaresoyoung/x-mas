import { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export const FloatingMessage = () => {
  const { user } = useAuth();
  const { socket, users, messages, emitTyping } = useSocket();

  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });

  const mousePositionRef = useRef({ x: 0, y: 0 });
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMessageRemove = (data: { userId: string }) => {
      if (data.userId === socket.io.id) {
        setIsTyping(false);
        setInputValue("");
      }
    };

    socket.on("message:remove", handleMessageRemove);
    return () => {
      socket.off("message:remove");
    };
  }, [socket]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      mousePositionRef.current = { x, y };
      if (isTyping) {
        setInputPosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTyping]);

  useEffect(() => {
    if (isTyping && inputValue) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      emitTyping(
        inputValue,
        mousePositionRef.current.x,
        mousePositionRef.current.y
      );
    }
  }, [inputValue, isTyping, emitTyping]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") {
        if (e.key === "Escape") {
          setIsTyping(false);
          setInputValue("");
          emitTyping(
            "",
            mousePositionRef.current.x,
            mousePositionRef.current.y
          );
        }

        return;
      }

      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        setIsTyping(true);
        setInputPosition(mousePositionRef.current);
      }

      if (e.key === "Escape" && isTyping) {
        setIsTyping(false);
        setInputValue("");
        emitTyping("", mousePositionRef.current.x, mousePositionRef.current.y);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTyping, emitTyping]);

  return (
    <>
      {isTyping && (
        <div
          className="fixed z-999 pointer-events-auto"
          style={{
            left: inputPosition.x,
            top: inputPosition.y,
            transform: "translate(-50%, calc(-100% - 10px))",
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            autoFocus
            className="px-3 py-2 backdrop-blur-sm rounded-lg shadow-lg text-sm text-white outline-none min-w-50"
            style={{ backgroundColor: user?.color || "#ffffff" }}
          />
        </div>
      )}

      {Array.from(messages.values()).map((msg) => {
        if (!msg.text) return null;

        const user = users.get(msg.userId);
        if (!user) return null;

        return (
          <div
            key={msg.userId}
            className="absolute z-999 pointer-events-none animate-fade-in"
            style={{
              left: `${user.cursor.x}px`,
              top: `${user.cursor.y}px`,
              transform: "translate(-50%, calc(-100% - 10px))",
            }}
          >
            <div
              className="px-3 py-2 backdrop-blur-sm rounded-lg shadow-md text-sm text-white"
              style={{ backgroundColor: user.color }}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
    </>
  );
};
