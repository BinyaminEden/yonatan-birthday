import { Countdown } from "./countdown";
import { EVENT_DATE_ISO } from "@/lib/constants";
import { SlothPilot } from "./sloth-pilot";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-forest-900 via-forest-800 to-forest-700 text-cream-50">
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
           style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <div className="relative max-w-6xl mx-auto px-5 py-14 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1 text-right">
          <div className="inline-flex items-center gap-2 bg-forest-700/70 border border-forest-600 rounded-full px-4 py-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-rescue-500 animate-slow-pulse" />
            משימת יום הולדת • 22.4.2026
          </div>
          <div className="mt-4 text-honey-400 text-sm font-medium">הכירו את הגיבור שלנו</div>
          <h1 className="mt-2 text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight">
            <span className="block">יונתן</span>
            <span className="block text-honey-400">בן 3</span>
            <span className="block text-2xl sm:text-3xl font-bold mt-2">
              המשימה יוצאת לדרך! <span className="inline-block">🦥✈️</span>
            </span>
          </h1>
          <p className="mt-5 text-cream-100/90 leading-relaxed max-w-xl">
            הטייס הכי חמוד בג'ונגל חוגג יום הולדת.
            <br />
            העיזו להצטרף למשימת הברכות — העלו תמונה, סרטון או מילה חמה שתשמח את הלב של יונתן.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#blessing"
              className="inline-flex items-center gap-2 bg-rescue-500 hover:bg-rescue-600 transition text-cream-50 font-bold px-5 py-3 rounded-xl shadow-lg shadow-black/20"
            >
              ✉️ שלחו ברכה ליונתן
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 bg-transparent border border-cream-100/40 hover:bg-cream-100/10 transition px-5 py-3 rounded-xl"
            >
              הסיפור של יונתן
            </a>
          </div>
        </div>

        <div className="order-1 md:order-2 relative flex justify-center">
          <div className="relative w-[280px] sm:w-[360px] md:w-[440px] animate-bob">
            <div className="relative rounded-[2rem] overflow-hidden border-4 border-honey-400/50 shadow-2xl shadow-black/30">
              <SlothPilot priority />
            </div>
            <div className="absolute -left-4 -top-4 bg-honey-400 text-forest-900 rounded-full w-20 h-20 flex flex-col items-center justify-center font-extrabold shadow-xl rotate-[-8deg] z-10">
              <span className="text-xs">תג</span>
              <span className="text-3xl leading-none">3</span>
            </div>
            <div className="absolute -bottom-3 right-2 bg-forest-900/90 border border-honey-400/40 rounded-xl px-3 py-1.5 text-xs text-cream-100 z-10">
              <div className="text-honey-400 font-bold">יחידת חילוץ</div>
              <div>מבצע יונתן</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-5 pb-14">
        <div className="bg-forest-900/60 backdrop-blur border border-forest-600 rounded-2xl p-5 sm:p-6">
          <div className="text-center text-honey-400 text-sm mb-3">ההמראה מתחילה בעוד:</div>
          <Countdown targetIso={EVENT_DATE_ISO} />
        </div>
      </div>

      <svg className="block w-full h-10 text-cream-50" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
        <path fill="currentColor" d="M0 30 Q 360 60 720 30 T 1440 30 V 60 H 0 Z" />
      </svg>
    </section>
  );
}
