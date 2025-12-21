import { useSocket } from "../context/SocketContext";

const CURSOR_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

function hashStringToIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

export default function Cursors() {
  const { users } = useSocket();

  return (
    <>
      {Array.from(users.values()).map((user) => {
        const colorIndex = hashStringToIndex(user.userId, CURSOR_COLORS.length);
        const color = CURSOR_COLORS[colorIndex];

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
                fill={color}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>

            <div
              className="absolute left-5 top-4 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: color }}
            >
              {user.name}
            </div>
          </div>
        );
      })}
    </>
  );
}
