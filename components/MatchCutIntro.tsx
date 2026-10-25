'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  useMotionValueEvent,
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

const SKILL_START = 0.08;
const SKILL_END = 0.745;
const SEGMENT = (SKILL_END - SKILL_START) / SKILLS.length;
// Sparse lines create a quiet sense of vertical movement during the pinned intro.
const FLOW_COLUMNS = [7, 17, 30, 70, 83, 93] as const;

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

  const [loadingPercent, setLoadingPercent] = useState(0);
  const [loadingStep, setLoadingStep] = useState(1);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const normalized = Math.max(0, Math.min(1, (latest - SKILL_START) / (SKILL_END - SKILL_START)));
    const percent = Math.round(normalized * 100);
    const step = Math.min(
      SKILLS.length,
      Math.max(1, Math.floor((latest - SKILL_START) / SEGMENT) + 1)
    );
    setLoadingPercent((previous) => previous === percent ? previous : percent);
    setLoadingStep((previous) => previous === step ? previous : step);
  });

  // Hide the fixed site chrome while the intro/loading sequence is active.
  // The navigation and footer return once the portrait reveal is complete.
  useEffect(() => {
    const root = document.documentElement;
    if (reduceMotion) {
      root.classList.remove('portfolio-intro-loading');
      return;
    }
    const syncChrome = (progress: number) => {
      root.classList.toggle('portfolio-intro-loading', progress < 0.99);
    };
    syncChrome(scrollYProgress.get());
    const unsubscribe = scrollYProgress.on('change', syncChrome);
    return () => {
      unsubscribe();
      root.classList.remove('portfolio-intro-loading');
    };
  }, [reduceMotion, scrollYProgress]);

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
    const autoplayDuration = 17000; // approximate time to reach the portrait
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


  const openingOpacity = useTransform(scrollYProgress, [0, 0.035, SKILL_START - 0.005], [1, 1, 0]);
  const openingScale = useTransform(scrollYProgress, [0, SKILL_START], [1, 1.04]);
  const loadingUiOpacity = useTransform(scrollYProgress, [0.69, 0.755, 0.81], [1, 1, 0]);

  // A restrained parallax glow connects the text frames to the portrait reveal.
  const ambientX = useTransform(scrollYProgress, [0, 0.75, 1], ['-8%', '9%', '0%']);
  const ambientOpacity = useTransform(scrollYProgress, [0, 0.28, 0.73, 0.93], [0.1, 0.18, 0.2, 0.08]);
  const ambientScale = useTransform(scrollYProgress, [0, 0.75, 1], [0.8, 1.2, 0.9]);

  // Background streaks travel down in two layers. All motion is driven by
  // actual scroll progress, so autoplay and manual scrolling remain in sync.
  const farLinesY = useTransform(scrollYProgress, [0, 1], [-220, 440]);
  const nearLinesY = useTransform(scrollYProgress, [0, 1], [-420, 740]);
  const linesOpacity = useTransform(
    scrollYProgress,
    [0, 0.09, 0.64, 0.83, 0.96, 1],
    [0.2, 0.6, 0.66, 0.35, 0, 0]
  );
  const meterOpacity = useTransform(scrollYProgress, [0, 0.78, 0.92, 1], [0.85, 0.85, 0.3, 0]);
  const meterFill = useTransform(scrollYProgress, [0, 1], [0.02, 1]);

  // Hide the ENTIRE final scene until its reveal begins. Opacity on the
  // individual children alone can let the name faintly appear behind earlier
  // words on some browsers during compositing / scroll restoration.
  const finalVisibility = useTransform(
    scrollYProgress,
    (progress): 'hidden' | 'visible' => progress < 0.75 ? 'hidden' : 'visible'
  );
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
            src="/profile-pic.png"
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

        <motion.div className="mc-flow" style={{ opacity: linesOpacity }} aria-hidden="true">
          <motion.div className="mc-flow__layer mc-flow__layer--far" style={{ y: farLinesY }}>
            {FLOW_COLUMNS.map((position) => (
              <span className="mc-flow__stream" key={position} style={{ left: `${position}%` }} />
            ))}
          </motion.div>
          <motion.div className="mc-flow__layer mc-flow__layer--near" style={{ y: nearLinesY }}>
            {FLOW_COLUMNS.map((position) => (
              <span className="mc-flow__stream" key={position} style={{ left: `${position + 2}%` }} />
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="mc-scroll-meter" style={{ opacity: meterOpacity }} aria-hidden="true">
          <div className="mc-scroll-meter__track">
            <motion.span style={{ scaleY: meterFill }} />
          </div>
          <span className="mc-scroll-meter__arrow">↓</span>
        </motion.div>

        <motion.div className="mc-opening mc-loader__intro" style={{ opacity: openingOpacity, scale: openingScale }}>
          <span className="mc-loader__eyebrow"><i /> PERSONAL PORTFOLIO / INTRO SEQUENCE</span>
          <h1>THE ART OF<br /><span>MAKING</span> <em>THINGS.</em></h1>
          <p>PREPARING THE EXPERIENCE <ArrowDownRight size={16} /></p>
        </motion.div>

        <motion.div className="mc-loader-ui" style={{ opacity: loadingUiOpacity }} aria-hidden="true">
          <div className="mc-loader-ui__top">
            <span>LOADING PORTFOLIO</span>
            <span>{String(loadingStep).padStart(2, '0')} <i>/</i> {String(SKILLS.length).padStart(2, '0')}</span>
          </div>
          <div className="mc-loader-ui__bar">
            <motion.span style={{ scaleX: loadingPercent / 100 }} />
          </div>
          <div className="mc-loader-ui__bottom">
            <span>CODE <i>·</i> DESIGN <i>·</i> PHOTOGRAPHY</span>
            <span>{String(loadingPercent).padStart(2, '0')}%</span>
          </div>
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

        <motion.div className="mc-final" style={{ visibility: finalVisibility }}>
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
              src="/profile-pic.png"
              fill
              priority
              alt="Portrait of Kaveeth Manodhya"
              sizes="(max-width: 760px) 100vw, 48vw"
            />
            <span className="mc-final__shade" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
