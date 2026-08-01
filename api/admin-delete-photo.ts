// Deletes one or more photos by Cloudinary public ID, in a single Cloudinary
// API call (see api-lib/cloudinaryAdmin.ts's deleteAssets — this is what
// backs both the single-photo Delete button and the "select multiple, delete
// together" bulk action on /admin/upload). Every publicId's folder prefix
// must be a real category from EITHER vertical (Furniture or Doors &
// Windows) — rejects the WHOLE request if any one of them isn't, so this
// can't be used to delete assets elsewhere in the Cloudinary account even by
// an authenticated caller, and a typo'd id can't silently drag the rest of
// a batch through. No direct rebuild trigger here — Cloudinary's
// account-level webhook (Console → Settings → Upload → Notification URL)
// fires for this delete independently and is the SOLE rebuild trigger; see
// api-lib/deployHook.ts's triggerRebuild() for why this was removed.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySessionToken } from "../api-lib/session.js";
import { deleteAssets } from "../api-lib/cloudinaryAdmin.js";
import { isKnownCategoryIdAsync } from "../api-lib/categoryValidation.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, publicIds } = (req.body ?? {}) as { token?: unknown; publicIds?: unknown };

  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (
    !Array.isArray(publicIds) ||
    publicIds.length === 0 ||
    publicIds.length > 100 ||
    !publicIds.every((id): id is string => typeof id === "string" && id.includes("/"))
  ) {
    return res.status(400).json({ error: "publicIds must be a non-empty array of at most 100 valid ids" });
  }

  for (const publicId of publicIds) {
    const folder = publicId.slice(0, publicId.lastIndexOf("/"));
    if (!(await isKnownCategoryIdAsync(folder))) {
      return res.status(400).json({ error: `"${publicId}" is not in a recognised category folder` });
    }
  }

  try {
    const result = await deleteAssets(publicIds);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error("[admin-delete-photo] Error:", err);
    return res.status(500).json({ error: "Failed to delete photos" });
  }
}
