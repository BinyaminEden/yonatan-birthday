"use client";

import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms / 3_600_000) % 24);
  const minutes = Math.floor((ms / 60_000) % 60);
  const seconds = Math.floor((ms / 1_000) % 60);
  return { days, hours, minutes, seconds, done: ms === 0 };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export function Countdown({
  targetIso,
  variant = "dark",
}: {
  targetIso: string;
  variant?: "dark" | "light";
}) {
  const target = new Date(targetIso).getTime();
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, done: false });

  useEffect(() => {
    setMounted(true);
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const show = mounted ? t : { days: 0, hours: 0, minutes: 0, seconds: 0, done: false };
  const units = [
    { v: pad(show.days), label: "ימים" },
    { v: pad(show.hours), label: "שעות" },
    { v: pad(show.minutes), label: "דקות" },
    { v: pad(show.seconds), label: "שניות" },
  ];

  const box =
    variant === "dark"
      ? "bg-forest-800/80 text-cream-50 border-forest-600"
      : "bg-cream-50 text-forest-800 border-forest-600/30";

  if (mounted && t.done) {
    return (
      <div className="text-center font-bold text-lg">
        ההמראה יצאה לדרך! 🎉
      </div>
    );
  }

  return (
    <div className="flex gap-2 sm:gap-3 justify-center" aria-label="ספירה לאחור">
      {units.map((u) => (
        <div
          key={u.label}
          className={`${box} border rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[64px] text-center shadow-sm`}
        >
          <div className="text-2xl sm:text-3xl font-extrabold tabular-nums">{u.v}</div>
          <div className="text-[10px] sm:text-xs opacity-80">{u.label}</div>
        </div>
      ))}
    </div>
  );
}
