import { story } from "@/lib/story";

export function StoryTimeline() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-14" id="story">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-honey-500 text-sm mb-2">
          <span>🛤️</span>
          <span>המסע</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-forest-900">הסיפור של יונתן</h3>
        <p className="text-ink-500 mt-1">מהיום הראשון ועד המשימה של היום</p>
      </div>

      <ol className="relative border-e-2 border-forest-600/25 space-y-8 pe-6">
        {story.map((m, i) => (
          <li key={i} className="relative">
            <span className="absolute -end-[34px] top-1 w-12 h-12 rounded-full bg-cream-100 border-2 border-forest-600 text-2xl flex items-center justify-center shadow-sm">
              {m.emoji}
            </span>
            <div className="bg-cream-100 border border-cream-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 text-xs text-ink-500">
                <span className="bg-forest-600 text-cream-50 px-2 py-0.5 rounded-full">{m.date}</span>
                <span className="text-honey-500 font-bold">{m.age}</span>
              </div>
              <h4 className="mt-2 text-xl font-extrabold text-forest-900">{m.title}</h4>
              <p className="mt-1 text-ink-700 leading-relaxed">{m.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
