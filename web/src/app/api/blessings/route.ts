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
    return Response.json(
      { error: "השרת עדיין לא מחובר למסד הנתונים. נסו שוב בעוד רגע." },
      { status: 503 },
    );
  }

  const ip = clientIp(req);
  if (!allowRequest(ip)) {
    return Response.json({ error: "רגע רגע — נסו שוב בעוד דקה 🙂" }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as
    | {
        name?: string;
        message?: string;
        mediaUrl?: string | null;
        mediaType?: "image" | "video" | null;
        company?: string;
      }
    | null;
  if (!body) return Response.json({ error: "טופס לא תקין" }, { status: 400 });

  if ((body.company ?? "").trim() !== "") {
    return Response.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || name.length > 80) return Response.json({ error: "שם לא תקין" }, { status: 400 });
  if (!message || message.length > 1000) return Response.json({ error: "ברכה לא תקינה" }, { status: 400 });

  let media_url: string | null = null;
  let media_type: "image" | "video" | null = null;
  if (body.mediaUrl) {
    if (!isAllowedMediaUrl(body.mediaUrl)) {
      return Response.json({ error: "כתובת מדיה לא חוקית" }, { status: 400 });
    }
    if (body.mediaType !== "image" && body.mediaType !== "video") {
      return Response.json({ error: "סוג מדיה לא חוקי" }, { status: 400 });
    }
    media_url = body.mediaUrl;
    media_type = body.mediaType;
  }

  const supabase = getServerClient();
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
