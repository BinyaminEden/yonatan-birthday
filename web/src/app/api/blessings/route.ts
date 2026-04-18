import { NextRequest } from "next/server";
import { getServerClient, STORAGE_BUCKET, hasSupabaseConfig } from "@/lib/supabase";
import { allowRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 25 * 1024 * 1024;

function clientIp(req: NextRequest): string {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  if (!hasSupabaseConfig() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json(
      { error: "השרת עדיין לא מחובר למסד הנתונים. נסו שוב בעוד רגע." },
      { status: 503 },
    );
  }

  const ip = clientIp(req);
  if (!allowRequest(ip)) {
    return Response.json(
      { error: "רגע רגע — נסו שוב בעוד דקה 🙂" },
      { status: 429 },
    );
  }

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return Response.json({ error: "טופס לא תקין" }, { status: 400 });
  }

  // honeypot
  if ((fd.get("company") ?? "").toString().trim() !== "") {
    return Response.json({ ok: true });
  }

  const name = (fd.get("name") ?? "").toString().trim();
  const message = (fd.get("message") ?? "").toString().trim();
  const file = fd.get("media");

  if (!name || name.length > 80) {
    return Response.json({ error: "שם לא תקין" }, { status: 400 });
  }
  if (!message || message.length > 1000) {
    return Response.json({ error: "ברכה לא תקינה" }, { status: 400 });
  }

  let media_url: string | null = null;
  let media_type: "image" | "video" | null = null;

  const supabase = getServerClient();

  if (file && file instanceof File && file.size > 0) {
    if (file.size > MAX_BYTES) {
      return Response.json({ error: "הקובץ גדול מדי (מקס' 25MB)" }, { status: 400 });
    }
    const mime = file.type || "application/octet-stream";
    if (mime.startsWith("image/")) media_type = "image";
    else if (mime.startsWith("video/")) media_type = "video";
    else return Response.json({ error: "סוג קובץ לא נתמך" }, { status: 400 });

    const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().slice(0, 6);
    const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const up = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, bytes, { contentType: mime, upsert: false });
    if (up.error) {
      return Response.json({ error: "העלאת הקובץ נכשלה" }, { status: 500 });
    }
    const pub = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(up.data.path);
    media_url = pub.data.publicUrl;
  }

  const insert = await supabase
    .from("blessings")
    .insert({ name, message, media_url, media_type, approved: true })
    .select("id")
    .single();

  if (insert.error) {
    return Response.json({ error: "שמירת הברכה נכשלה" }, { status: 500 });
  }

  return Response.json({ ok: true, id: insert.data.id });
}

export async function GET() {
  if (!hasSupabaseConfig()) return Response.json({ blessings: [] });
  try {
    const supabase = getServerClient();
    const { data, error } = await supabase
      .from("blessings")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return Response.json({ blessings: data ?? [] });
  } catch {
    return Response.json({ blessings: [] });
  }
}
