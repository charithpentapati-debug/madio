import React, { useCallback, useEffect, useMemo, useState } from "react";
import { furnitureCategories } from "../../../shared/furnitureCategories";
import { doorsWindowsCategories } from "../../../shared/doorsWindowsCategories";
import type { Vertical, AnyCategoryId } from "../../../shared/verticals";
import { UploadWidget } from "../../components/admin/UploadWidget";

// Two-level selector: pick a vertical first, then a category belonging to
// it — never a single flat 21-category dropdown (9 Furniture + 12 D&W).
// Picking a vertical here is what filters/populates the category list below,
// not just a label prefix on one giant list.
const VERTICALS: { id: Vertical; label: string }[] = [
  { id: "furniture", label: "Furniture" },
  { id: "doors-windows", label: "Doors & Windows" },
];

function categoryMetaForVertical(vertical: Vertical) {
  return vertical === "furniture" ? furnitureCategories : doorsWindowsCategories;
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
  const [category, setCategory] = useState<AnyCategoryId>(furnitureCategories[0].id);

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const fetchPhotos = useCallback(async (token: string, cat: AnyCategoryId) => {
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
  // selected category changes.
  useEffect(() => {
    if (session) void fetchPhotos(session.token, category);
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

  const handleDelete = async (photo: CategoryPhoto) => {
    if (!session) return;
    const label = photo.productCode ?? photo.publicId;
    if (!window.confirm(`Delete ${label}? This can't be undone.`)) return;

    setDeletingId(photo.publicId);
    setPhotosError(null);
    try {
      const res = await fetch("/api/admin-delete-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: session.token, publicId: photo.publicId }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setPhotosError(data.error ?? "Could not delete this photo.");
        return;
      }
      setPhotos((prev) => prev.filter((p) => p.publicId !== photo.publicId));
    } catch {
      setPhotosError("Could not reach the server. Check your connection and try again.");
    } finally {
      setDeletingId(null);
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
          onChange={(e) => setCategory(e.target.value as AnyCategoryId)}
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
        <p className="text-[10px] font-mono text-[#16232B] bg-[#F5F0EB] border border-[#EBE8E2] px-3 py-2 mb-8">
          Uploading to: {VERTICALS.find((v) => v.id === vertical)?.label} → {categoryOptions.find((c) => c.id === category)?.name}
        </p>

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

          <div className="grid grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.publicId} className="space-y-2">
                <img
                  src={photo.secureUrl}
                  alt={photo.productCode ?? photo.publicId}
                  className="w-full h-24 object-cover border border-[#EBE8E2]"
                />
                <p className="text-[10px] font-mono text-[#16232B] truncate">
                  {photo.productCode ?? "Assigning…"}
                </p>
                <button
                  onClick={() => handleDelete(photo)}
                  disabled={deletingId === photo.publicId}
                  className="w-full text-[9px] uppercase tracking-[0.15em] font-sans text-red-600 border border-red-200 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  {deletingId === photo.publicId ? "Deleting…" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
