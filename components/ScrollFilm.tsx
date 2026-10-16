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

// A deliberately shorter reel. Scroll progress drives every frame,
// so scrolling back plays the same sequence in reverse.
const SKILLS = [
  'CREATIVE',
  'DESIGN',
  'CODING',
  'PROGRAMMING',
  'JAVA',
  'C++',
  'NETWORKING',
  'JAVASCRIPT',
  'REACT',
  'NEXT.JS',
  'WEB DESIGN',
  'PHOTOGRAPHY',
  'PHOTOSHOP',
  'VIDEO EDITING',
  'STORYTELLING',
] as const;

const FRAME_START = 0.15;
const FRAME_END = 0.77;
const FRAME_STEP = (FRAME_END - FRAME_START) / SKILLS.length;

function SkillFrame({
  skill,
  index,
  progress,
}: {
  skill: (typeof SKILLS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const start = FRAME_START + index * FRAME_STEP;
  const end = start + FRAME_STEP;

  const opacity = useTransform(
    progress,
    [start, start + FRAME_STEP * 0.2, start + FRAME_STEP * 0.76, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [start, start + FRAME_STEP * 0.35, end],
    [52, 0, -48]
  );
  const scale = useTransform(
    progress,
    [start, start + FRAME_STEP * 0.5, end],
    [0.94, 1, 1.055]
  );

  return (
    <motion.div className="film-word film-word--minimal" style={{ opacity, y, scale }} aria-hidden="true">
      <strong>{skill}</strong>
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

  const openingOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15], [1, 1, 0]);
  const openingScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.08]);

  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.66, 0.84],
    [0.11, 0.24, 0.19, 0.08]
  );

  const portraitOpacity = useTransform(scrollYProgress, [0.775, 0.86, 1], [0, 1, 1]);
  const portraitScale = useTransform(scrollYProgress, [0.775, 0.91, 1], [1.13, 1, 1.015]);
  const portraitClip = useTransform(
    scrollYProgress,
    [0.775, 0.91],
    ['inset(48% 47% 48% 47% round 120px)', 'inset(0% 0% 0% 0% round 0px)']
  );
  const finalTextOpacity = useTransform(scrollYProgress, [0.85, 0.94], [0, 1]);
  const finalTextY = useTransform(scrollYProgress, [0.85, 0.94], [35, 0]);

  if (reduceMotion) {
    return (
      <section className="film-reduced" id="home">
        <div className="film-reduced__copy">
          <h1>IDEAS INTO <em>EXPERIENCES.</em></h1>
          <p>Hi, I am Kaveeth Manodhya. Developer, designer, and photographer.</p>
          <a className="round-link" href="#work">Discover my work <ArrowUpRight size={18} /></a>
        </div>
        <div className="film-reduced__photo">
          <Image src="/profile-pic.png" alt="Portrait of Kaveeth Manodhya" fill sizes="(max-width: 760px) 100vw, 48vw" priority />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="film-track" id="home" aria-label="Scroll through creative skills to reveal Kaveeth Manodhya">
      <div className="film-stage">
        <motion.div className="film-glow" style={{ opacity: glowOpacity }} aria-hidden="true" />

        <motion.div className="film-opening" style={{ opacity: openingOpacity, scale: openingScale }}>
          <h1>THE ART OF<br /><span>MAKING</span> <em>THINGS.</em></h1>
          <p className="film-scroll-hint">SCROLL TO EXPLORE <ArrowDownRight size={16} /></p>
        </motion.div>

        <div className="film-words" aria-hidden="true">
          {SKILLS.map((skill, index) => (
            <SkillFrame key={skill} skill={skill} index={index} progress={scrollYProgress} />
          ))}
        </div>

        <motion.div className="film-reveal" style={{ opacity: portraitOpacity }}>
          <motion.div className="film-reveal__portrait" style={{ clipPath: portraitClip, scale: portraitScale }}>
            <Image
              src="/profile-pic.png"
              alt="Portrait of Kaveeth Manodhya"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 52vw"
              className="film-reveal__image"
            />
            <span className="film-reveal__image-shade" aria-hidden="true" />
          </motion.div>
          <motion.div className="film-reveal__copy" style={{ opacity: finalTextOpacity, y: finalTextY }}>
            <h2>KAVEETH<br /><em>MANODHYA.</em></h2>
            <p className="film-reveal__sub">Developer. Designer. Photographer.</p>
            <a href="#about" className="round-link">About me <ArrowUpRight size={18} /></a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
