"use client";

import { useEffect, useMemo, useState } from "react";

const MAX_BYTES = 500 * 1024 * 1024;
const MAX_FILES = 20;

type Pending = {
  file: File;
  previewUrl: string;
  kind: "image" | "video";
  progress: number; // 0..1
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
  mediaUrl?: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function uploadOne(p: Pending, onProgress: (pct: number) => void): Promise<string> {
  const signRes = await fetch("/api/upload-url", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ contentType: p.file.type, size: p.file.size, filename: p.file.name }),
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
    xhr.setRequestHeader("Content-Type", p.file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`העלאה נכשלה (${xhr.status})`));
    xhr.onerror = () => reject(new Error("העלאה נכשלה — בעיית רשת"));
    xhr.send(p.file);
  });

  return publicUrl;
}

export function PartyAlbumUpload() {
  const [pending, setPending] = useState<Pending[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "ok"; count: number }
    | { kind: "err"; msg: string }
  >({ kind: "idle" });

  useEffect(() => {
    return () => {
      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
    // we intentionally only cleanup on unmount; individual items are revoked on clear
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPickFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const room = MAX_FILES - pending.length;
    const picked = Array.from(files).slice(0, room);

    const valid: Pending[] = [];
    const errors: string[] = [];
    for (const f of picked) {
      const kind: "image" | "video" | null = f.type.startsWith("image/")
        ? "image"
        : f.type.startsWith("video/")
        ? "video"
        : null;
      if (!kind) {
        errors.push(`${f.name}: סוג לא נתמך`);
        continue;
      }
      if (f.size > MAX_BYTES) {
        errors.push(`${f.name}: גדול מדי (מקס' 500MB)`);
        continue;
      }
      valid.push({
        file: f,
        previewUrl: URL.createObjectURL(f),
        kind,
        progress: 0,
        status: "queued",
      });
    }

    if (valid.length > 0) {
      setPending((prev) => [...prev, ...valid]);
      setState({ kind: "idle" });
    }
    if (errors.length > 0) {
      setState({ kind: "err", msg: errors.join(" • ") });
    }
  }

  function removeAt(idx: number) {
    setPending((prev) => {
      const next = [...prev];
      const [removed] = next.splice(idx, 1);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
  }

  function clearAll() {
    pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPending([]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || pending.length === 0) return;
    const form = e.currentTarget;
    const company = (new FormData(form).get("company") ?? "").toString();
    setBusy(true);
    setState({ kind: "idle" });

    const uploaded: { mediaUrl: string; mediaType: "image" | "video" }[] = [];
    let hadError = false;

    // Upload serially to keep bandwidth reasonable and show per-file progress.
    for (let i = 0; i < pending.length; i++) {
      const p = pending[i];
      if (p.status === "done") {
        uploaded.push({ mediaUrl: p.mediaUrl!, mediaType: p.kind });
        continue;
      }
      try {
        setPending((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], status: "uploading", progress: 0, error: undefined };
          return next;
        });
        const mediaUrl = await uploadOne(p, (pct) => {
          setPending((prev) => {
            const next = [...prev];
            if (next[i]) next[i] = { ...next[i], progress: pct };
            return next;
          });
        });
        setPending((prev) => {
          const next = [...prev];
          if (next[i]) next[i] = { ...next[i], status: "done", progress: 1, mediaUrl };
          return next;
        });
        uploaded.push({ mediaUrl, mediaType: p.kind });
      } catch (err) {
        hadError = true;
        setPending((prev) => {
          const next = [...prev];
          if (next[i])
            next[i] = {
              ...next[i],
              status: "error",
              error: err instanceof Error ? err.message : "שגיאה",
            };
          return next;
        });
      }
    }

    if (uploaded.length > 0) {
      try {
        const res = await fetch("/api/album", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ items: uploaded, uploaderName, company }),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error ?? `שגיאה (${res.status})`);
        }
        setState({ kind: "ok", count: uploaded.length });
        setTimeout(() => window.location.reload(), 1400);
      } catch (err) {
        setState({ kind: "err", msg: err instanceof Error ? err.message : "שגיאה" });
      }
    } else if (hadError) {
      setState({ kind: "err", msg: "חלק מההעלאות נכשלו — נסו שוב" });
    }

    setBusy(false);
  }

  const totalBytes = useMemo(
    () => pending.reduce((s, p) => s + p.file.size, 0),
    [pending],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-cream-100 border border-cream-200 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 text-forest-600 text-sm font-medium mb-2">
        <span>📸</span>
        <span>אלבום המסיבה</span>
      </div>
      <h3 className="text-2xl font-extrabold text-forest-900">הוסיפו תמונות וסרטונים מהמסיבה</h3>
      <p className="text-ink-500 text-sm mt-1">
        ביום המסיבה — או אחריה — תנו לכולם לחיות את הרגעים מחדש. ניתן להעלות עד {MAX_FILES} קבצים בבת אחת.
      </p>

      <label className="block mt-5">
        <span className="text-sm font-medium text-forest-900">השם שלך (לא חובה)</span>
        <input
          type="text"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          maxLength={80}
          placeholder="מי צילם?"
          className="mt-1 w-full bg-cream-50 border border-cream-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none rounded-xl px-4 py-3"
        />
      </label>

      <label
        htmlFor="album-input"
        className="mt-4 block border-2 border-dashed border-cream-200 hover:border-forest-600/60 rounded-xl p-6 text-center cursor-pointer bg-cream-50"
      >
        <div className="text-3xl">📎</div>
        <div className="mt-1 text-sm text-ink-700">לחצו לבחירת תמונות וסרטונים</div>
        <div className="mt-2 text-xs text-ink-500">
          🖼️ תמונות • 🎬 סרטונים (עד 500MB לכל קובץ, עד {MAX_FILES} בבת אחת)
        </div>
      </label>
      <input
        id="album-input"
        type="file"
        accept="image/*,video/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          onPickFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {pending.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-ink-700">
            <span className="font-medium">
              {pending.length} קבצים • {formatSize(totalBytes)}
            </span>
            <button
              type="button"
              onClick={clearAll}
              className="text-rescue-600 hover:text-rescue-700 font-medium"
              disabled={busy}
            >
              נקו הכל
            </button>
          </div>

          <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pending.map((p, i) => (
              <li
                key={p.previewUrl}
                className="relative rounded-xl overflow-hidden border border-cream-200 bg-cream-50"
              >
                <div className="relative aspect-square">
                  {p.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.previewUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={p.previewUrl}
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover bg-black"
                    />
                  )}
                  {p.status === "uploading" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold">
                      {Math.round(p.progress * 100)}%
                    </div>
                  )}
                  {p.status === "done" && (
                    <div className="absolute inset-0 bg-forest-600/70 flex items-center justify-center text-white text-2xl">
                      ✓
                    </div>
                  )}
                  {p.status === "error" && (
                    <div className="absolute inset-0 bg-rescue-500/80 flex items-center justify-center text-white p-2 text-xs text-center">
                      {p.error ?? "שגיאה"}
                    </div>
                  )}
                  {!busy && (
                    <button
                      type="button"
                      onClick={() => removeAt(i)}
                      aria-label="הסר"
                      className="absolute top-1 start-1 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="px-2 py-1.5 text-[11px] text-ink-500 truncate">
                  {p.file.name} · {formatSize(p.file.size)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

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
        disabled={busy || pending.length === 0}
        className="mt-5 w-full bg-rescue-500 hover:bg-rescue-600 disabled:opacity-60 transition text-cream-50 font-bold py-3 rounded-xl"
      >
        {busy ? "מעלה..." : `📸 הוסיפו ${pending.length || ""} לאלבום`}
      </button>

      {state.kind === "ok" && (
        <div className="mt-3 text-sm text-forest-700 bg-forest-500/10 border border-forest-500/30 rounded-lg px-3 py-2">
          נהדר! {state.count} קבצים נוספו לאלבום 🎉
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
