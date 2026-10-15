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
    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
