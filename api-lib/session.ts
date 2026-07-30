// Shared by every authenticated admin endpoint (cloudinary-sign, list-photos,
// delete-photo, assign-code). Lives outside api/ deliberately — Vercel
// excludes `api/_lib/*` from the deployed function bundle entirely (not
// just from routing), which broke this in production; a sibling top-level
// folder works the same way shared/ already does for the api/ functions.
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
