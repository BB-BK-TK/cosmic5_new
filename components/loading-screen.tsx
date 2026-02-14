"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const loadingMessages = [
  "별자리를 읽고 있어요...",
  "사주를 분석하고 있어요...",
  "오행의 조화를 살피고 있어요...",
  "오늘의 메시지를 정리하고 있어요...",
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Pulsing glow */}
      <div className="relative mb-8">
        <div
          className={cn(
            "w-24 h-24 rounded-full",
            "bg-gradient-to-r from-accent-purple/30 to-accent-teal/30",
            "animate-pulse"
          )}
          style={{
            boxShadow: "0 0 60px rgba(139, 127, 212, 0.3)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl animate-pulse">✦</span>
        </div>
      </div>

      {/* Loading message */}
      <p
        key={messageIndex}
        className="text-text-secondary text-sm animate-in fade-in duration-500"
      >
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
}
