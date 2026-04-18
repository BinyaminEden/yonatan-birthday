export function SlothPilot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={`w-full h-auto drop-shadow-2xl ${className}`}
      role="img"
      aria-label="עצלן טייס חילוץ"
    >
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a4a38" />
          <stop offset="100%" stopColor="#0e2b20" />
        </radialGradient>
        <linearGradient id="fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a07455" />
          <stop offset="100%" stopColor="#6c4a30" />
        </linearGradient>
        <linearGradient id="helmet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0bb4a" />
          <stop offset="100%" stopColor="#c88720" />
        </linearGradient>
      </defs>

      <circle cx="160" cy="160" r="150" fill="url(#bg)" stroke="#276849" strokeWidth="4" />

      {/* leaves */}
      <g opacity="0.35">
        <path d="M40 90 Q 80 60 130 85 Q 90 105 40 90 Z" fill="#3a8a61" />
        <path d="M280 80 Q 240 55 190 80 Q 235 100 280 80 Z" fill="#3a8a61" />
        <path d="M50 250 Q 90 225 140 250 Q 95 270 50 250 Z" fill="#3a8a61" />
        <path d="M270 250 Q 230 225 180 250 Q 225 270 270 250 Z" fill="#3a8a61" />
      </g>

      {/* body */}
      <ellipse cx="160" cy="200" rx="72" ry="62" fill="url(#fur)" />
      {/* arms */}
      <ellipse cx="95" cy="190" rx="22" ry="40" fill="url(#fur)" transform="rotate(-18 95 190)" />
      <ellipse cx="225" cy="190" rx="22" ry="40" fill="url(#fur)" transform="rotate(18 225 190)" />
      {/* claws */}
      <g stroke="#2a1a0f" strokeWidth="2" fill="#d8c7a8">
        <path d="M80 222 l-8 8 M88 228 l-8 8 M96 232 l-6 10" />
        <path d="M240 222 l8 8 M232 228 l8 8 M224 232 l6 10" />
      </g>
      {/* belly */}
      <ellipse cx="160" cy="215" rx="46" ry="38" fill="#e5cfa8" />

      {/* head */}
      <ellipse cx="160" cy="130" rx="62" ry="56" fill="url(#fur)" />
      {/* face mask */}
      <ellipse cx="160" cy="138" rx="48" ry="40" fill="#efd9b3" />
      {/* eye stripes */}
      <path d="M120 120 Q 132 148 152 156" stroke="#4a2e18" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M200 120 Q 188 148 168 156" stroke="#4a2e18" strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="142" cy="135" r="6" fill="#1a1a1a" />
      <circle cx="178" cy="135" r="6" fill="#1a1a1a" />
      <circle cx="144" cy="133" r="2" fill="#fff" />
      <circle cx="180" cy="133" r="2" fill="#fff" />
      {/* nose */}
      <ellipse cx="160" cy="150" rx="5" ry="4" fill="#2a1a0f" />
      {/* smile */}
      <path d="M150 162 Q 160 170 170 162" stroke="#2a1a0f" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* pilot helmet */}
      <path d="M100 110 Q 160 50 220 110 L 220 125 Q 160 95 100 125 Z" fill="url(#helmet)" stroke="#7a5210" strokeWidth="2" />
      <circle cx="120" cy="118" r="10" fill="#b93d2b" stroke="#7a5210" strokeWidth="2" />
      <circle cx="200" cy="118" r="10" fill="#b93d2b" stroke="#7a5210" strokeWidth="2" />
      {/* goggles strap */}
      <path d="M92 118 Q 160 92 228 118" stroke="#4a2e18" strokeWidth="4" fill="none" />
      {/* scarf */}
      <path d="M118 178 Q 160 200 202 178 L 210 195 Q 160 216 110 195 Z" fill="#d94f3a" />
      <path d="M202 188 l 18 22 l -16 6 z" fill="#b93d2b" />
    </svg>
  );
}
