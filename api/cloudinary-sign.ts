// Vercel serverless function (Node.js runtime).
// Called by the Cloudinary Upload Widget's `uploadSignature` callback for
// every upload attempt. This is the ONLY place CLOUDINARY_API_SECRET is used —
// it never reaches the client bundle. Requests must present a valid session
// token (issued by api/admin-auth.ts after a correct password), and any
// `folder` param must be one of the real furniture category ids, so an
// unauthenticated caller can't obtain a usable signature no matter what they
// send Cloudinary directly.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "node:crypto";
import { isFurnitureCategoryId } from "../shared/furnitureCategories.js";
import { verifySessionToken } from "../api-lib/session.js";

// Cloudinary's signing algorithm: sort params alphabetically, join as
// key=value&key=value, append the API secret, SHA-1 hash the result.
function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, paramsToSign } = (req.body ?? {}) as {
    token?: unknown;
    paramsToSign?: Record<string, string | number>;
  };

  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!paramsToSign || typeof paramsToSign !== "object") {
    return res.status(400).json({ error: "Missing paramsToSign" });
  }

  const folder = paramsToSign.folder;
  if (typeof folder === "string" && !isFurnitureCategoryId(folder)) {
    return res.status(400).json({ error: "Unknown category folder" });
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    return res.status(500).json({ error: "Cloudinary is not configured" });
  }

  const signature = signCloudinaryParams(paramsToSign, apiSecret);
  return res.status(200).json({ signature });
}
