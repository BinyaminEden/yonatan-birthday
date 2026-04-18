import { NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client, R2_BUCKET, publicUrlFor, hasR2Config } from "@/lib/r2";
import { allowRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 500 * 1024 * 1024;
const ALLOWED_PREFIXES = ["image/", "video/"];

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function safeExt(name: string | undefined): string {
  if (!name) return "bin";
  const dot = name.lastIndexOf(".");
  if (dot < 0) return "bin";
  return name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6) || "bin";
}

export async function POST(req: NextRequest) {
  if (!hasR2Config()) {
    return Response.json({ error: "Storage not configured" }, { status: 503 });
  }

  const ip = clientIp(req);
  if (!allowRequest(ip)) {
    return Response.json({ error: "רגע רגע — נסו שוב בעוד דקה 🙂" }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as
    | { contentType?: string; size?: number; filename?: string }
    | null;
  if (!body) return Response.json({ error: "bad request" }, { status: 400 });

  const contentType = (body.contentType ?? "").toString();
  const size = Number(body.size ?? 0);
  const filename = (body.filename ?? "").toString();

  if (!size || size <= 0 || size > MAX_BYTES) {
    return Response.json({ error: "הקובץ גדול מדי (מקס' 500MB)" }, { status: 400 });
  }
  if (!ALLOWED_PREFIXES.some((p) => contentType.startsWith(p))) {
    return Response.json({ error: "סוג קובץ לא נתמך" }, { status: 400 });
  }

  const ext = safeExt(filename);
  const key = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const cmd = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(getR2Client(), cmd, {
    expiresIn: 600,
    unhoistableHeaders: new Set(["content-type"]),
  });

  return Response.json({
    uploadUrl,
    publicUrl: publicUrlFor(key),
    key,
    expiresIn: 600,
  });
}
