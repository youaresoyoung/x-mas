import { useEffect, useRef } from "react";

const SNOW_AREA = 3000;
const SNOW_RADIUS = 3;
const SNOW_SPEED = 7;
const SNOW_SWING_SPEED = 0.1;

export const Snow = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(null);
  const snowflakesRef = useRef<
    {
      x: number;
      y: number;
      radius: number;
      speed: number;
      swing: number;
      swingSpeed: number;
    }[]
  >([]);

  const createSnowflakes = (canvas: HTMLCanvasElement) => {
    const count = Math.floor((canvas.width * canvas.height) / SNOW_AREA);

    const snowflakes = [];
    for (let i = 0; i < count; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * SNOW_RADIUS,
        speed: Math.random() * SNOW_SPEED,
        swing: Math.random() * Math.PI + 2,
        swingSpeed: Math.random() * SNOW_SWING_SPEED,
      });
    }

    return snowflakes;
  };

  const animate = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !snowflakesRef.current.length) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snowflakesRef.current.forEach((flake) => {
      flake.y += flake.speed;
      flake.swing += flake.swingSpeed;
      flake.x += Math.sin(flake.swing) * 0.5;

      if (flake.y > canvas.height) {
        flake.y = -flake.radius;
        flake.x = Math.random() * canvas.width;
      }

      if (flake.x > canvas.width) {
        flake.x = 0;
      } else if (flake.x < 0) {
        flake.x = canvas.width;
      }

      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    });

    animationIdRef.current = requestAnimationFrame(() => animate(canvas));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 1920;
    canvas.height = 1080;

    snowflakesRef.current = createSnowflakes(canvas) || [];
    animationIdRef.current = requestAnimationFrame(() => animate(canvas));

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 z-0"></canvas>
  );
};
