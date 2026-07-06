import { useEffect } from "react";

const DEFAULT_TITLE = "MADIO | Furniture, Architectural Finishes & Doors";

/**
 * Sets document.title and the <meta name="description"> tag for the
 * lifetime of the calling page. Every top-level page should call this —
 * otherwise it keeps whatever the previous page (or index.html) set, since
 * this is a client-rendered SPA with no per-route server-rendered <head>.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let metaEl: HTMLMetaElement | null = null;
    let previousDescription: string | null = null;

    if (description) {
      metaEl = document.querySelector('meta[name="description"]');
      if (metaEl) {
        previousDescription = metaEl.getAttribute("content");
      } else {
        metaEl = document.createElement("meta");
        metaEl.setAttribute("name", "description");
        document.head.appendChild(metaEl);
      }
      metaEl.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle;
      if (metaEl && previousDescription !== null) {
        metaEl.setAttribute("content", previousDescription);
      }
    };
  }, [title, description]);
}

export { DEFAULT_TITLE };
