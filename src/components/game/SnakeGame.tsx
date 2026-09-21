"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  Gamepad2,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Pause,
  PartyPopper,
  Zap,
} from "lucide-react";

// Wide aspect ratio grid
const GRID_COLS = 26;
const GRID_ROWS = 15;
const INITIAL_SPEED = 185; // Relaxed, comfortable starting pace
const HIGH_SCORE_KEY = "da-snake-highscore";

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  levelId: number;
  isForgeReady: boolean;
  onStartChapter: () => void;
}

export function SnakeGame({ levelId, isForgeReady, onStartChapter }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>([
    { x: 12, y: 7 },
    { x: 11, y: 7 },
    { x: 10, y: 7 },
    { x: 9, y: 7 },
  ]);
  const [food, setFood] = useState<Point>({ x: 18, y: 7 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load high score
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HIGH_SCORE_KEY);
      if (saved) setHighScore(Number.parseInt(saved, 10) || 0);
    } catch {
      /* ignore */
    }
  }, []);

  // Generate random food not on snake
  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point = { x: 5, y: 5 };
    let isOnSnake = true;
    let attempts = 0;
    while (isOnSnake && attempts < 100) {
      attempts++;
      newFood = {
        x: Math.floor(Math.random() * GRID_COLS),
        y: Math.floor(Math.random() * GRID_ROWS),
      };
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      isOnSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [
      { x: 12, y: 7 },
      { x: 11, y: 7 },
      { x: 10, y: 7 },
      { x: 9, y: 7 },
    ];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === " " || e.key === "Spacebar") {
        if (!isGameOver) setIsPaused((p) => !p);
        return;
      }

      if (isGameOver) {
        if (e.key === "Enter" || e.key === " ") resetGame();
        return;
      }

      let newDir: Point | null = null;
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") newDir = { x: 0, y: -1 };
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") newDir = { x: 0, y: 1 };
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") newDir = { x: -1, y: 0 };
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") newDir = { x: 1, y: 0 };

      if (newDir) {
        // Prevent 180-degree immediate reversal
        if (direction.x + newDir.x !== 0 || direction.y + newDir.y !== 0) {
          setNextDirection(newDir);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isGameOver]);

  // Main game loop
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const interval = setInterval(() => {
      setDirection(nextDirection);
      setSnake((prevSnake) => {
        const head = {
          x: prevSnake[0].x + nextDirection.x,
          y: prevSnake[0].y + nextDirection.y,
        };

        // Wall collision
        if (head.x < 0 || head.x >= GRID_COLS || head.y < 0 || head.y >= GRID_ROWS) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            try {
              localStorage.setItem(HIGH_SCORE_KEY, String(newScore));
            } catch {
              /* ignore */
            }
          }
          setFood(generateFood(newSnake));
          setSpeed((s) => Math.max(125, s - 1));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [nextDirection, food, isGameOver, isPaused, score, highScore, speed, generateFood]);

  // Canvas drawing: Authentic Python-Logo styled snake with smooth continuous body & iconic logo head
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellW = canvas.width / GRID_COLS;
    const cellH = canvas.height / GRID_ROWS;

    // 1. Retro Arcade Canvas Background
    ctx.fillStyle = "#12121c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid dots
    ctx.fillStyle = "#1e1e2d";
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        ctx.beginPath();
        ctx.arc(c * cellW + cellW / 2, r * cellH + cellH / 2, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Food (Golden Django Gem / Python Star Snack)
    const foodCenterX = food.x * cellW + cellW / 2;
    const foodCenterY = food.y * cellH + cellH / 2;
    const pulse = Math.sin(Date.now() / 180) * 1.5;

    ctx.save();
    ctx.shadowColor = "#f2b705";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#f2b705";
    ctx.strokeStyle = "#191924";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(foodCenterX, foodCenterY, cellW / 2.3 + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Food inner highlight
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(foodCenterX - 2, foodCenterY - 2, cellW / 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Continuous Snake Body (Python Logo Blue & Gold Theme)
    if (snake.length > 1) {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Outer ink comic outline
      ctx.beginPath();
      ctx.moveTo(snake[0].x * cellW + cellW / 2, snake[0].y * cellH + cellH / 2);
      for (let i = 1; i < snake.length; i++) {
        ctx.lineTo(snake[i].x * cellW + cellW / 2, snake[i].y * cellH + cellH / 2);
      }
      ctx.strokeStyle = "#191924";
      ctx.lineWidth = cellW + 1;
      ctx.stroke();

      // Main body gradient (Python Blue to Yellow/Gold)
      const headPt = snake[0];
      const tailPt = snake[snake.length - 1];
      const bodyGrad = ctx.createLinearGradient(
        headPt.x * cellW,
        headPt.y * cellH,
        tailPt.x * cellW,
        tailPt.y * cellH
      );
      bodyGrad.addColorStop(0, "#306998"); // Python Royal Blue
      bodyGrad.addColorStop(0.5, "#3776AB"); // Python Classic Blue
      bodyGrad.addColorStop(1, "#f2b705"); // Python Gold

      ctx.strokeStyle = bodyGrad;
      ctx.lineWidth = cellW - 3;
      ctx.stroke();

      // Inner Python belly highlight stripe
      ctx.strokeStyle = "#ffffff30";
      ctx.lineWidth = cellW / 4;
      ctx.stroke();

      // Rounded tail cap
      const tail = snake[snake.length - 1];
      ctx.fillStyle = "#f2b705";
      ctx.beginPath();
      ctx.arc(tail.x * cellW + cellW / 2, tail.y * cellH + cellH / 2, (cellW - 4) / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 4. Python Logo Snake Head
    const head = snake[0];
    const headCenterX = head.x * cellW + cellW / 2;
    const headCenterY = head.y * cellH + cellH / 2;

    ctx.save();
    ctx.translate(headCenterX, headCenterY);

    // Rotate head toward moving direction
    const angle =
      direction.x === 1
        ? 0
        : direction.x === -1
          ? Math.PI
          : direction.y === 1
            ? Math.PI / 2
            : -Math.PI / 2;
    ctx.rotate(angle);

    // Forked snake tongue flick
    const tongueFlick = Math.sin(Date.now() / 120) > 0.3;
    if (tongueFlick && !isPaused && !isGameOver) {
      ctx.strokeStyle = "#d62839";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cellW / 2, 0);
      ctx.lineTo(cellW / 2 + 8, 0);
      ctx.lineTo(cellW / 2 + 12, -3);
      ctx.moveTo(cellW / 2 + 8, 0);
      ctx.lineTo(cellW / 2 + 12, 3);
      ctx.stroke();
    }

    // Python Head (Rounded rectangular snout like the Python logo)
    ctx.fillStyle = "#306998";
    ctx.strokeStyle = "#191924";
    ctx.lineWidth = 2;

    const headW = cellW + 1;
    const headH = cellH - 2;
    ctx.beginPath();
    ctx.roundRect(-headW / 2, -headH / 2, headW, headH, [4, 8, 8, 4]);
    ctx.fill();
    ctx.stroke();

    // Top head highlight
    ctx.fillStyle = "#4B8BBE";
    ctx.beginPath();
    ctx.roundRect(-headW / 2 + 2, -headH / 2 + 2, headW - 4, headH / 2 - 2, [3, 6, 0, 0]);
    ctx.fill();

    // Iconic Python Logo Eye (White circle + Dark Blue pupil)
    const eyeX = headW / 6;
    const eyeY = -headH / 4;
    const eyeR = cellW / 5.5;

    // White eye base
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#191924";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Pupil
    ctx.fillStyle = "#191924";
    ctx.beginPath();
    ctx.arc(eyeX + 1, eyeY, eyeR / 2, 0, Math.PI * 2);
    ctx.fill();

    // Cute nostril dot
    ctx.fillStyle = "#191924";
    ctx.beginPath();
    ctx.arc(headW / 3, headH / 5, 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, [snake, food, direction, isPaused, isGameOver]);

  return (
    <div className="comic-card overflow-hidden bg-[#191924] p-4 text-white shadow-[6px_6px_0_#000] w-full">
      {/* Chapter Ready Banner (Non-intrusive notification) */}
      {isForgeReady && (
        <div className="mb-3 animate-bounce-subtle rounded-lg border-2 border-[#1f9d55] bg-[#d7f0d8] p-3 text-[#191924] shadow-[3px_3px_0_#191924]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-[#1f9d55] shrink-0" />
              <div>
                <span className="font-comic text-base sm:text-lg block leading-tight">
                  CHAPTER {levelId} IS FORGED & READY!
                </span>
                <span className="text-[11px] font-bold opacity-80 block">
                  Keep playing Snake to beat your score, or begin your quest whenever you are ready.
                </span>
              </div>
            </div>
            <button
              onClick={onStartChapter}
              className="comic-btn bg-[#d62839] px-4 py-2 font-comic text-base text-white hover:scale-105 transition active:scale-95"
            >
              <Play className="h-4 w-4" />
              <span>START CHAPTER {levelId}</span>
            </button>
          </div>
        </div>
      )}

      {/* Arcade Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-[#f2b705]" />
          <div>
            <span className="font-comic text-lg sm:text-xl text-[#f2b705] tracking-wide block leading-none">
              PYTHON SNAKE DOJO
            </span>
            <span className="text-[11px] font-bold text-white/70">
              {isForgeReady ? "Lesson Ready • Play freely" : `Forging Chapter ${levelId} with AI...`}
            </span>
          </div>
        </div>

        {/* Score Board */}
        <div className="flex items-center gap-2 text-xs font-black">
          <span className="rounded border border-[#f2b705]/40 bg-[#f2b705]/10 px-3 py-1 text-[#f2b705]">
            SCORE: {score}
          </span>
          <span className="rounded border border-white/20 bg-white/5 px-3 py-1 text-white/80 flex items-center gap-1">
            <Trophy className="h-3.5 w-3.5 text-[#f2b705]" /> BEST: {highScore}
          </span>
        </div>
      </div>

      {/* Wide Snake Board Canvas */}
      <div className="relative mx-auto w-full flex justify-center">
        <canvas
          ref={canvasRef}
          width={650}
          height={375}
          className="w-full rounded-md border-2 border-black max-h-[380px] object-contain bg-[#14141f]"
        />

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-xs rounded-md p-4 text-center">
            <span className="font-comic text-3xl sm:text-4xl text-[#d62839] tracking-wider">
              GAME OVER!
            </span>
            <p className="mt-1 text-sm font-bold text-white/80">Final Score: {score} pts</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <button
                onClick={resetGame}
                className="comic-btn bg-[#f2b705] px-4 py-2 font-comic text-sm text-[#191924]"
              >
                <RotateCcw className="h-4 w-4" />
                <span>PLAY AGAIN</span>
              </button>
              {isForgeReady && (
                <button
                  onClick={onStartChapter}
                  className="comic-btn bg-[#d62839] px-4 py-2 font-comic text-sm text-white"
                >
                  <Play className="h-4 w-4" />
                  <span>START CHAPTER</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Paused Overlay */}
        {isPaused && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-xs rounded-md">
            <span className="font-comic text-2xl text-[#f2b705]">GAME PAUSED</span>
            <button
              onClick={() => setIsPaused(false)}
              className="comic-btn mt-3 bg-white px-3 py-1 font-comic text-xs text-[#191924]"
            >
              RESUME (SPACE)
            </button>
          </div>
        )}
      </div>

      {/* Controls & D-Pad */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-2.5">
        <div className="text-[11px] font-bold text-white/60 hidden sm:block">
          Use <kbd className="rounded bg-white/20 px-1 font-mono">W A S D</kbd> or{" "}
          <kbd className="rounded bg-white/20 px-1 font-mono">Arrow Keys</kbd> • Space to Pause
        </div>

        {/* Mobile / Quick D-Pad Buttons */}
        <div className="flex items-center gap-1 mx-auto sm:ml-auto sm:mr-0">
          <button
            onClick={() => {
              if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
            }}
            className="comic-btn bg-white/15 p-2 text-white hover:bg-white/30 active:scale-95"
            aria-label="Up"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
            }}
            className="comic-btn bg-white/15 p-2 text-white hover:bg-white/30 active:scale-95"
            aria-label="Left"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
            }}
            className="comic-btn bg-white/15 p-2 text-white hover:bg-white/30 active:scale-95"
            aria-label="Down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
            }}
            className="comic-btn bg-white/15 p-2 text-white hover:bg-white/30 active:scale-95"
            aria-label="Right"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="comic-btn bg-white/15 p-2 text-white hover:bg-white/30 ml-2"
            title="Pause / Resume"
          >
            <Pause className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
