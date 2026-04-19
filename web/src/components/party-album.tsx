"use client";

import { useState } from "react";
import type { AlbumItem } from "@/lib/supabase";
import { PartyAlbumUpload } from "./party-album-upload";

export function PartyAlbum({ items }: { items: AlbumItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="max-w-6xl mx-auto px-5 py-14" id="party-album">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-honey-500 text-sm mb-2">
          <span>🎉</span>
          <span>אלבום המסיבה</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900">הרגעים שלכם</h2>
        <p className="text-ink-500 mt-1">
          צילמתם? הוסיפו ושתפו עם כולם — תמונות וסרטונים של יונתן במסיבה
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <PartyAlbumUpload />
      </div>

      {items.length > 0 && (
        <div className="mt-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((it, i) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setOpen(i)}
                className="block w-full relative aspect-square rounded-xl overflow-hidden bg-cream-100 border border-cream-200 group focus:outline-none focus:ring-2 focus:ring-forest-600"
              >
                {it.media_type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.media_url}
                    alt={it.uploader_name ?? ""}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <video
                      src={it.media_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover bg-black"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-cream-50 text-4xl drop-shadow-lg">
                      ▶
                    </div>
                  </>
                )}
                {it.uploader_name && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-900/80 to-transparent p-2 text-cream-50 text-xs text-center font-medium truncate">
                    {it.uploader_name}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {open !== null && (
        <div
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(null)}
              aria-label="סגור"
              className="absolute -top-10 end-0 text-cream-50 text-3xl"
            >
              ×
            </button>
            {items[open].media_type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={items[open].media_url}
                alt=""
                className="w-full max-h-[80vh] object-contain"
              />
            ) : (
              <video
                src={items[open].media_url}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[80vh] bg-black"
              />
            )}
            {items[open].uploader_name && (
              <div className="mt-3 text-center text-cream-50">
                מאת {items[open].uploader_name}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
