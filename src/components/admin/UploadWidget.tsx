// The ONLY component in the codebase that talks to Cloudinary's client-side
// SDK directly. Everything else (category pages, the build-time image fetch)
// goes through src/lib/imageProvider.ts instead — see that file's header
// comment for why. Keeping Cloudinary-specific code isolated here means
// swapping providers later only touches this file and imageProvider.ts.
import React, { useEffect, useRef, useState } from "react";
import type { AnyCategoryId } from "../../../shared/verticals";

const WIDGET_SCRIPT_SRC = "https://upload-widget.cloudinary.com/global/all.js";

// Minimal typing for the slice of the Cloudinary Upload Widget this component
// uses — the widget ships as a plain <script>, not an npm package with types.
interface CloudinaryUploadWidgetResult {
  event: string;
  info?: { secure_url?: string; public_id?: string };
}
interface CloudinaryUploadWidgetOptions {
  cloudName: string;
  apiKey: string;
  folder: string;
  sources: string[];
  multiple: boolean;
  maxFiles: number;
  clientAllowedFormats: string[];
  uploadSignature: (
    callback: (signature: string) => void,
    paramsToSign: Record<string, string | number>
  ) => void;
}
interface CloudinaryWidgetInstance {
  open: () => void;
  destroy: () => void;
}
declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: CloudinaryUploadWidgetOptions,
        callback: (error: { message?: string } | null, result: CloudinaryUploadWidgetResult) => void
      ) => CloudinaryWidgetInstance;
    };
  }
}

function loadCloudinaryScript(): Promise<void> {
  if (window.cloudinary) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load the Cloudinary upload widget.")));
      return;
    }
    const script = document.createElement("script");
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load the Cloudinary upload widget."));
    document.body.appendChild(script);
  });
}

// Asks our own backend (api/cloudinary-sign.ts) to sign this upload attempt.
// The session token proves the admin password was entered correctly; the
// Cloudinary API secret never leaves that serverless function.
async function requestSignature(
  sessionToken: string,
  paramsToSign: Record<string, string | number>,
): Promise<string> {
  const res = await fetch("/api/cloudinary-sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: sessionToken, paramsToSign }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Could not authorize this upload. Please log in again.");
  }
  const data = (await res.json()) as { signature: string };
  return data.signature;
}

interface UploadWidgetProps {
  category: AnyCategoryId;
  sessionToken: string;
  onUploaded?: (info: { secureUrl: string; publicId: string }) => void;
}

export const UploadWidget: React.FC<UploadWidgetProps> = ({ category, sessionToken, onUploaded }) => {
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<CloudinaryWidgetInstance | null>(null);
  const onUploadedRef = useRef(onUploaded);
  onUploadedRef.current = onUploaded;

  useEffect(() => {
    let cancelled = false;
    loadCloudinaryScript()
      .then(() => {
        if (!cancelled) setScriptReady(true);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Recreated whenever the category or session changes, since both are
  // captured in the widget's config/signature callback closures.
  useEffect(() => {
    if (!scriptReady || !window.cloudinary) return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string,
        apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY as string,
        folder: category,
        sources: ["local", "camera"],
        multiple: true,
        maxFiles: 20,
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        uploadSignature: (callback, paramsToSign) => {
          requestSignature(sessionToken, paramsToSign)
            .then(callback)
            .catch((err: Error) => setError(err.message));
        },
      },
      (err, result) => {
        if (err) {
          setError(err.message ?? "Upload failed.");
          return;
        }
        if (result.event === "success" && result.info?.secure_url && result.info.public_id) {
          setError(null);
          onUploadedRef.current?.({
            secureUrl: result.info.secure_url,
            publicId: result.info.public_id,
          });
        }
      },
    );

    widgetRef.current = widget;
    return () => widget.destroy();
  }, [scriptReady, category, sessionToken]);

  return (
    <div>
      {error && (
        <p className="text-xs text-red-600 font-light mb-4 bg-red-50 border border-red-200 px-4 py-3">
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={!scriptReady}
        onClick={() => widgetRef.current?.open()}
        className="px-8 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium text-white transition-opacity disabled:opacity-40 hover:opacity-90"
        style={{ backgroundColor: "#D4AF37" }}
      >
        {scriptReady ? "Upload Photos" : "Loading uploader…"}
      </button>
    </div>
  );
};
