// Category management, Phase A — creates a new admin-managed category.
// Stored as a Cloudinary-hosted JSON entry (see api-lib/dynamicCategories.ts
// for why — no database, no GitHub-write access to commit into
// shared/furnitureCategories.ts / shared/doorsWindowsCategories.ts directly).
// A newly-created category has no static catalogue data by construction —
// it starts "Coming Soon" exactly like Bar Chairs or an un-populated D&W
// category, and the existing client-uploaded-photo rendering picks it up
// automatically once photos are uploaded to it, no further wiring needed.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySessionToken } from "../api-lib/session.js";
import { getDynamicCategories, addDynamicCategory, type DynamicCategory } from "../api-lib/dynamicCategories.js";
import { triggerRebuild } from "../api-lib/deployHook.js";
import { isKnownCategoryId, type Vertical } from "../shared/verticals.js";
import { categoryProductCodeConfig, doorsWindowsProductCodeConfig } from "../shared/categoryProductCodes.js";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PREFIX_PATTERN = /^[A-Z][A-Z0-9-]{1,9}$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, vertical, name, slug, prefix } = (req.body ?? {}) as {
    token?: unknown;
    vertical?: unknown;
    name?: unknown;
    slug?: unknown;
    prefix?: unknown;
  };

  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (vertical !== "furniture" && vertical !== "doors-windows") {
    return res.status(400).json({ error: "vertical must be \"furniture\" or \"doors-windows\"" });
  }
  if (typeof name !== "string" || name.trim().length === 0 || name.length > 60) {
    return res.status(400).json({ error: "name is required (max 60 characters)" });
  }
  if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
    return res.status(400).json({ error: "slug must be lowercase letters, numbers, and hyphens only (e.g. \"accent-chairs\")" });
  }
  if (typeof prefix !== "string" || !PREFIX_PATTERN.test(prefix)) {
    return res.status(400).json({ error: "prefix must start with a letter and be 2-10 characters of A-Z, 0-9, or hyphen (e.g. \"MFAC\")" });
  }

  try {
    // Slug uniqueness — checked GLOBALLY across both verticals, not just the
    // target one. Cloudinary folder names are flat, not vertical-namespaced
    // (same convention every existing category already uses), so a slug
    // re-used across verticals would mix two categories' photos into one
    // Cloudinary folder.
    if (isKnownCategoryId(slug)) {
      return res.status(409).json({ error: `"${slug}" is already a category id` });
    }
    const [dynamicFurniture, dynamicDW] = await Promise.all([
      getDynamicCategories("furniture"),
      getDynamicCategories("doors-windows"),
    ]);
    const allDynamic = [...dynamicFurniture, ...dynamicDW];
    if (allDynamic.some((c) => c.id === slug)) {
      return res.status(409).json({ error: `"${slug}" is already a category id` });
    }

    // Prefix uniqueness — also global. A collision would make
    // product-code numbering ambiguous between two categories (whichever
    // one resolveProductCodeScope's static lookup finds first, or an
    // outright numbering clash for two dynamic categories sharing a prefix).
    const staticPrefixes = [
      ...Object.values(categoryProductCodeConfig).map((c) => c.prefix),
      ...Object.values(doorsWindowsProductCodeConfig).map((c) => c.prefix),
    ];
    if (staticPrefixes.includes(prefix) || allDynamic.some((c) => c.prefix === prefix)) {
      return res.status(409).json({ error: `Product code prefix "${prefix}" is already in use` });
    }

    const category: DynamicCategory = {
      id: slug,
      name: name.trim(),
      prefix,
      vertical: vertical as Vertical,
      createdAt: new Date().toISOString(),
    };

    await addDynamicCategory(category);
    // Direct trigger here (unlike photo upload/delete, which rely solely on
    // Cloudinary's webhook to avoid doubling deploys) — category creation is
    // a rare admin action, not a per-photo one, so it doesn't reproduce the
    // quota-burn problem, and it's not certain Cloudinary's webhook even
    // fires for this raw-JSON write the same way it does for image uploads.
    await triggerRebuild();

    return res.status(200).json({ category });
  } catch (err) {
    console.error("[admin-create-category] Error:", err);
    return res.status(500).json({ error: "Failed to create category" });
  }
}
