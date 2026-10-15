'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

// Scroll-controlled match cuts. Add or remove words here and the
// animation will redistribute their timing without any other changes.
const SKILLS = [
  'CREATIVE',
  'DESIGN',
  'CODING',
  'PROGRAMMING',
  'JAVA',
  'C++',
  'NETWORKING',
  'REACT',
  'NEXT.JS',
  'WEB DESIGN',
  'PHOTOGRAPHY',
  'STORYTELLING',
] as const;

const SKILL_START = 0.13;
const SKILL_END = 0.745;
const SEGMENT = (SKILL_END - SKILL_START) / SKILLS.length;

function MatchCutWord({
  word,
  previous,
  next,
  index,
  progress,
}: {
  word: (typeof SKILLS)[number];
  previous: string;
  next: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = SKILL_START + index * SEGMENT;
  const end = start + SEGMENT;
  const opacity = useTransform(
    progress,
    [start, start + SEGMENT * 0.20, start + SEGMENT * 0.78, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [start, start + SEGMENT * 0.32, start + SEGMENT * 0.76, end],
    [64, 0, 0, -58]
  );
  const scale = useTransform(
    progress,
    [start, start + SEGMENT * 0.4, end],
    [0.87, 1, 1.14]
  );
  const blur = useTransform(
    progress,
    [start, start + SEGMENT * 0.23, start + SEGMENT * 0.76, end],
    ['blur(16px)', 'blur(0px)', 'blur(0px)', 'blur(15px)']
  );
  const highlight = useTransform(
    progress,
    [start, start + SEGMENT * 0.30, start + SEGMENT * 0.68, end],
    [0, 1, 1, 0]
  );
  const ghostShift = useTransform(
    progress,
    [start, end],
    ['-5%', '5%']
  );

  return (
    <motion.div
      className="mc-word"
      style={{ opacity, y, scale, filter: blur }}
      aria-hidden="true"
    >
      <motion.span className="mc-word__ghost mc-word__ghost--upper" style={{ x: ghostShift }}>
        {previous}
      </motion.span>
      <div className="mc-word__focus">
        <strong>{word}</strong>
        <motion.span className="mc-word__sweep" style={{ scaleX: highlight }} />
      </div>
      <motion.span className="mc-word__ghost mc-word__ghost--lower" style={{ x: ghostShift }}>
        {next}
      </motion.span>
    </motion.div>
  );
}

export default function MatchCutIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Idle autoplay moves the actual page scroll, never a separate fake timeline.
  // Any user intent immediately cancels it and manual scroll stays in charge.
  useEffect(() => {
    if (reduceMotion) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    if (!section) return;
    if (window.location.hash && window.location.hash !== '#home') return;
    if (window.scrollY > 4) return;

    let frame = 0;
    let timer = 0;
    let previousTime = 0;
    let cancelled = false;
    const startDelay = 1600;
    const autoplayDuration = 22000; // approximate time to reach the portrait
    const maxDuration = 35000; // protective timeout
    const startedAt = performance.now();

    const stop = () => {
      if (cancelled) return;
      cancelled = true;
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
    };

    const stopOnKey = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar'].includes(event.key)) stop();
    };
    const stopOnPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || event.pointerType === 'pen') stop();
      else if (event.target instanceof Element && event.target.closest('a, button, input, textarea, select')) stop();
    };
    const stopOnHash = () => stop();

    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', stopOnKey);
    window.addEventListener('pointerdown', stopOnPointer);
    window.addEventListener('hashchange', stopOnHash);
    window.addEventListener('popstate', stopOnHash);

    const animate = (now: number) => {
      if (cancelled) return;
      if (!previousTime) previousTime = now;
      const delta = Math.min(now - previousTime, 50);
      previousTime = now;
      const pageStart = section.getBoundingClientRect().top + window.scrollY;
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) { stop(); return; }

      // Finish after portrait and details are fully revealed.
      const finish = pageStart + scrollable * 0.99;
      const current = window.scrollY;
      if (current >= finish - 0.5) { stop(); return; }
      if (performance.now() - startedAt > maxDuration) { stop(); return; }
      const speed = (scrollable * 0.99) / (autoplayDuration / 1000);
      const next = Math.min(finish, current + speed * delta / 1000);
      window.dispatchEvent(new CustomEvent<number>('portfolio:autoplay-scroll', { detail: next }));
      // Native fallback for reduced-motion/coarse-pointer configurations
      // where SmoothScroll intentionally does not mount Lenis.
      if (Math.abs(window.scrollY - next) > 1) window.scrollTo({ top: next, behavior: 'instant' });
      frame = window.requestAnimationFrame(animate);
    };

    timer = window.setTimeout(() => {
      if (!cancelled) frame = window.requestAnimationFrame(animate);
    }, startDelay);

    return () => {
      stop();
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stopOnKey);
      window.removeEventListener('pointerdown', stopOnPointer);
      window.removeEventListener('hashchange', stopOnHash);
      window.removeEventListener('popstate', stopOnHash);
    };
  }, [reduceMotion]);


  const openingOpacity = useTransform(scrollYProgress, [0, 0.065, SKILL_START], [1, 1, 0]);
  const openingScale = useTransform(scrollYProgress, [0, SKILL_START], [1, 1.08]);

  // A restrained parallax glow connects the text frames to the portrait reveal.
  const ambientX = useTransform(scrollYProgress, [0, 0.75, 1], ['-8%', '9%', '0%']);
  const ambientOpacity = useTransform(scrollYProgress, [0, 0.28, 0.73, 0.93], [0.1, 0.18, 0.2, 0.08]);
  const ambientScale = useTransform(scrollYProgress, [0, 0.75, 1], [0.8, 1.2, 0.9]);

  const nameOpacity = useTransform(scrollYProgress, [0.752, 0.82, 1], [0, 1, 1]);
  const nameY = useTransform(scrollYProgress, [0.752, 0.845], [70, 0]);
  const nameScale = useTransform(scrollYProgress, [0.752, 0.88], [0.91, 1]);

  const portraitOpacity = useTransform(scrollYProgress, [0.82, 0.925, 1], [0, 1, 1]);
  const portraitScale = useTransform(scrollYProgress, [0.82, 0.94, 1], [1.24, 1, 1.02]);
  const portraitClip = useTransform(
    scrollYProgress,
    [0.82, 0.94],
    [
      'inset(47% 44% 47% 44% round 48%)',
      'inset(0% 0% 0% 0% round 2%)',
    ]
  );
  const detailsOpacity = useTransform(scrollYProgress, [0.91, 0.98], [0, 1]);
  const detailsY = useTransform(scrollYProgress, [0.91, 0.98], [25, 0]);

  if (reduceMotion) {
    return (
      <section id="home" className="mc-static">
        <div className="mc-static__copy">
          <p className="mc-static__eyebrow">CREATIVE / CODE / PHOTOGRAPHY</p>
          <h1>KAVEETH<br /><em>MANODHYA.</em></h1>
          <p>Developer. Designer. Photographer.</p>
          <p>Applied Sciences undergraduate at Wayamba University of Sri Lanka.</p>
          <a href="#about" className="mc-final__link">ABOUT ME <ArrowUpRight size={19} /></a>
        </div>
        <div className="mc-static__portrait">
          <Image
            src="/profile-v2.webp"
            fill
            priority
            alt="Portrait of Kaveeth Manodhya"
            sizes="(max-width: 760px) 100vw, 45vw"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      className="mc-track"
      aria-label="Cinematic introduction to Kaveeth Manodhya"
    >
      <div className="mc-stage">
        <div className="mc-stage__texture" aria-hidden="true" />
        <motion.div
          className="mc-stage__glow"
          style={{ x: ambientX, opacity: ambientOpacity, scale: ambientScale }}
          aria-hidden="true"
        />

        <motion.div className="mc-opening" style={{ opacity: openingOpacity, scale: openingScale }}>
          <h1>THE ART OF<br /><span>MAKING</span> <em>THINGS.</em></h1>
          <p>SCROLL TO EXPLORE <ArrowDownRight size={16} /></p>
        </motion.div>

        <div className="mc-sequence" aria-hidden="true">
          {SKILLS.map((word, index) => (
            <MatchCutWord
              key={word}
              word={word}
              previous={SKILLS[(index + SKILLS.length - 1) % SKILLS.length]}
              next={SKILLS[(index + 1) % SKILLS.length]}
              index={index}
              progress={scrollYProgress}
            />
          ))}
        </div>

        <div className="mc-final">
          <motion.div className="mc-final__identity" style={{ opacity: nameOpacity, y: nameY, scale: nameScale }}>
            <h2>KAVEETH<br /><em>MANODHYA.</em></h2>
            <motion.div className="mc-final__details" style={{ opacity: detailsOpacity, y: detailsY }}>
              <span className="mc-final__divider" aria-hidden="true" />
              <p className="mc-final__roles">Developer <span>•</span> Designer <span>•</span> Photographer</p>
              <p className="mc-final__location">Applied Sciences Undergraduate<br />Wayamba University of Sri Lanka</p>
              <a href="#about" className="mc-final__link">
                MORE ABOUT ME <ArrowUpRight size={18} />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="mc-final__portrait"
            style={{ opacity: portraitOpacity, clipPath: portraitClip, scale: portraitScale }}
          >
            <Image
              src="/profile-v2.webp"
              fill
              priority
              alt="Portrait of Kaveeth Manodhya"
              sizes="(max-width: 760px) 100vw, 48vw"
            />
            <span className="mc-final__shade" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
