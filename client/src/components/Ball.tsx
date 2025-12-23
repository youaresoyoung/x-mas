import type { CSSProperties } from "react";
import { useSocket } from "../context/SocketContext";

type Props = {
  id: string;
  color: "red" | "blue" | "green" | "yellow";
  className?: string;
  style?: CSSProperties;
  size?: number;
};

const COLOR = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
};

const GLOW = {
  red: "drop-shadow-[0_0_12px_#ef4444]",
  blue: "drop-shadow-[0_0_12px_#3b82f6]",
  green: "drop-shadow-[0_0_12px_#22c55e]",
  yellow: "drop-shadow-[0_0_12px_#eab308]",
};

export const Ball = ({
  id,
  color,
  className = "",
  style,
  size = 40,
}: Props) => {
  const { lightStates, emitLightToggle } = useSocket();
  const fill = COLOR[color];
  const isLit = lightStates.get(id) || false;

  const handleMouseEnter = () => {
    if (!isLit) {
      emitLightToggle(id);
    }
  };

  const handleMouseLeave = () => {
    if (isLit) {
      emitLightToggle(id);
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 cursor-pointer ${
        isLit ? `opacity-100 ${GLOW[color]}` : "opacity-50"
      } ${className}`}
    >
      <circle cx="20" cy="20" r="20" fill={fill} fillOpacity="0.2" />
      <circle cx="20" cy="20" r="16" fill={fill} fillOpacity="0.8" />
      <circle cx="20.5" cy="29.5" r="3.5" fill="white" fillOpacity="0.9" />
      <circle cx="17" cy="14" r="6" fill="white" />
    </svg>
  );
};
