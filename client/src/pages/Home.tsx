import { useEffect, useRef, type MouseEvent } from "react";
import backgroundSnow1 from "../assets/svgs/background_snow_1.svg";
import backgroundSnow2 from "../assets/svgs/background_snow_2.svg";
import backgroundSnow3 from "../assets/svgs/background_snow_3.svg";
import treeMd from "../assets/svgs/tree_md.svg";
import treeSm from "../assets/svgs/tree_sm.svg";
import { useSocket } from "../context/SocketContext";
import Cursors from "../components/Cursor";

const BACKGROUND_POSITION = [
  { img: backgroundSnow1, alt: "Background Snow first", zIndex: "z-30" },
  {
    img: backgroundSnow2,
    alt: "Background Snow second",
    zIndex: "z-20",
  },
  { img: backgroundSnow3, alt: "Background Snow third", zIndex: "z-10" },
];

const TREES_POSITION = [
  { img: treeSm, alt: "tree small left", position: "z-30 bottom-80 left-140" },
  {
    img: treeSm,
    alt: "tree small right",
    position: "z-30 bottom-80 right-140",
  },
  { img: treeMd, alt: "tree medium left", position: "z-30 bottom-30 left-20" },
  {
    img: treeMd,
    alt: "tree medium right",
    position: "z-30 bottom-30 right-20",
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { emitCursorMove } = useSocket();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        emitCursorMove(x, y);
      }
    };
    window.addEventListener("mousemove", handleMouseMove as any);
    return () =>
      window.removeEventListener("mousemove", handleMouseMove as any);
  }, [emitCursorMove]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <Cursors />
      {BACKGROUND_POSITION.map((item) => (
        <img
          key={item.alt}
          src={item.img}
          alt={item.alt}
          className={`absolute bottom-0 left-0 w-full ${item.zIndex}`}
        />
      ))}
      {TREES_POSITION.map((item) => (
        <img
          key={item.alt}
          src={item.img}
          alt={item.alt}
          className={`absolute ${item.position}`}
        />
      ))}
    </div>
  );
}
