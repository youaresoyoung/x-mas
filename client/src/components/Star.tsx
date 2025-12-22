import type { CSSProperties } from "react";
import { useSocket } from "../context/SocketContext";

interface StarProps {
  id: string;
  className?: string;
  style?: CSSProperties;
  size?: number;
}

export const Star = ({ id, className = "", style, size = 104 }: StarProps) => {
  const { lightStates, emitLightToggle } = useSocket();
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
      viewBox="0 0 104 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 cursor-pointer ${
        isLit ? "opacity-100 drop-shadow-[0_0_20px_#FFC400]" : "opacity-70"
      } ${className}`}
    >
      <path
        d="M49.1468 8.78116C50.0449 6.01723 53.9551 6.01722 54.8532 8.78115L63.0012 33.8582C63.4028 35.0942 64.5547 35.9311 65.8544 35.9311H92.2219C95.1281 35.9311 96.3364 39.65 93.9852 41.3582L72.6535 56.8566C71.602 57.6205 71.162 58.9746 71.5636 60.2107L79.7117 85.2877C80.6097 88.0517 77.4463 90.35 75.0951 88.6418L53.7634 73.1434C52.7119 72.3795 51.2881 72.3795 50.2366 73.1434L28.9049 88.6418C26.5537 90.35 23.3903 88.0517 24.2883 85.2877L32.4364 60.2107C32.838 58.9747 32.398 57.6205 31.3465 56.8566L10.0148 41.3582C7.66362 39.65 8.87194 35.9311 11.7781 35.9311H38.1456C39.4453 35.9311 40.5972 35.0942 40.9988 33.8582L49.1468 8.78116Z"
        fill="#FFC400"
        fillOpacity="0.5"
      />
      <path
        d="M49.1468 23.7812C50.0449 21.0172 53.9551 21.0172 54.8532 23.7812L59.6335 38.4934C60.0351 39.7295 61.187 40.5664 62.4866 40.5664H77.956C80.8622 40.5664 82.0705 44.2852 79.7194 45.9934L67.2044 55.0861C66.1529 55.85 65.713 57.2041 66.1146 58.4402L70.8949 73.1525C71.7929 75.9164 68.6295 78.2148 66.2784 76.5066L53.7634 67.4139C52.7119 66.65 51.2881 66.65 50.2366 67.4139L37.7216 76.5066C35.3705 78.2148 32.2071 75.9164 33.1051 73.1525L37.8854 58.4402C38.287 57.2041 37.8471 55.85 36.7956 55.0861L24.2806 45.9934C21.9295 44.2852 23.1378 40.5664 26.044 40.5664H41.5134C42.813 40.5664 43.9649 39.7295 44.3665 38.4934L49.1468 23.7812Z"
        fill="#FFC400"
        fillOpacity="0.5"
      />
    </svg>
  );
};
