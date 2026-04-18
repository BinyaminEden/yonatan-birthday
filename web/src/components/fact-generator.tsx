"use client";

import { useState } from "react";
import { slothFacts } from "@/lib/facts";

function pick(prev: string | null): string {
  if (slothFacts.length === 1) return slothFacts[0];
  while (true) {
    const f = slothFacts[Math.floor(Math.random() * slothFacts.length)];
    if (f !== prev) return f;
  }
}

export function FactGenerator() {
  const [fact, setFact] = useState<string>(slothFacts[0]);

  return (
    <div className="bg-cream-100 border border-cream-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 text-rescue-500 text-sm font-medium mb-2">
        <span>🦥</span>
        <span>מחולל עובדות</span>
      </div>
      <h3 className="text-2xl font-extrabold text-forest-900">עובדת יונתן-עצלן</h3>
      <p className="text-ink-500 text-sm mt-1">לחצו לקבלת עובדה רשמית ממרכז המשימות 🦥</p>

      <p className="mt-5 bg-cream-50 border border-cream-200 rounded-xl p-4 text-forest-900 text-center font-medium min-h-[72px] flex items-center justify-center">
        &quot;{fact}&quot;
      </p>

      <button
        type="button"
        onClick={() => setFact((prev) => pick(prev))}
        className="mt-4 w-full bg-rescue-500 hover:bg-rescue-600 transition text-cream-50 font-bold py-3 rounded-xl"
      >
        ✨ עובדה חדשה
      </button>
    </div>
  );
}
