import {
  EVENT_DATE_HE,
  EVENT_TIME_HE,
  EVENT_DRESS_CODE,
  EVENT_LOCATION_TITLE,
  EVENT_LOCATION_ADDRESS,
  EVENT_MAP_URL,
} from "@/lib/constants";

export function MissionCard() {
  return (
    <div className="bg-cream-100 border border-cream-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 text-honey-500 text-sm font-medium mb-2">
        <span>🛰️</span>
        <span>מרכז השליטה</span>
      </div>
      <h3 className="text-2xl font-extrabold text-forest-900">פרטי המשימה</h3>
      <p className="text-ink-500 text-sm mt-1">סימנו ביומן — לא רוצים לפספס את ההמראה!</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-cream-50 border border-cream-200 rounded-xl p-3 flex items-start gap-2">
          <div className="text-xl">📅</div>
          <div>
            <div className="text-[11px] text-ink-500">תאריך</div>
            <div className="font-bold text-forest-900">{EVENT_DATE_HE}</div>
          </div>
        </div>

        <div className="bg-cream-50 border border-cream-200 rounded-xl p-3 flex items-start gap-2">
          <div className="text-xl">🕙</div>
          <div>
            <div className="text-[11px] text-ink-500">שעה</div>
            <div className="font-bold text-forest-900">{EVENT_TIME_HE}</div>
          </div>
        </div>

        <a
          href={EVENT_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 group bg-cream-50 border border-cream-200 hover:border-forest-600/50 hover:bg-cream-100 transition rounded-xl p-3 flex items-start gap-2"
        >
          <div className="text-xl">📍</div>
          <div className="flex-1">
            <div className="text-[11px] text-ink-500">מיקום</div>
            <div className="font-bold text-forest-900">{EVENT_LOCATION_TITLE}</div>
            <div className="text-xs text-ink-500">{EVENT_LOCATION_ADDRESS}</div>
          </div>
          <div className="text-forest-600 text-xs flex items-center gap-1 self-center group-hover:translate-x-[-2px] transition-transform">
            נווט
            <span aria-hidden>↖</span>
          </div>
        </a>

        <div className="col-span-2 bg-cream-50 border border-cream-200 rounded-xl p-3 flex items-start gap-2">
          <div className="text-xl">👕</div>
          <div>
            <div className="text-[11px] text-ink-500">קוד לבוש</div>
            <div className="font-bold text-forest-900">{EVENT_DRESS_CODE}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
