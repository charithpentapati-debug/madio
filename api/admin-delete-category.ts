// Category management, Phase D — deletes an admin-created (dynamic) category.
// Static categories (shared/furnitureCategories.ts, shared/doorsWindowsCategories.ts —
// the ones with real PDF-sourced catalogue data) can NEVER be deleted through
// this endpoint: it only ever looks the category up in the dynamic store
// (api-lib/dynamicCategories.ts), and static categories were never written
// there in the first place. There's no code path here that could touch
// shared/*.ts at all.
//
// Real guardrails, given the near-miss that started this whole category-
// management feature (client accidentally deleted real catalogued photos
// while confused by a duplicate-code bug):
//   - the admin must type the category's exact display name to confirm —
//     not just click a "yes" button
//   - the response reports exactly how many photos were deleted, so the
//     admin panel can show that count BEFORE the irreversible click (the
//     frontend already has this category's photo list loaded from
//     admin-list-photos, so it shows the count pre-flight; this endpoint's
//     own count in the response is the authoritative post-flight number)
// Deletes the category's photos too (not just the metadata entry) — leaving
// a pile of orphaned images in a Cloudinary folder with no category pointing
// at it is a worse outcome than a clean deletion, and the confirm step
// above is what makes that safe to do without asking twice.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySessionToken } from "../api-lib/session.js";
import { getDynamicCategories, removeDynamicCategory } from "../api-lib/dynamicCategories.js";
import { listCategoryAssets, deleteAssets } from "../api-lib/cloudinaryAdmin.js";
import { triggerRebuild } from "../api-lib/deployHook.js";
import type { Vertical } from "../shared/verticals.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, vertical, categoryId, confirmName } = (req.body ?? {}) as {
    token?: unknown;
    vertical?: unknown;
    categoryId?: unknown;
    confirmName?: unknown;
  };

  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (vertical !== "furniture" && vertical !== "doors-windows") {
    return res.status(400).json({ error: "vertical must be \"furniture\" or \"doors-windows\"" });
  }
  if (typeof categoryId !== "string" || categoryId.length === 0) {
    return res.status(400).json({ error: "categoryId is required" });
  }
  if (typeof confirmName !== "string" || confirmName.length === 0) {
    return res.status(400).json({ error: "confirmName is required" });
  }

  try {
    const dynamicCategories = await getDynamicCategories(vertical as Vertical);
    const category = dynamicCategories.find((c) => c.id === categoryId);
    // Covers two cases at once: the id doesn't exist at all, and the id
    // belongs to a STATIC category — neither is ever in this list, so both
    // fail identically here. A static category id can't reach any further.
    if (!category) {
      return res.status(404).json({ error: `"${categoryId}" is not a deletable category` });
    }
    if (confirmName !== category.name) {
      return res.status(400).json({ error: "Confirmation text does not match the category name" });
    }

    const assets = await listCategoryAssets(category.id);
    if (assets.length > 0) {
      await deleteAssets(assets.map((a) => a.publicId));
    }

    await removeDynamicCategory(category.vertical, category.id);
    // Direct trigger, same reasoning as admin-create-category.ts — this is a
    // rare admin action, not a per-photo one, so it doesn't reproduce the
    // quota-burn problem the per-photo webhook-only approach exists to avoid.
    await triggerRebuild();

    return res.status(200).json({ success: true, deletedPhotoCount: assets.length });
  } catch (err) {
    console.error("[admin-delete-category] Error:", err);
    return res.status(500).json({ error: "Failed to delete category" });
  }
}
