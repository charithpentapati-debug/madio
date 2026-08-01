import React, { useCallback, useEffect, useMemo, useState } from "react";
import { furnitureCategories as staticFurnitureCategories } from "../../../shared/furnitureCategories";
import { doorsWindowsCategories as staticDoorsWindowsCategories } from "../../../shared/doorsWindowsCategories";
import { dynamicFurnitureCategories, dynamicDoorsWindowsCategories } from "../../data/dynamicCategories.generated";
import type { Vertical } from "../../../shared/verticals";
import { UploadWidget } from "../../components/admin/UploadWidget";

// Two-level selector: pick a vertical first, then a category belonging to
// it — never a single flat 21-category dropdown (9 Furniture + 12 D&W).
// Picking a vertical here is what filters/populates the category list below,
// not just a label prefix on one giant list.
const VERTICALS: { id: Vertical; label: string }[] = [
  { id: "furniture", label: "Furniture" },
  { id: "doors-windows", label: "Doors & Windows" },
];

// Merges the static baseline with admin-created (dynamic) categories fetched
// at the last build (see src/data/dynamicCategories.generated.ts) — imported
// directly rather than through src/data/furniture.ts / doorsWindows.ts to
// keep this admin page's bundle lean (those pull in the entire product
// catalogue). A category created just now won't appear here until the next
// rebuild finishes, same ~1-2 minute delay every other admin action already
// has — the success message after creating one says so explicitly.
function categoryMetaForVertical(vertical: Vertical) {
  if (vertical === "furniture") {
    return [
      ...staticFurnitureCategories,
      ...dynamicFurnitureCategories.map((dc) => ({ id: dc.id, name: dc.name })),
    ];
  }
  return [
    ...staticDoorsWindowsCategories,
    ...dynamicDoorsWindowsCategories.map((dc) => ({ id: dc.id, name: dc.name })),
  ];
}

// "Accent Chairs" -> "accent-chairs". Auto-suggested, always editable before
// creation — same pattern for the prefix suggestion below.
function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Existing prefixes in each vertical are short, hand-picked abbreviations
// (MFB, MFCT, MDW-VS...) with no single perfect formula to reverse-engineer,
// so this is a reasonable starting guess — first letter of each word (or the
// first few letters of a single word), matching each vertical's established
// "MF" + short code / "MDW-" + 2-letter code convention — not a guarantee,
// which is exactly why it stays editable rather than locked in.
function suggestPrefix(name: string, vertical: Vertical): string {
  const words = name.trim().toUpperCase().split(/\s+/).filter(Boolean);
  const letterCount = vertical === "furniture" ? 3 : 2;
  const code =
    words.length > 1
      ? words.map((w) => w[0]).join("").slice(0, letterCount)
      : (words[0] ?? "").replace(/[^A-Z]/g, "").slice(0, letterCount);
  return vertical === "furniture" ? `MF${code}` : `MDW-${code}`;
}

const SESSION_STORAGE_KEY = "madio_admin_session";

interface StoredSession {
  token: string;
  expiresAt: number;
}

function readStoredSession(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed.token || !parsed.expiresAt || parsed.expiresAt < Date.now()) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

interface CategoryPhoto {
  publicId: string;
  secureUrl: string;
  productCode?: string;
}

