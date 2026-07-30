// Shared by every authenticated admin endpoint (cloudinary-sign, list-photos,
// delete-photo, assign-code). Underscore-prefixed folder — Vercel excludes
// `_lib` from routing, so this is a plain shared module, not an endpoint.
import crypto from "node:crypto";

export function verifySessionToken(token: unknown): boolean {
  if (typeof token !== "string") return false;

  const [expiresAtStr, hmac] = token.split(".");
  if (!expiresAtStr || !hmac) return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const secret = process.env.SESSION_SIGNING_SECRET;
  if (!secret) return false;

  const expected = crypto.createHmac("sha256", secret).update(expiresAtStr).digest("hex");
  const a = Buffer.from(hmac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
