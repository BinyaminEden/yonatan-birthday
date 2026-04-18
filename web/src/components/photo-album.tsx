"use client";

import Image from "next/image";
import { useState } from "react";
import { photos } from "@/lib/photos";

export function PhotoAlbum() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="max-w-6xl mx-auto px-5 py-14" id="album">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-honey-500 text-sm mb-2">
          <span>📸</span>
          <span>אלבום המבצע</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-forest-900">יונתן בפעולה</h3>
        <p className="text-ink-500 mt-1">רגעים יקרים מהמשימות של יונתן עד כה</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((p, i) => (
          <button
            key={p.src}
            onClick={() => setOpen(i)}
            type="button"
            className="block w-full relative group rounded-xl overflow-hidden bg-cream-100 border border-cream-200 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <div className="relative aspect-square">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-900/90 to-transparent p-3 text-cream-50 text-sm text-center font-medium">
              {p.caption}
            </div>
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(null)}
              aria-label="סגור"
              className="absolute -top-10 end-0 text-cream-50 text-3xl"
            >
              ×
            </button>
            <div className="relative aspect-[4/5] sm:aspect-video w-full">
              <Image
                src={photos[open].src}
                alt={photos[open].alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-3 text-center text-cream-50 font-bold">{photos[open].caption}</div>
          </div>
        </div>
      )}
    </section>
  );
}
