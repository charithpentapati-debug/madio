import React, { useEffect, useState } from "react";
import { furnitureCategories } from "../../data/furniture";
import type { FurnitureCategoryId } from "../../data/furniture";
import { UploadWidget } from "../../components/admin/UploadWidget";

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

interface UploadedItem {
  publicId: string;
  secureUrl: string;
  category: string;
}

export const AdminUpload: React.FC = () => {
  const [session, setSession] = useState<StoredSession | null>(() => readStoredSession());
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<FurnitureCategoryId>(furnitureCategories[0].id);
  const [uploaded, setUploaded] = useState<UploadedItem[]>([]);

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
      <div className="max-w-xl mx-auto bg-white border border-[#EBE8E2] p-10 shadow-sm">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-xl font-serif font-light text-[#16232B] mb-1">Admin Upload</h1>
            <p className="text-xs text-[#6B6B6B] font-light">
              Choose a category, then upload photos. New photos go live on the site within 1–2
              minutes.
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
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as FurnitureCategoryId)}
          className="w-full border border-[#EBE8E2] px-4 py-3 text-sm mb-8 bg-[#FAFAF7] rounded-[4px] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
        >
          {furnitureCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <UploadWidget
          category={category}
          sessionToken={session.token}
          onUploaded={(info) =>
            setUploaded((prev) => [{ publicId: info.publicId, secureUrl: info.secureUrl, category }, ...prev])
          }
        />

        {uploaded.length > 0 && (
          <div className="mt-10 pt-8 border-t border-[#EBE8E2]">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#6B6B6B] mb-4">
              Uploaded this session
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {uploaded.map((item) => (
                <div key={item.publicId} className="space-y-1">
                  <img
                    src={item.secureUrl}
                    alt={item.publicId}
                    className="w-full h-20 object-cover border border-[#EBE8E2]"
                  />
                  <p className="text-[9px] text-[#6B6B6B] font-light truncate">{item.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
