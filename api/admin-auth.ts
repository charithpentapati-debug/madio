// Vercel serverless function (Node.js runtime).
// Verifies the admin upload password and issues a short-lived signed session
// token. The token — not the password — is what src/pages/admin/AdminUpload.tsx
// stores client-side and later presents to api/cloudinary-sign.ts.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "node:crypto";

const SESSION_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function signToken(expiresAt: number): string {
  const secret = process.env.SESSION_SIGNING_SECRET;
  if (!secret) throw new Error("SESSION_SIGNING_SECRET is not configured");
  const hmac = crypto.createHmac("sha256", secret).update(String(expiresAt)).digest("hex");
  return `${expiresAt}.${hmac}`;
}

// Constant-time-safe comparison of two strings of possibly different length.
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a comparison of equal-length buffers so the response time
    // doesn't leak the correct password's length via early return.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expectedPassword = process.env.ADMIN_UPLOAD_PASSWORD;
  if (!expectedPassword) {
    return res.status(500).json({ error: "Admin password is not configured" });
  }

  const { password } = (req.body ?? {}) as { password?: unknown };
  if (typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ error: "Missing password" });
  }

  if (!safeEqual(password, expectedPassword)) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const expiresAt = Date.now() + SESSION_TTL_MS;
  const token = signToken(expiresAt);
  return res.status(200).json({ token, expiresAt });
}
