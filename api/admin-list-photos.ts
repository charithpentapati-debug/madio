// Lists the current photos in a category folder, including each one's
// permanently-assigned product code (read straight from Cloudinary context —
// no recomputation, so this always reflects exactly what's live).
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySessionToken } from "../api-lib/session.js";
import { listCategoryAssets } from "../api-lib/cloudinaryAdmin.js";
import { isFurnitureCategoryId } from "../shared/furnitureCategories.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, category } = (req.body ?? {}) as { token?: unknown; category?: unknown };

  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (typeof category !== "string" || !isFurnitureCategoryId(category)) {
    return res.status(400).json({ error: "Unknown category" });
  }

  try {
    const assets = await listCategoryAssets(category);
    // Assets without a code yet (shouldn't normally happen, but a legacy or
    // interrupted upload could lack one) sort to the end rather than crash.
    assets.sort((a, b) => {
      if (!a.productCode && !b.productCode) return 0;
      if (!a.productCode) return 1;
      if (!b.productCode) return -1;
      return a.productCode.localeCompare(b.productCode);
    });
    return res.status(200).json({ assets });
  } catch (err) {
    console.error("[admin-list-photos] Error:", err);
    return res.status(500).json({ error: "Failed to list photos" });
  }
}
