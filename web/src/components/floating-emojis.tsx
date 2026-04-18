"use client";

import { useMemo } from "react";

const EMOJIS = ["🎈", "🦥", "⭐", "✈️", "💚", "🎉", "🎂"];

type Item = {
  emoji: string;
  left: number;
  delay: number;
  dur: number;
  size: number;
};

export function FloatingEmojis({ count = 22 }: { count?: number }) {
  const items = useMemo<Item[]>(() => {
    const rnd = mulberry32(42); // deterministic across hydration
    return Array.from({ length: count }, () => ({
      emoji: EMOJIS[Math.floor(rnd() * EMOJIS.length)],
      left: rnd() * 100,
      delay: rnd() * -18,
      dur: 12 + rnd() * 12,
      size: 18 + rnd() * 22,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute bottom-[-40px] animate-float-up select-none"
          style={{
            left: `${it.left}%`,
            fontSize: `${it.size}px`,
            animationDelay: `${it.delay}s`,
            // custom duration via CSS var
            ["--dur" as string]: `${it.dur}s`,
          }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
