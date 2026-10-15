'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/** Gentle inertia for wheel/trackpad scrolling without hijacking touch or reduced-motion devices. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({
      duration: 1.55,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -9 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const destination = document.getElementById(id.slice(1));
      if (!destination) return;
      event.preventDefault();
      history.pushState(null, '', id);
      lenis.scrollTo(destination, { offset: -76, duration: 1.6 });
    };
    // MatchCutIntro sends measured scroll offsets here while autoplay runs.
    // Route them through Lenis to keep its internal position in sync with the
    // actual scrollbar, so the user's first wheel input takes over smoothly.
    const onAutoplayScroll = (event: Event) => {
      const scrollEvent = event as CustomEvent<number>;
      const top = scrollEvent.detail;
      if (typeof top !== 'number' || !Number.isFinite(top)) return;
      scrollEvent.preventDefault();
      lenis.scrollTo(top, { immediate: true, force: true });
    };
    window.addEventListener('portfolio:autoplay-scroll', onAutoplayScroll);
    document.addEventListener('click', onAnchorClick);

    return () => {
      window.removeEventListener('portfolio:autoplay-scroll', onAutoplayScroll);
      document.removeEventListener('click', onAnchorClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
