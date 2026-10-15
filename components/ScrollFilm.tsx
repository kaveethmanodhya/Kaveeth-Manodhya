'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

const WORDS = [
  { text: 'CREATIVE', caption: '01 / imagination', at: 0.155, position: 'center' },
  { text: 'DESIGN', caption: '02 / form & function', at: 0.201, position: 'left' },
  { text: 'CODING', caption: '03 / problem solving', at: 0.247, position: 'right' },
  { text: 'JAVA', caption: '04 / software engineering', at: 0.293, position: 'center' },
  { text: 'C++', caption: '05 / logic & systems', at: 0.339, position: 'left' },
  { text: 'NETWORKING', caption: '06 / connectivity', at: 0.385, position: 'right' },
  { text: 'REACT', caption: '07 / interfaces', at: 0.431, position: 'center' },
  { text: 'NEXT.JS', caption: '08 / experiences', at: 0.477, position: 'left' },
  { text: 'PHOTOGRAPHY', caption: '09 / perspective', at: 0.523, position: 'right' },
  { text: 'EDITING', caption: '10 / visual craft', at: 0.569, position: 'center' },
  { text: 'STORYTELLING', caption: '11 / meaning', at: 0.615, position: 'left' },
] as const;

function SkillFrame({
  word,
  progress,
}: {
  word: (typeof WORDS)[number];
  progress: MotionValue<number>;
}) {
  const start = word.at;
  const opacity = useTransform(
    progress,
    [start, start + 0.014, start + 0.045, start + 0.07],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [start, start + 0.02, start + 0.05, start + 0.07],
    [100, 0, 0, -90]
  );
  const scale = useTransform(
    progress,
    [start, start + 0.035, start + 0.07],
    [0.82, 1, 1.13]
  );
  const blur = useTransform(
    progress,
    [start, start + 0.016, start + 0.051, start + 0.07],
    ['blur(14px)', 'blur(0px)', 'blur(0px)', 'blur(12px)']
  );

  return (
    <motion.div
      className={`film-word film-word--${word.position}`}
      style={{ opacity, y, scale, filter: blur }}
      aria-hidden="true"
    >
      <span className="film-word__caption">{word.caption}</span>
      <strong>{word.text}</strong>
      <span className="film-word__stroke">{word.text}</span>
    </motion.div>
  );
}

export default function ScrollFilm() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const openingOpacity = useTransform(scrollYProgress, [0, 0.1, 0.155], [1, 1, 0]);
  const openingScale = useTransform(scrollYProgress, [0, 0.155], [1, 1.18]);
  const openingY = useTransform(scrollYProgress, [0, 0.155], [0, -90]);

  const filmGlowOpacity = useTransform(scrollYProgress, [0, 0.17, 0.55, 0.72], [0.15, 0.55, 0.5, 0]);
  const portraitOpacity = useTransform(scrollYProgress, [0.65, 0.74, 0.96, 1], [0, 1, 1, 1]);
  const portraitScale = useTransform(scrollYProgress, [0.65, 0.81, 1], [1.24, 1.0, 1.04]);
  const portraitClip = useTransform(
    scrollYProgress,
    [0.65, 0.82],
    ['inset(48% 47% 48% 47% round 120px)', 'inset(0% 0% 0% 0% round 0px)']
  );
  const finalTextOpacity = useTransform(scrollYProgress, [0.75, 0.87], [0, 1]);
  const finalTextY = useTransform(scrollYProgress, [0.75, 0.88], [80, 0]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reduceMotion) {
    return (
      <section className="film-reduced" id="home">
        <div className="film-reduced__copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Developer / Designer / Photographer</p>
          <h1>IDEAS INTO <em>EXPERIENCES.</em></h1>
          <p>Hi, I am Kaveeth Manodhya. I create across code, design, and photography.</p>
          <a className="round-link" href="#work">Discover my work <ArrowUpRight size={18} /></a>
        </div>
        <div className="film-reduced__photo">
          <Image src="/profile-v2.webp" alt="Portrait of Kaveeth Manodhya" fill sizes="(max-width: 760px) 100vw, 48vw" priority />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="film-track" id="home" aria-label="Scroll-driven creative introduction">
      <div className="film-stage">
        <div className="film-grid" aria-hidden="true" />
        <motion.div className="film-glow" style={{ opacity: filmGlowOpacity }} aria-hidden="true" />

        <div className="film-topline" aria-hidden="true">
          <span>KM / CREATIVE PORTFOLIO</span>
          <span className="film-topline__right">SRI LANKA <span className="film-live-dot" /> EST. 2026</span>
        </div>

        <motion.div
          className="film-opening"
          style={{ opacity: openingOpacity, scale: openingScale, y: openingY }}
        >
          <p className="eyebrow"><span className="eyebrow-dot" /> AN INTRODUCTION IN MOTION</p>
          <h1>THE ART OF<br /><span>MAKING</span> <em>THINGS.</em></h1>
          <div className="film-opening__footer">
            <span>CODE. CREATE. CAPTURE.</span>
            <span>KEEP SCROLLING <ArrowDownRight size={16} strokeWidth={1.6} /></span>
          </div>
        </motion.div>

        <div className="film-words" aria-hidden="true">
          {WORDS.map(word => (
            <SkillFrame key={word.text} word={word} progress={scrollYProgress} />
          ))}
        </div>

        <motion.div className="film-reveal" style={{ opacity: portraitOpacity }}>
          <motion.div className="film-reveal__portrait" style={{ clipPath: portraitClip, scale: portraitScale }}>
            <Image
              src="/profile-v2.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 760px) 100vw, 52vw"
              className="film-reveal__image"
            />
            <span className="film-reveal__image-shade" />
          </motion.div>
          <motion.div className="film-reveal__copy" style={{ opacity: finalTextOpacity, y: finalTextY }}>
            <p className="eyebrow"><span className="eyebrow-dot" /> BEHIND THE WORK</p>
            <p className="film-reveal__intro">MEET THE CREATOR</p>
            <h2>KAVEETH<br /><em>MANODHYA.</em></h2>
            <p className="film-reveal__sub">Developer. Designer. Photographer.<br />One curious mind, many creative worlds.</p>
            <a href="#about" className="round-link">Get to know me <ArrowUpRight size={18} /></a>
          </motion.div>
        </motion.div>

        <div className="film-sidebar" aria-hidden="true">
          <span>SCROLL TO PLAY</span>
          <div className="film-sidebar__line"><motion.span style={{ scaleY: lineScale }} /></div>
          <span>01 — 04</span>
        </div>
        <a className="film-skip" href="#about">SKIP INTRO <ArrowDownRight size={15} /></a>
        <div className="film-bottomline" aria-hidden="true">
          <span>EVERY FRAME, A DIFFERENT SIDE.</span>
          <span>SCROLL ↕</span>
        </div>
      </div>
    </section>
  );
}
