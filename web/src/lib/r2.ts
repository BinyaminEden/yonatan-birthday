import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

export const R2_BUCKET = process.env.R2_BUCKET ?? "";
export const R2_PUBLIC_BASE = (process.env.R2_PUBLIC_BASE ?? "").replace(/\/$/, "");

export function hasR2Config() {
  return Boolean(accountId && accessKeyId && secretAccessKey && R2_BUCKET && R2_PUBLIC_BASE);
}

export function getR2Client() {
  if (!hasR2Config()) throw new Error("R2 env vars missing");
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
    // R2's wildcard TLS cert covers only *.r2.cloudflarestorage.com, so use
    // path-style URLs (accountId.r2.cloudflarestorage.com/bucket/key).
    forcePathStyle: true,
    // R2 doesn't support the CRC32 checksum the newer AWS SDK adds by default.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

export function publicUrlFor(key: string): string {
  return `${R2_PUBLIC_BASE}/${encodeURI(key)}`;
}
