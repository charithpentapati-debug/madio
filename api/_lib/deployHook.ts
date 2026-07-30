// Triggers a Vercel production rebuild after an upload's code gets assigned
// or a photo is deleted, so the live site picks up the change within
// Vercel's normal build time. This replaces relying on Cloudinary's own
// notification webhook — simpler, no separate Cloudinary dashboard config,
// and identical for both the upload and delete paths.
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
