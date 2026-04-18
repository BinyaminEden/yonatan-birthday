"use client";

import { useRef, useState } from "react";

export function BlessingForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<
    { kind: "idle" } | { kind: "ok" } | { kind: "err"; msg: string }
  >({ kind: "idle" });
  const [fileLabel, setFileLabel] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setState({ kind: "idle" });

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/blessings", { method: "POST", body: fd });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `שגיאה (${res.status})`);
      }
      setState({ kind: "ok" });
      form.reset();
      setFileLabel(null);
      // Soft refresh of feed
      setTimeout(() => window.location.reload(), 1100);
    } catch (err) {
      setState({ kind: "err", msg: err instanceof Error ? err.message : "שגיאה" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      id="blessing"
      className="bg-cream-100 border border-cream-200 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 text-forest-600 text-sm font-medium mb-2">
        <span>🧳</span>
        <span>תא המטען</span>
      </div>
      <h3 className="text-2xl font-extrabold text-forest-900">שלחו ברכה ליונתן</h3>
      <p className="text-ink-500 text-sm mt-1">כל ברכה ממריאה ישר ללב שלו 💚</p>

      <label className="block mt-5">
        <span className="text-sm font-medium text-forest-900">השם שלך</span>
        <input
          name="name"
          required
          maxLength={80}
          placeholder="איך קוראים לך?"
          className="mt-1 w-full bg-cream-50 border border-cream-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none rounded-xl px-4 py-3"
        />
      </label>

      <label className="block mt-4">
        <span className="text-sm font-medium text-forest-900">הברכה שלך</span>
        <textarea
          name="message"
          required
          rows={4}
          maxLength={1000}
          placeholder="כתבו מה שאתם מרגישים כלפי יונתן... מה הוא הילד הכי מיוחד בעולם?"
          className="mt-1 w-full bg-cream-50 border border-cream-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none rounded-xl px-4 py-3 resize-none"
        />
      </label>

      <label className="block mt-4">
        <span className="text-sm font-medium text-forest-900">צרפו תמונה או סרטון (לא חובה)</span>
        <div className="mt-1 border-2 border-dashed border-cream-200 hover:border-forest-600/60 rounded-xl p-6 text-center cursor-pointer bg-cream-50">
          <input
            type="file"
            name="media"
            accept="image/*,video/mp4,video/webm"
            className="sr-only"
            id="media-input"
            onChange={(e) => setFileLabel(e.target.files?.[0]?.name ?? null)}
          />
          <label htmlFor="media-input" className="cursor-pointer block">
            <div className="text-3xl">📎</div>
            <div className="mt-1 text-sm text-ink-700">
              {fileLabel ?? "גררו לכאן או לחצו להעלאה"}
            </div>
            <div className="mt-2 text-xs text-ink-500">🖼️ תמונה • 🎬 סרטון</div>
          </label>
        </div>
      </label>

      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={busy}
        className="mt-5 w-full bg-rescue-500 hover:bg-rescue-600 disabled:opacity-60 transition text-cream-50 font-bold py-3 rounded-xl"
      >
        {busy ? "שולח..." : "✈️ שלחו את הברכה"}
      </button>

      {state.kind === "ok" && (
        <div className="mt-3 text-sm text-forest-700 bg-forest-500/10 border border-forest-500/30 rounded-lg px-3 py-2">
          הברכה נחתה בבסיס! תודה 💚
        </div>
      )}
      {state.kind === "err" && (
        <div className="mt-3 text-sm text-rescue-600 bg-rescue-500/10 border border-rescue-500/30 rounded-lg px-3 py-2">
          {state.msg}
        </div>
      )}
    </form>
  );
}
