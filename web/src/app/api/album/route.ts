import { NextRequest } from "next/server";
import { getServerClient, hasSupabaseConfig } from "@/lib/supabase";
import { allowRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isAllowedMediaUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return u.hostname.endsWith(".r2.dev") || u.hostname.endsWith(".r2.cloudflarestorage.com");
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!hasSupabaseConfig() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ error: "השרת עדיין לא מחובר למסד הנתונים." }, { status: 503 });
  }

  const ip = clientIp(req);
  if (!allowRequest(ip)) {
    return Response.json({ error: "רגע רגע — נסו שוב בעוד דקה 🙂" }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as
    | {
        items?: { mediaUrl: string; mediaType: "image" | "video" }[];
        uploaderName?: string | null;
        company?: string;
      }
    | null;
  if (!body) return Response.json({ error: "טופס לא תקין" }, { status: 400 });

  if ((body.company ?? "").trim() !== "") {
    return Response.json({ ok: true });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) return Response.json({ error: "לא נבחרו קבצים" }, { status: 400 });
  if (items.length > 20) return Response.json({ error: "מקסימום 20 קבצים בבת אחת" }, { status: 400 });

  for (const it of items) {
    if (!isAllowedMediaUrl(it.mediaUrl)) {
      return Response.json({ error: "כתובת מדיה לא חוקית" }, { status: 400 });
    }
    if (it.mediaType !== "image" && it.mediaType !== "video") {
      return Response.json({ error: "סוג מדיה לא חוקי" }, { status: 400 });
    }
  }

  const uploaderName = (body.uploaderName ?? "").toString().trim().slice(0, 80) || null;

  const rows = items.map((it) => ({
    media_url: it.mediaUrl,
    media_type: it.mediaType,
    uploader_name: uploaderName,
    approved: true,
  }));

  const supabase = getServerClient();
  const insert = await supabase.from("album_items").insert(rows).select("id");
  if (insert.error) {
    return Response.json({ error: "שמירה נכשלה" }, { status: 500 });
  }

  return Response.json({ ok: true, count: insert.data?.length ?? 0 });
}

export async function GET() {
  if (!hasSupabaseConfig()) return Response.json({ items: [] });
  try {
    const supabase = getServerClient();
    const { data, error } = await supabase
      .from("album_items")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return Response.json({ items: data ?? [] });
  } catch {
    return Response.json({ items: [] });
  }
}
