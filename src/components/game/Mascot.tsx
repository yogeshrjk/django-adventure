"use client";
import Image from "next/image";
import { useGsapFloat } from "@/lib/gsap-helpers";
import { getChapterMascot } from "@/lib/levels";

export type Mood = "happy" | "think" | "cheer" | "sad";

export function Mascot({
  mood = "happy",
  size = "md",
  src,
  levelId,
  className = "",
}: {
  mood?: Mood;
  size?: "sm" | "md" | "lg";
  src?: string;
  levelId?: number;
  className?: string;
}) {
  const ref = useGsapFloat<HTMLDivElement>(10, 2.2);
  const imageSrc = src || (levelId !== undefined ? getChapterMascot(levelId) : "/logo.png");
  const box =
    size === "sm" ? "h-12 w-12" : size === "lg" ? "h-24 w-24" : "h-16 w-16";
  const imgPx = size === "sm" ? 48 : size === "lg" ? 96 : 64;

  return (
    <div
      ref={ref}
      title="Djano the coach"
      className={`gsap-float relative grid shrink-0 place-items-center ${box} ${className}`}
    >
      <Image
        src={imageSrc}
        alt="Djano the coach"
        width={imgPx}
        height={imgPx}
        className="h-full w-full object-contain"
        priority={size === "md" || size === "lg"}
      />
    </div>
  );
}

export function Speech({ children }: { children: React.ReactNode }) {
  return <div className="speech-bubble p-4 text-sm font-bold leading-relaxed">{children}</div>;
}
