import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useScrollReveal = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Safety fallback: any element still hidden after this delay becomes visible.
    // Guarantees content is never permanently invisible if the observer misfires.
    const FALLBACK_DELAY = 1200;

    const observerOptions = {
      root: null,
      rootMargin: "0px",   // No negative margin — catches elements already in viewport
      threshold: 0.05,     // 5% visible is enough to reveal
    };

    const reveal = (el: Element) => {
      el.classList.add("is-visible");
      intersectionObserver.unobserve(el);
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    };

    const intersectionObserver = new IntersectionObserver(handleIntersect, observerOptions);

    // Observe an element: if it's already in the viewport, reveal immediately.
    const observe = (el: Element) => {
      if (el.classList.contains("is-visible")) return;
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (inViewport) {
        // Already visible — reveal without waiting for the observer callback.
        el.classList.add("is-visible");
      } else {
        intersectionObserver.observe(el);
      }
    };

    // Observe all current elements
    const observeAll = () => {
      document.querySelectorAll(".reveal-on-scroll").forEach(observe);
    };

    // MutationObserver watches for new .reveal-on-scroll nodes added by React re-renders
    // (e.g. filter changes in TextureGallery adding new card elements to the DOM).
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          // The added node itself may be a reveal element
          if (node.classList.contains("reveal-on-scroll")) observe(node);
          // Or it may contain reveal elements as descendants
          node.querySelectorAll(".reveal-on-scroll").forEach(observe);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Initial pass after React has painted
    const timer = setTimeout(observeAll, 100);

    // Fallback: force-reveal anything still hidden after FALLBACK_DELAY
    const fallback = setTimeout(() => {
      document.querySelectorAll(".reveal-on-scroll:not(.is-visible)").forEach((el) => {
        el.classList.add("is-visible");
      });
    }, FALLBACK_DELAY);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallback);
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);
};
