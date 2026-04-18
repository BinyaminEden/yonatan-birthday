import {
  EVENT_DATE_HE,
  EVENT_TIME_HE,
  EVENT_DRESS_CODE,
} from "@/lib/constants";

const rows = [
  { icon: "📅", label: "תאריך", value: EVENT_DATE_HE },
  { icon: "🕙", label: "שעה", value: EVENT_TIME_HE },
  { icon: "📍", label: "מיקום", value: "הבסיס של יונתן" },
  { icon: "👕", label: "קוד לבוש", value: EVENT_DRESS_CODE },
];

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
        {rows.map((r) => (
          <div
            key={r.label}
            className="bg-cream-50 border border-cream-200 rounded-xl p-3 flex items-start gap-2"
          >
            <div className="text-xl">{r.icon}</div>
            <div>
              <div className="text-[11px] text-ink-500">{r.label}</div>
              <div className="font-bold text-forest-900">{r.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
