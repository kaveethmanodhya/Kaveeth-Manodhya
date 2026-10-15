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

/**
 * The content is scroll-scrubbed instead of time-based.
 * Every word is an individual frame, so scrolling backwards
 * plays the exact same sequence in reverse.
 */
const SKILLS = [
  { text: 'CREATIVE', detail: 'Ideas have no boundaries', category: 'THE MINDSET' },
  { text: 'IMAGINATION', detail: 'Start with possibility', category: 'THE MINDSET' },
  { text: 'DESIGN', detail: 'Every detail matters', category: 'THE MINDSET' },
  { text: 'CODING', detail: 'Thoughts into instructions', category: 'ENGINEERING' },
  { text: 'PROGRAMMING', detail: 'Building the logic', category: 'ENGINEERING' },
  { text: 'JAVA', detail: 'Object-oriented thinking', category: 'ENGINEERING' },
  { text: 'C++', detail: 'Closer to the machine', category: 'ENGINEERING' },
  { text: 'C', detail: 'The fundamentals', category: 'ENGINEERING' },
  { text: 'JAVASCRIPT', detail: 'The web comes alive', category: 'ENGINEERING' },
  { text: 'REACT', detail: 'Interfaces that respond', category: 'THE WEB' },
  { text: 'NEXT.JS', detail: 'Modern web experiences', category: 'THE WEB' },
  { text: 'NODE.JS', detail: 'Behind the scenes', category: 'THE WEB' },
  { text: 'MONGODB', detail: 'Organised information', category: 'THE WEB' },
  { text: 'DATABASES', detail: 'Connected information', category: 'THE WEB' },
  { text: 'NETWORKING', detail: 'Systems in conversation', category: 'THE WEB' },
  { text: 'UI / UX', detail: 'Experiences made intuitive', category: 'THE EXPERIENCE' },
  { text: 'WEB DESIGN', detail: 'Form follows purpose', category: 'THE EXPERIENCE' },
  { text: 'ANIMATION', detail: 'Movement with intention', category: 'THE EXPERIENCE' },
  { text: 'PHOTOGRAPHY', detail: 'Finding the frame', category: 'VISUAL STORIES' },
  { text: 'PORTRAITS', detail: 'Every face tells a story', category: 'VISUAL STORIES' },
  { text: 'LIGHTROOM', detail: 'Finding the right tone', category: 'VISUAL STORIES' },
  { text: 'PHOTOSHOP', detail: 'Details made remarkable', category: 'VISUAL STORIES' },
  { text: 'PHOTO EDITING', detail: 'Crafting the final image', category: 'VISUAL STORIES' },
  { text: 'VIDEO EDITING', detail: 'A story in every cut', category: 'VISUAL STORIES' },
  { text: 'DIGITAL DESIGN', detail: 'An experience worth keeping', category: 'VISUAL STORIES' },
  { text: 'STORYTELLING', detail: 'Bringing it all together', category: 'THE CREATOR' },
] as const;

const FRAME_START = 0.125;
const FRAME_END = 0.798;
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
  const at = FRAME_START + index * FRAME_STEP;
  const end = at + FRAME_STEP;
  const opacity = useTransform(progress, [at, at + FRAME_STEP * 0.22, at + FRAME_STEP * 0.77, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [at, at + FRAME_STEP * 0.3, end], [90, 0, -85]);
  const scale = useTransform(progress, [at, at + FRAME_STEP * 0.5, end], [0.90, 1, 1.08]);
  const letterSpacing = useTransform(progress, [at, at + FRAME_STEP * 0.5, end], ['-0.11em', '-0.075em', '-0.055em']);
  const position = index % 4 === 1 ? 'left' : index % 4 === 3 ? 'right' : 'center';

  return (
    <motion.div className={`film-word film-word--${position}`} style={{ opacity, y, scale }} aria-hidden="true">
      <div className="film-word__top">
        <span className="film-word__number">{String(index + 1).padStart(2, '0')} / {SKILLS.length}</span>
        <span className="film-word__category">{skill.category}</span>
      </div>
      <motion.strong style={{ letterSpacing }}>{skill.text}</motion.strong>
      <div className="film-word__bottom">
        <span className="film-word__detail">{skill.detail}</span>
        <span className="film-word__dash" />
      </div>
      <span className="film-word__outline">{skill.text}</span>
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

  const openingOpacity = useTransform(scrollYProgress, [0, 0.07, FRAME_START], [1, 1, 0]);
  const openingScale = useTransform(scrollYProgress, [0, FRAME_START], [1, 1.16]);
  const openingY = useTransform(scrollYProgress, [0, FRAME_START], [0, -65]);

  const backgroundAccentOpacity = useTransform(scrollYProgress, [0, 0.22, 0.6, 0.85], [0.14, 0.38, 0.34, 0.18]);
  const scenePulse = useTransform(scrollYProgress, [0, 0.25, 0.6, 1], [1, 1.2, 0.85, 1.1]);

  const portraitOpacity = useTransform(scrollYProgress, [0.805, 0.88, 1], [0, 1, 1]);
  const portraitScale = useTransform(scrollYProgress, [0.805, 0.92, 1], [1.17, 1, 1.02]);
  const portraitClip = useTransform(
    scrollYProgress,
    [0.805, 0.93],
    ['inset(48% 47% 48% 47% round 120px)', 'inset(0% 0% 0% 0% round 0px)']
  );
  const finalTextOpacity = useTransform(scrollYProgress, [0.86, 0.955], [0, 1]);
  const finalTextY = useTransform(scrollYProgress, [0.86, 0.955], [55, 0]);
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
    <section ref={sectionRef} className="film-track" id="home" aria-label="Scroll through Kaveeth's creative skills to reveal his portrait">
      <div className="film-stage">
        <div className="film-grid" aria-hidden="true" />
        <motion.div className="film-glow" style={{ opacity: backgroundAccentOpacity, scale: scenePulse }} aria-hidden="true" />
        <div className="film-crosshair" aria-hidden="true"><span /><span /></div>

        <div className="film-topline" aria-hidden="true">
          <span>KM® / CREATIVE PORTFOLIO</span>
          <span className="film-topline__right">CODE <span className="film-live-dot" /> CREATE <span className="film-live-dot" /> CAPTURE</span>
        </div>

        <motion.div className="film-opening" style={{ opacity: openingOpacity, scale: openingScale, y: openingY }}>
          <p className="eyebrow"><span className="eyebrow-dot" /> AN INTRODUCTION IN MOTION</p>
          <h1>THE ART OF<br /><span>MAKING</span> <em>THINGS.</em></h1>
          <div className="film-opening__footer">
            <span>CREATIVE THINKING / TECHNICAL MAKING</span>
            <span>SCROLL TO BEGIN <ArrowDownRight size={16} strokeWidth={1.6} /></span>
          </div>
        </motion.div>

        <div className="film-words" aria-hidden="true">
          {SKILLS.map((skill, index) => (
            <SkillFrame key={skill.text} skill={skill} index={index} progress={scrollYProgress} />
          ))}
        </div>

        <motion.div className="film-reveal" style={{ opacity: portraitOpacity }}>
          <motion.div className="film-reveal__portrait" style={{ clipPath: portraitClip, scale: portraitScale }}>
            <Image
              src="/profile-v2.webp"
              alt="Portrait of Kaveeth Manodhya"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 52vw"
              className="film-reveal__image"
            />
            <span className="film-reveal__image-shade" aria-hidden="true" />
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
          <span>01 — {SKILLS.length + 2}</span>
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
