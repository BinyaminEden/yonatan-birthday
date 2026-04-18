"use client";

import { useRef, useState } from "react";

const MAX_BYTES = 500 * 1024 * 1024;

type Status =
  | { kind: "idle" }
  | { kind: "ok" }
  | { kind: "err"; msg: string }
  | { kind: "uploading"; progress: number };

export function BlessingForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<Status>({ kind: "idle" });
  const [file, setFile] = useState<File | null>(null);

  async function uploadFile(f: File): Promise<{ url: string; type: "image" | "video" }> {
    const type: "image" | "video" | null = f.type.startsWith("image/")
      ? "image"
      : f.type.startsWith("video/")
      ? "video"
      : null;
    if (!type) throw new Error("סוג קובץ לא נתמך");
    if (f.size > MAX_BYTES) throw new Error("הקובץ גדול מדי (מקס' 500MB)");

    const signRes = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contentType: f.type, size: f.size, filename: f.name }),
    });
    if (!signRes.ok) {
      const j = (await signRes.json().catch(() => ({}))) as { error?: string };
      throw new Error(j.error ?? "שגיאה ביצירת קישור העלאה");
    }
    const { uploadUrl, publicUrl } = (await signRes.json()) as {
      uploadUrl: string;
      publicUrl: string;
    };

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", f.type);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setState({ kind: "uploading", progress: e.loaded / e.total });
        }
      };
      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve()
          : reject(new Error(`העלאה נכשלה (${xhr.status})`));
      xhr.onerror = () => reject(new Error("העלאה נכשלה — בעיית רשת"));
      xhr.send(f);
    });

    return { url: publicUrl, type };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setState({ kind: "idle" });

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get("name") ?? "").toString().trim();
    const message = (fd.get("message") ?? "").toString().trim();
    const company = (fd.get("company") ?? "").toString();

    try {
      let mediaUrl: string | null = null;
      let mediaType: "image" | "video" | null = null;
      if (file) {
        const { url, type } = await uploadFile(file);
        mediaUrl = url;
        mediaType = type;
      }

      const res = await fetch("/api/blessings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, message, mediaUrl, mediaType, company }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `שגיאה (${res.status})`);
      }

      setState({ kind: "ok" });
      form.reset();
      setFile(null);
      setTimeout(() => window.location.reload(), 1100);
    } catch (err) {
      setState({ kind: "err", msg: err instanceof Error ? err.message : "שגיאה" });
    } finally {
      setBusy(false);
    }
  }

  const uploadPct =
    state.kind === "uploading" ? Math.round(state.progress * 100) : null;

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
            accept="image/*,video/*"
            className="sr-only"
            id="media-input"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <label htmlFor="media-input" className="cursor-pointer block">
            <div className="text-3xl">📎</div>
            <div className="mt-1 text-sm text-ink-700">
              {file ? file.name : "גררו לכאן או לחצו להעלאה"}
            </div>
            <div className="mt-2 text-xs text-ink-500">🖼️ תמונה • 🎬 סרטון (עד 500MB)</div>
          </label>
        </div>
      </label>

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
        {busy
          ? uploadPct !== null
            ? `מעלה קובץ... ${uploadPct}%`
            : "שולח..."
          : "✈️ שלחו את הברכה"}
      </button>

      {uploadPct !== null && busy && (
        <div className="mt-3 h-2 bg-cream-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-forest-600 transition-all"
            style={{ width: `${uploadPct}%` }}
          />
        </div>
      )}

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
