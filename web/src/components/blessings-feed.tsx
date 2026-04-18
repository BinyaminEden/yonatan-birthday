import type { Blessing } from "@/lib/supabase";

export function BlessingsFeed({ blessings }: { blessings: Blessing[] }) {
  return (
    <section className="max-w-6xl mx-auto px-5 py-14" id="feed">
      <div className="text-center mb-8">
        <div className="inline-block text-honey-500 text-sm mb-2">דוחות מהשטח</div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900">הברכות של כולם</h2>
        <p className="text-ink-500 mt-1">כל ההודעות החמות שהגיעו ליונתן</p>
      </div>

      {blessings.length === 0 ? (
        <div className="bg-cream-100 border border-cream-200 rounded-2xl p-10 text-center">
          <div className="text-5xl">💌</div>
          <h3 className="mt-3 text-xl font-bold text-forest-900">עוד אין ברכות במרכז המשימות</h3>
          <p className="text-ink-500 mt-1">היו הראשונים להמריא עם ברכה ליונתן! 🦥✨</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blessings.map((b) => (
            <article
              key={b.id}
              className="bg-cream-100 border border-cream-200 rounded-2xl p-5 shadow-sm flex flex-col"
            >
              {b.media_url && b.media_type === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.media_url}
                  alt=""
                  className="rounded-xl mb-3 aspect-video object-cover w-full"
                  loading="lazy"
                />
              )}
              {b.media_url && b.media_type === "video" && (
                <video
                  src={b.media_url}
                  controls
                  playsInline
                  className="rounded-xl mb-3 aspect-video w-full bg-black"
                />
              )}
              <p className="text-forest-900 whitespace-pre-wrap leading-relaxed flex-1">{b.message}</p>
              <div className="mt-3 pt-3 border-t border-cream-200 flex items-center justify-between text-sm">
                <span className="font-bold text-forest-800">— {b.name}</span>
                <time className="text-ink-500" dateTime={b.created_at}>
                  {new Date(b.created_at).toLocaleDateString("he-IL")}
                </time>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
