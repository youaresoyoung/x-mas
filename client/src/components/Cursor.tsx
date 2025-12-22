import { useSocket } from "../context/SocketContext";

export default function Cursors() {
  const { users } = useSocket();

  return (
    <>
      {Array.from(users.values()).map((user) => {
        return (
          <div
            key={user.userId}
            className="absolute pointer-events-none z-999 transition-all duration-75"
            style={{
              left: `${user.cursor.x}px`,
              top: `${user.cursor.y}px`,
              transform: "translate(-2px, -2px)",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-3.05539e-06 2.47001e-06L21.9796 8.09074L11.7776 11.7776L8.09073 21.9796L-3.05539e-06 2.47001e-06Z"
                fill={user.color}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>

            <div
              className="absolute left-5 top-4 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </div>
        );
      })}
    </>
  );
}
