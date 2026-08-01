// Lists the current photos in a category folder, including each one's
// permanently-assigned product code (read straight from Cloudinary context —
// no recomputation, so this always reflects exactly what's live).
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySessionToken } from "../api-lib/session.js";
import { listCategoryAssets } from "../api-lib/cloudinaryAdmin.js";
import { isKnownCategoryIdAsync } from "../api-lib/categoryValidation.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, category } = (req.body ?? {}) as { token?: unknown; category?: unknown };

  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (typeof category !== "string" || !(await isKnownCategoryIdAsync(category))) {
    return res.status(400).json({ error: "Unknown category" });
  }

  try {
    const assets = await listCategoryAssets(category);
    // Most recently uploaded first — sorted by Cloudinary's own creation
    // timestamp, not product code. Code order and upload order should
    // normally match, but the timestamp is the more correct source of
    // truth (and the only one guaranteed unaffected by the duplicate-code
    // race condition this replaces relying on).
    assets.sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
    return res.status(200).json({ assets });
  } catch (err) {
    console.error("[admin-list-photos] Error:", err);
    return res.status(500).json({ error: "Failed to list photos" });
  }
}
