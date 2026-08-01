// Deletes a single photo by its Cloudinary public ID, then triggers the same
// rebuild as an upload does. publicId's folder prefix must be a real
// category from EITHER vertical (Furniture or Doors & Windows) — rejects
// anything outside that, so this can't be used to delete assets elsewhere in
// the Cloudinary account even by an authenticated caller.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySessionToken } from "../api-lib/session.js";
import { deleteAsset } from "../api-lib/cloudinaryAdmin.js";
import { triggerRebuild } from "../api-lib/deployHook.js";
import { isKnownCategoryId } from "../shared/verticals.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, publicId } = (req.body ?? {}) as { token?: unknown; publicId?: unknown };

  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (typeof publicId !== "string" || !publicId.includes("/")) {
    return res.status(400).json({ error: "Invalid publicId" });
  }

  const folder = publicId.slice(0, publicId.lastIndexOf("/"));
  if (!isKnownCategoryId(folder)) {
    return res.status(400).json({ error: "publicId is not in a recognised category folder" });
  }

  try {
    await deleteAsset(publicId);
    await triggerRebuild();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[admin-delete-photo] Error:", err);
    return res.status(500).json({ error: "Failed to delete photo" });
  }
}
