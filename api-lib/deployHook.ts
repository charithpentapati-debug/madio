// Triggers a Vercel production rebuild via the deploy hook URL.
//
// NOT currently called anywhere — admin-assign-code.ts and
// admin-delete-photo.ts used to call this directly on every upload/delete,
// but that meant every action fired TWO rebuilds: this one, plus
// Cloudinary's own account-level webhook (Console → Settings → Upload →
// Notification URL) firing independently for the same Cloudinary API call
// our endpoints make. That doubled Vercel's daily deploy-quota usage for
// completely normal client usage. Cloudinary's webhook alone already covers
// every path that matters (our admin endpoints AND direct
// Cloudinary-dashboard uploads/deletes), so the direct calls were removed.
// Left here, still fully working, in case a future direct-trigger need
// arises — not dead code to delete, just currently unused.
export async function triggerRebuild(): Promise<void> {
  const url = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!url) {
    console.warn("[deployHook] VERCEL_DEPLOY_HOOK_URL is not configured — skipping rebuild trigger.");
    return;
  }
  try {
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
      console.warn(`[deployHook] Deploy hook responded ${res.status}`);
    }
  } catch (err) {
    console.warn("[deployHook] Failed to trigger deploy hook:", (err as Error).message);
  }
}