export const AdminUpload: React.FC = () => {
  const [session, setSession] = useState<StoredSession | null>(() => readStoredSession());
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vertical, setVertical] = useState<Vertical>("furniture");
  const [category, setCategory] = useState<string>(staticFurnitureCategories[0].id);

  const categoryOptions = useMemo(() => categoryMetaForVertical(vertical), [vertical]);

  const handleVerticalChange = (next: Vertical) => {
    setVertical(next);
    // Selecting a vertical re-populates the category dropdown with only that
    // vertical's categories — always land on a valid selection, never leave
    // a Furniture category selected while viewing Doors & Windows options.
    setCategory(categoryMetaForVertical(next)[0].id);
  };

  const [photos, setPhotos] = useState<CategoryPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosError, setPhotosError] = useState<string | null>(null);
  const [assigningCode, setAssigningCode] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryPrefix, setNewCategoryPrefix] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [prefixTouched, setPrefixTouched] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [createCategoryError, setCreateCategoryError] = useState<string | null>(null);
  const [createCategorySuccess, setCreateCategorySuccess] = useState<string | null>(null);

  const handleNewCategoryNameChange = (value: string) => {
    setNewCategoryName(value);
    if (!slugTouched) setNewCategorySlug(slugify(value));
    if (!prefixTouched) setNewCategoryPrefix(suggestPrefix(value, vertical));
  };

  const resetCreateCategoryForm = () => {
    setNewCategoryName("");
    setNewCategorySlug("");
    setNewCategoryPrefix("");
    setSlugTouched(false);
    setPrefixTouched(false);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setCreatingCategory(true);
    setCreateCategoryError(null);
    setCreateCategorySuccess(null);
    try {
      const res = await fetch("/api/admin-create-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: session.token,
          vertical,
          name: newCategoryName.trim(),
          slug: newCategorySlug,
          prefix: newCategoryPrefix,
        }),
      });
      const data = (await res.json()) as { category?: { id: string; name: string }; error?: string };
      if (!res.ok || !data.category) {
        setCreateCategoryError(data.error ?? "Could not create this category.");
        return;
      }
      setCreateCategorySuccess(
        `Created "${data.category.name}" (${data.category.id}). It'll appear in the category dropdown once the next rebuild finishes — check back in a minute or two.`,
      );
      resetCreateCategoryForm();
    } catch {
      setCreateCategoryError("Could not reach the server. Check your connection and try again.");
    } finally {
      setCreatingCategory(false);
    }
  };

  // Keep this page out of search results — it's reachable by URL only, but
  // best not to let it get indexed if a crawler ever finds it.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    document.title = "Admin Upload | MADIO";
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const fetchPhotos = useCallback(async (token: string, cat: string) => {
    setPhotosLoading(true);
    setPhotosError(null);
    try {
      const res = await fetch("/api/admin-list-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, category: cat }),
      });
      const data = (await res.json()) as { assets?: CategoryPhoto[]; error?: string };
      if (!res.ok || !data.assets) {
        setPhotosError(data.error ?? "Could not load photos for this category.");
        setPhotos([]);
        return;
      }
      setPhotos(data.assets);
    } catch {
      setPhotosError("Could not reach the server. Check your connection and try again.");
      setPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  }, []);

  // Refresh the photo list whenever we're logged in and whenever the
  // selected category changes. Selection is always category-scoped — a
  // photo picked before switching categories shouldn't carry over and get
  // deleted by mistake once the list underneath it has changed.
  useEffect(() => {
    if (session) void fetchPhotos(session.token, category);
    setSelectedIds(new Set());
  }, [session, category, fetchPhotos]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { token?: string; expiresAt?: number; error?: string };
      if (!res.ok || !data.token || !data.expiresAt) {
        setLoginError(data.error ?? "Invalid password.");
        return;
      }
      const next: StoredSession = { token: data.token, expiresAt: data.expiresAt };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
      setSession(next);
      setPassword("");
    } catch {
      setLoginError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
  };

  const handleUploaded = async (info: { secureUrl: string; publicId: string }) => {
    if (!session) return;
    // Optimistically show the new photo right away (code arrives moments later).
    setPhotos((prev) => [...prev, { publicId: info.publicId, secureUrl: info.secureUrl }]);
    setAssigningCode(true);
    try {
      const res = await fetch("/api/admin-assign-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: session.token, category, publicId: info.publicId }),
      });
      const data = (await res.json()) as { productCode?: string; error?: string };
      if (res.ok && data.productCode) {
        setPhotos((prev) =>
          prev.map((p) => (p.publicId === info.publicId ? { ...p, productCode: data.productCode } : p)),
        );
      } else {
        setPhotosError(data.error ?? "Photo uploaded, but assigning its product code failed.");
      }
    } catch {
      setPhotosError("Photo uploaded, but could not reach the server to assign its product code.");
    } finally {
      setAssigningCode(false);
      // Re-sync with Cloudinary regardless, so the list reflects reality.
      void fetchPhotos(session.token, category);
    }
  };

  const toggleSelected = (publicId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(publicId)) next.delete(publicId);
      else next.add(publicId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => (prev.size === photos.length ? new Set() : new Set(photos.map((p) => p.publicId))));
  };

  // Backs both the single-photo Delete button and the "delete selected"
  // bulk action — one photo is just a one-element array. Shows the exact
  // product codes being removed before deleting, same principle as Phase D's
  // "show exact counts of what will be lost" guardrail, just lighter-weight
  // since this is undoable data loss at photo scope, not category scope.
  const handleDeletePhotos = async (toDelete: CategoryPhoto[]) => {
    if (!session || toDelete.length === 0) return;
    const labels = toDelete.map((p) => p.productCode ?? p.publicId);
    const confirmMessage =
      toDelete.length === 1
        ? `Delete ${labels[0]}? This can't be undone.`
        : `Delete these ${toDelete.length} photos? This can't be undone.\n\n${labels.join(", ")}`;
    if (!window.confirm(confirmMessage)) return;

    const idsToDelete = toDelete.map((p) => p.publicId);
    setDeletingIds((prev) => new Set([...prev, ...idsToDelete]));
    setPhotosError(null);
    try {
      const res = await fetch("/api/admin-delete-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: session.token, publicIds: idsToDelete }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        deleted?: string[];
        notFound?: string[];
        error?: string;
      };
      if (!res.ok || !data.success) {
        setPhotosError(data.error ?? "Could not delete the selected photo(s).");
        return;
      }
      const removed = new Set([...(data.deleted ?? []), ...(data.notFound ?? [])]);
      setPhotos((prev) => prev.filter((p) => !removed.has(p.publicId)));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of removed) next.delete(id);
        return next;
      });
    } catch {
      setPhotosError("Could not reach the server. Check your connection and try again.");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        for (const id of idsToDelete) next.delete(id);
        return next;
      });
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white border border-[#EBE8E2] p-10 shadow-sm"
        >
          <h1 className="text-xl font-serif font-light text-[#16232B] mb-2">Admin Upload</h1>
          <p className="text-xs text-[#6B6B6B] font-light mb-8">
            Enter the password to upload new photos.
          </p>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-[#EBE8E2] px-4 py-3 text-sm mb-4 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] bg-[#FAFAF7] rounded-[4px]"
          />
          {loginError && (
            <p className="text-xs text-red-600 mb-4 bg-red-50 border border-red-200 px-3 py-2">
              {loginError}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || password.length === 0}
            className="w-full py-3 text-xs uppercase tracking-[0.25em] font-sans font-medium text-white transition-opacity disabled:opacity-40 hover:opacity-90"
            style={{ backgroundColor: "#D4AF37" }}
          >
            {isSubmitting ? "Checking…" : "Log In"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] px-6 py-16">
      <div className="max-w-2xl mx-auto bg-white border border-[#EBE8E2] p-10 shadow-sm">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-xl font-serif font-light text-[#16232B] mb-1">Admin Upload</h1>
            <p className="text-xs text-[#6B6B6B] font-light">
              Choose a vertical and category, then upload or remove photos. Changes go live on the
              site within 1–2 minutes.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#6B6B6B] hover:text-[#16232B] transition-colors shrink-0 ml-4"
          >
            Log Out
          </button>
        </div>

        <label className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#6B6B6B] mb-2">
          Vertical
        </label>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {VERTICALS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => handleVerticalChange(v.id)}
              aria-pressed={vertical === v.id}
              className="px-4 py-3 text-xs uppercase tracking-[0.15em] font-sans font-medium border rounded-[4px] transition-colors"
              style={
                vertical === v.id
                  ? { backgroundColor: "#D4AF37", borderColor: "#D4AF37", color: "#fff" }
                  : { backgroundColor: "#FAFAF7", borderColor: "#EBE8E2", color: "#6B6B6B" }
              }
            >
              {v.label}
            </button>
          ))}
        </div>

        <label className="block text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#6B6B6B] mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-[#EBE8E2] px-4 py-3 text-sm mb-3 bg-[#FAFAF7] rounded-[4px] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
        >
          {categoryOptions.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Always-visible confirmation of exactly where an upload will go —
            deliberately the same text style regardless of vertical, so it
            can't be mistaken for a decorative label. */}
        <p className="text-[10px] font-mono text-[#16232B] bg-[#F5F0EB] border border-[#EBE8E2] px-3 py-2 mb-4">
          Uploading to: {VERTICALS.find((v) => v.id === vertical)?.label} → {categoryOptions.find((c) => c.id === category)?.name}
        </p>

        {/* Create-category is a secondary, infrequent action — kept
            collapsed by default so it never competes with the primary
            upload flow above. Always creates in whichever vertical is
            currently selected above, same mental model as uploading. */}
        {!showCreateCategory ? (
          <button
            type="button"
            onClick={() => {
              setShowCreateCategory(true);
              setCreateCategorySuccess(null);
              setCreateCategoryError(null);
            }}
            className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#6B6B6B] hover:text-[#16232B] transition-colors mb-8 underline decoration-dotted underline-offset-4"
          >
            + Create a new {VERTICALS.find((v) => v.id === vertical)?.label} category
          </button>
        ) : (
          <div className="border border-dashed border-[#EBE8E2] p-5 mb-8 bg-[#FAFAF7]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#6B6B6B]">
                New {VERTICALS.find((v) => v.id === vertical)?.label} category
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowCreateCategory(false);
                  resetCreateCategoryForm();
                  setCreateCategoryError(null);
                }}
                className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#6B6B6B] hover:text-[#16232B] transition-colors"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] font-sans text-[#6B6B6B] mb-1">
                  Display name
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => handleNewCategoryNameChange(e.target.value)}
                  placeholder="e.g. Accent Chairs"
                  className="w-full border border-[#EBE8E2] px-3 py-2 text-sm bg-white rounded-[4px] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] font-sans text-[#6B6B6B] mb-1">
                  URL slug (auto-suggested, editable)
                </label>
                <input
                  type="text"
                  value={newCategorySlug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setNewCategorySlug(e.target.value);
                  }}
                  placeholder="e.g. accent-chairs"
                  className="w-full border border-[#EBE8E2] px-3 py-2 text-sm font-mono bg-white rounded-[4px] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] font-sans text-[#6B6B6B] mb-1">
                  Product code prefix (auto-suggested, editable)
                </label>
                <input
                  type="text"
                  value={newCategoryPrefix}
                  onChange={(e) => {
                    setPrefixTouched(true);
                    setNewCategoryPrefix(e.target.value.toUpperCase());
                  }}
                  placeholder="e.g. MFAC"
                  className="w-full border border-[#EBE8E2] px-3 py-2 text-sm font-mono bg-white rounded-[4px] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              {createCategoryError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">
                  {createCategoryError}
                </p>
              )}

              <button
                type="submit"
                disabled={creatingCategory || !newCategoryName.trim() || !newCategorySlug || !newCategoryPrefix}
                className="w-full py-3 text-xs uppercase tracking-[0.25em] font-sans font-medium text-white transition-opacity disabled:opacity-40 hover:opacity-90"
                style={{ backgroundColor: "#D4AF37" }}
              >
                {creatingCategory ? "Creating…" : "Create Category"}
              </button>
            </form>
          </div>
        )}

        {createCategorySuccess && (
          <p className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2 mb-8">
            {createCategorySuccess}
          </p>
        )}

        <UploadWidget category={category} sessionToken={session.token} onUploaded={handleUploaded} />

        {assigningCode && (
          <p className="text-xs text-[#6B6B6B] font-light mt-4">Assigning product code…</p>
        )}

        <div className="mt-10 pt-8 border-t border-[#EBE8E2]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#6B6B6B]">
              Photos in this category
            </h2>
            {photosLoading && (
              <span className="text-[10px] text-[#6B6B6B] font-light">Loading…</span>
            )}
          </div>

          {photosError && (
            <p className="text-xs text-red-600 mb-4 bg-red-50 border border-red-200 px-3 py-2">
              {photosError}
            </p>
          )}

          {!photosLoading && photos.length === 0 && !photosError && (
            <p className="text-xs text-[#6B6B6B] font-light">No photos uploaded to this category yet.</p>
          )}

          {photos.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-sans text-[#6B6B6B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.size > 0 && selectedIds.size === photos.length}
                  ref={(el) => {
                    if (el) el.indeterminate = selectedIds.size > 0 && selectedIds.size < photos.length;
                  }}
                  onChange={toggleSelectAll}
                  className="h-3.5 w-3.5"
                />
                {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select all"}
              </label>
              {selectedIds.size > 0 && (
                <button
                  onClick={() =>
                    void handleDeletePhotos(photos.filter((p) => selectedIds.has(p.publicId)))
                  }
                  disabled={[...selectedIds].some((id) => deletingIds.has(id))}
                  className="text-[9px] uppercase tracking-[0.15em] font-sans text-red-600 border border-red-200 px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  {[...selectedIds].some((id) => deletingIds.has(id))
                    ? "Deleting…"
                    : `Delete Selected (${selectedIds.size})`}
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.publicId} className="space-y-2">
                <div className="relative">
                  <img
                    src={photo.secureUrl}
                    alt={photo.productCode ?? photo.publicId}
                    className="w-full h-24 object-cover border border-[#EBE8E2]"
                  />
                  <input
                    type="checkbox"
                    checked={selectedIds.has(photo.publicId)}
                    onChange={() => toggleSelected(photo.publicId)}
                    className="absolute top-1.5 left-1.5 h-4 w-4 accent-[#D4AF37]"
                  />
                </div>
                <p className="text-[10px] font-mono text-[#16232B] truncate">
                  {photo.productCode ?? "Assigning…"}
                </p>
                <button
                  onClick={() => void handleDeletePhotos([photo])}
                  disabled={deletingIds.has(photo.publicId)}
                  className="w-full text-[9px] uppercase tracking-[0.15em] font-sans text-red-600 border border-red-200 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  {deletingIds.has(photo.publicId) ? "Deleting…" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
