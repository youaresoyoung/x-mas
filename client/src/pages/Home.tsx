import { useEffect, useRef, useState, type MouseEvent } from "react";

import { useSocket } from "../context/SocketContext";
import Cursors from "../components/Cursor";
import { FloatingMessage } from "../components/FloatingMessage";
import { BACKGROUND_POSITION, TREES_POSITION } from "../data/data";
import { useAuth } from "../context/AuthContext";
import christmasSong from "../assets/music/christmas_song.mp3";

export default function Home() {
  const { logout } = useAuth();
  const { emitCursorMove } = useSocket();

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      setIsMusicPlaying(false);
      audioRef.current?.pause();
    } else {
      const audio = new Audio(christmasSong);
      audio.loop = true;
      audio.play();
      audioRef.current = audio;
      setIsMusicPlaying(true);
    }
  };

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
      <button
        onClick={toggleMusic}
        className="fixed z-50 top-4 left-4 text-white px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all duration-200"
      >
        {isMusicPlaying ? "Turn Off" : "Turn On"} Music
      </button>
      <button
        onClick={logout}
        className="fixed z-50 top-4 right-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200"
      >
        Exit
      </button>
      <Cursors />
      <FloatingMessage />
      {BACKGROUND_POSITION.map((item) => (
        <img
          key={item.alt}
          src={item.img}
          alt={item.alt}
          className={`absolute bottom-0 left-0 w-full ${item.zIndex}`}
        />
      ))}
      {TREES_POSITION.map((item) => (
        <div
          key={item.alt}
          className={`absolute ${item.position}`}
          style={{ position: "absolute" }}
        >
          <div className="relative">
            <img src={item.img} alt={item.alt} />
            {item.star}
            {item.balls}
          </div>
        </div>
      ))}
    </div>
  );
}
