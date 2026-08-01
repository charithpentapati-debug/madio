// The ONLY component in the codebase that talks to Cloudinary's upload API
// directly. Everything else (category pages, the build-time image fetch)
// goes through src/lib/imageProvider.ts instead — see that file's header
// comment for why. Keeping Cloudinary-specific code isolated here means
// swapping providers later only touches this file and imageProvider.ts.
//
// This does NOT use Cloudinary's hosted Upload Widget script. That widget's
// own docs say cropping only works with `multiple: false` ("Cropping is
// supported only with single-file uploading") — confirmed directly against
// Cloudinary's docs before building this — so it can't do what the client
// asked for: select several photos at once, then crop each one in turn
// before it uploads. Instead: a plain multi-select <input type="file">
// grabs all the files in one native picker, then each one is run through an
// in-browser crop step (react-image-crop) and uploaded directly to
// Cloudinary's signed upload endpoint, one at a time — same signing
// endpoint (api/cloudinary-sign.ts) the old widget used, just called
// ourselves instead of by the widget's internal uploader.
import React, { useEffect, useRef, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop, cropToCanvas } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILES_PER_BATCH = 20;

function fullImageCrop(): Crop {
  return { unit: "%", x: 0, y: 0, width: 100, height: 100 };
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
  // Plain string, not AnyCategoryId — this widget must accept admin-created
  // (dynamic) category ids too, which can't be known at compile time.
  category: string;
  sessionToken: string;
  onUploaded?: (info: { secureUrl: string; publicId: string }) => void;
}

export const UploadWidget: React.FC<UploadWidgetProps> = ({ category, sessionToken, onUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const onUploadedRef = useRef(onUploaded);
  useEffect(() => {
    onUploadedRef.current = onUploaded;
  });

  // The file currently shown in the cropper, plus everything queued up
  // behind it. batchTotal/processedCount drive the "Photo X of N" label —
  // processedCount advances on a skip just as much as on a real upload, so
  // the count always reflects position in the batch, not just successes.
  const [remainingQueue, setRemainingQueue] = useState<File[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>(fullImageCrop());
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [batchTotal, setBatchTotal] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Revokes the PREVIOUS preview URL whenever previewSrc changes to a new
  // one, and the final one on unmount (e.g. admin navigates away mid-batch)
  // — ordinary effect cleanup semantics cover both cases in one place.
  useEffect(() => {
    if (!previewSrc) return;
    return () => URL.revokeObjectURL(previewSrc);
  }, [previewSrc]);

  const advanceQueue = (files: File[]) => {
    const [next, ...rest] = files;
    setRemainingQueue(rest);
    if (next) {
      setCurrentFile(next);
      setPreviewSrc(URL.createObjectURL(next));
      setCrop(fullImageCrop());
      setCompletedCrop(null);
    } else {
      setCurrentFile(null);
      setPreviewSrc(null);
    }
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-selecting the same file(s) in a later batch
    if (files.length === 0) return;

    const invalid = files.filter((f) => !ACCEPTED_TYPES.includes(f.type));
    if (invalid.length > 0) {
      setError(`Unsupported file type: ${invalid.map((f) => f.name).join(", ")}. Use PNG, JPEG, or WebP.`);
      return;
    }
    if (files.length > MAX_FILES_PER_BATCH) {
      setError(`Select at most ${MAX_FILES_PER_BATCH} photos at once.`);
      return;
    }

    setError(null);
    setBatchTotal(files.length);
    setProcessedCount(0);
    advanceQueue(files);
  };

  const uploadBlob = async (blob: Blob, filename: string): Promise<{ secureUrl: string; publicId: string }> => {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = { folder: category, timestamp };
    const signature = await requestSignature(sessionToken, paramsToSign);

    const form = new FormData();
    form.append("file", blob, filename);
    form.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY as string);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    form.append("folder", category);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form,
    });
    const data = (await res.json()) as {
      secure_url?: string;
      public_id?: string;
      error?: { message?: string };
    };
    if (!res.ok || !data.secure_url || !data.public_id) {
      throw new Error(data.error?.message ?? "Upload failed.");
    }
    return { secureUrl: data.secure_url, publicId: data.public_id };
  };

  const processCurrentFile = async (blob: Blob, filename: string) => {
    setProcessing(true);
    setError(null);
    try {
      const uploaded = await uploadBlob(blob, filename);
      setProcessedCount((n) => n + 1);
      onUploadedRef.current?.(uploaded);
      advanceQueue(remainingQueue);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleUseFullPhoto = () => {
    if (!currentFile) return;
    void processCurrentFile(currentFile, currentFile.name);
  };

  const handleCropAndContinue = async () => {
    if (!currentFile || !imgRef.current) return;
    if (!completedCrop || completedCrop.width < 1 || completedCrop.height < 1) {
      setError('Drag on the photo to select the area you want to keep, or choose "Use Full Photo".');
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const canvas = document.createElement("canvas");
      await cropToCanvas(imgRef.current, canvas, completedCrop);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Could not process the cropped image."))),
          currentFile.type || "image/jpeg",
          0.92,
        );
      });
      const uploaded = await uploadBlob(blob, currentFile.name);
      setProcessedCount((n) => n + 1);
      onUploadedRef.current?.(uploaded);
      advanceQueue(remainingQueue);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSkipFile = () => {
    setError(null);
    setProcessedCount((n) => n + 1);
    advanceQueue(remainingQueue);
  };

  const handleCancelBatch = () => {
    setError(null);
    setRemainingQueue([]);
    setCurrentFile(null);
    setPreviewSrc(null);
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={handleFilesSelected}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-600 font-light mb-4 bg-red-50 border border-red-200 px-4 py-3">
          {error}
        </p>
      )}

      {!currentFile && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-8 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#D4AF37" }}
        >
          Upload Photos
        </button>
      )}

      {currentFile && previewSrc && (
        <div className="border border-[#EBE8E2] p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#6B6B6B]">
              Photo {processedCount + 1} of {batchTotal}
            </p>
            <button
              type="button"
              onClick={handleCancelBatch}
              disabled={processing}
              className="text-[10px] uppercase tracking-[0.15em] font-sans text-[#6B6B6B] hover:text-red-600 disabled:opacity-40"
            >
              Cancel Remaining
            </button>
          </div>

          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            disabled={processing}
          >
            <img ref={imgRef} src={previewSrc} alt={currentFile.name} className="max-h-[420px] w-auto" />
          </ReactCrop>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleUseFullPhoto}
              disabled={processing}
              className="flex-1 px-4 py-3 text-xs uppercase tracking-[0.15em] font-sans text-[#16232B] border border-[#EBE8E2] hover:bg-[#FAFAF7] transition-colors disabled:opacity-40"
            >
              Use Full Photo
            </button>
            <button
              type="button"
              onClick={() => void handleCropAndContinue()}
              disabled={processing}
              className="flex-1 px-4 py-3 text-xs uppercase tracking-[0.25em] font-sans font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: "#D4AF37" }}
            >
              {processing ? "Uploading…" : "Crop & Continue"}
            </button>
          </div>
          <button
            type="button"
            onClick={handleSkipFile}
            disabled={processing}
            className="w-full text-[10px] uppercase tracking-[0.15em] font-sans text-[#6B6B6B] hover:text-red-600 disabled:opacity-40"
          >
            Skip This Photo
          </button>
        </div>
      )}
    </div>
  );
};
