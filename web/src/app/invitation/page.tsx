import { Countdown } from "@/components/countdown";
import { FloatingEmojis } from "@/components/floating-emojis";
import {
  EVENT_DATE_HE,
  EVENT_TIME_HE,
  EVENT_DATE_ISO,
  EVENT_LOCATION_TITLE,
  EVENT_LOCATION_ADDRESS,
} from "@/lib/constants";
import { SlothPilot } from "@/components/sloth-pilot";

export const metadata = {
  title: "הזמנה • יונתן בן 3",
  description: "מוזמנים לחגוג את יום ההולדת השלישי של יונתן",
};

export default function InvitationPage() {
  const rows = [
    { icon: "📅", label: "תאריך", value: EVENT_DATE_HE, color: "bg-rescue-500" },
    { icon: "🕙", label: "שעה", value: EVENT_TIME_HE, color: "bg-forest-600" },
    {
      icon: "📍",
      label: "מיקום",
      value: EVENT_LOCATION_TITLE,
      sub: EVENT_LOCATION_ADDRESS,
      color: "bg-forest-700",
    },
  ];

  return (
    <main className="relative min-h-screen flex items-center justify-center p-5 bg-gradient-to-b from-cream-50 to-cream-100">
      <FloatingEmojis count={22} />

      <article className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-xl border border-cream-200 p-8 sm:p-10 text-center">
        <div className="flex justify-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40 animate-bob">
            <SlothPilot />
          </div>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 bg-cream-100 border border-cream-200 rounded-full px-3 py-1 text-xs text-forest-800">
          <span>🦥</span>
          <span>הזמנה רשמית</span>
        </div>

        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-forest-900">יונתן בן 3!</h1>
        <p className="mt-2 text-ink-700">מוזמנים לחגוג יחד 🎉</p>

        <div className="mt-6 space-y-3 text-right">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center gap-3 bg-cream-50 border border-cream-200 rounded-2xl p-3"
            >
              <div
                className={`shrink-0 w-11 h-11 rounded-xl ${r.color} text-cream-50 flex items-center justify-center text-xl`}
              >
                {r.icon}
              </div>
              <div>
                <div className="text-[11px] text-ink-500">{r.label}</div>
                <div className="font-bold text-forest-900">{r.value}</div>
                {r.sub && <div className="text-xs text-ink-500">{r.sub}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 text-2xl">🎂🦥✈️</div>

        <div className="mt-4">
          <p className="text-sm text-ink-500 mb-2">עוד כמה זמן עד ההמראה...</p>
          <Countdown targetIso={EVENT_DATE_ISO} variant="light" />
        </div>

        <div className="mt-8 border-t border-cream-200 pt-5">
          <div className="inline-flex items-center gap-2 text-forest-700 font-medium">
            <span>❤️</span>
            <span>מצפים לראות אתכם! 💚</span>
          </div>
          <p className="mt-2 text-xs text-ink-500">
            קוד לבוש: טייסים, עצלנים ואנשים שמחים 🦥✈️
          </p>
        </div>
      </article>

      <div className="absolute bottom-3 inset-x-0 text-center text-xs text-ink-500 z-10">
        ⭐ יום הולדת שמח יונתן ⭐
      </div>
    </main>
  );
}
