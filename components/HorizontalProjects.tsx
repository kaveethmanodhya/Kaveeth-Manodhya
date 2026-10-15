'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// Add new project objects here. The scroll distance is measured from the
// rendered cards, so there are no hard-coded project counts or scroll widths.
const projects = [
  {
    name: 'Ceylon Gate',
    category: 'TRAVEL & WEB DEVELOPMENT',
    image: '/ceylongate.png',
    url: 'https://ceylongate.com',
    description: 'A modern travel website presenting Sri Lanka through destinations, tours, and thoughtful web design.',
  },
  {
    name: 'KodexLK',
    category: 'DIGITAL SERVICES & WEB SOLUTIONS',
    image: '/kodexlk-logo.webp',
    url: 'https://kodexlk.online',
    description: 'A creative digital services platform offering website development, design, and customised online solutions.',
  },
  {
    name: 'Alpha Crew',
    category: 'PHOTOGRAPHY & WEB',
    image: '/alpha-crew.png',
    url: 'https://alphacrewweb.vercel.app',
    description: 'Photography, visual storytelling, and a digital home for a growing creative brand.',
  },
];

type Geometry = { enabled: boolean; distance: number; height: number };

export default function HorizontalProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<Geometry>({
    enabled: false,
    distance: 0,
    height: 0,
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Pin the stage and translate one pixel sideways for each pixel scrolled.
  // This also works in reverse when the visitor scrolls upwards.
  const x = useTransform(scrollYProgress, [0, 1], [0, -geometry.distance]);
  const progressX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    let request = 0;
    const measure = () => {
      const stacked = window.matchMedia(
        '(max-width: 767px), (prefers-reduced-motion: reduce)'
      ).matches;
      const distance = Math.max(0, Math.ceil(track.scrollWidth - viewport.clientWidth));
      const enabled = !stacked && distance > 1;
      const next: Geometry = {
        enabled,
        distance: enabled ? distance : 0,
        height: enabled ? Math.ceil(window.innerHeight + distance) : 0,
      };
      setGeometry(previous =>
        previous.enabled === next.enabled &&
        previous.distance === next.distance &&
        previous.height === next.height ? previous : next
      );
    };

    const schedule = () => {
      cancelAnimationFrame(request);
      request = requestAnimationFrame(measure);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(viewport);
    observer.observe(track);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    window.addEventListener('resize', schedule);
    reducedMotion.addEventListener('change', schedule);
    schedule();

    return () => {
      cancelAnimationFrame(request);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="horizontal-projects"
      data-pinned={geometry.enabled ? 'true' : 'false'}
      style={geometry.enabled ? { height: geometry.height } : undefined}
      aria-label="Selected work"
    >
      <div className="horizontal-projects__sticky">
        <div className="horizontal-projects__heading">
          <div className="new-section-top"><span>03 / SELECTED WORK</span></div>
          <div className="horizontal-projects__heading-row">
            <h2 className="new-big-title">THE <em>WORK.</em></h2>
            <p>SCROLL TO EXPLORE <span aria-hidden="true">↗</span></p>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="horizontal-projects__viewport"
          role="region"
          aria-label="Project gallery"
          tabIndex={geometry.enabled ? -1 : 0}
        >
          <motion.div
            ref={trackRef}
            className="horizontal-projects__track"
            style={{ x: geometry.enabled ? x : 0 }}
          >
            {projects.map((project, index) => (
              <article className="horizontal-projects__card" key={project.name}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name}`}
                >
                  <div className="horizontal-projects__image">
                    <Image
                      src={project.image}
                      alt={`${project.name} preview`}
                      fill
                      sizes="(max-width: 767px) 86vw, (max-width: 1200px) 48vw, 580px"
                    />
                    <span className="horizontal-projects__open" aria-hidden="true">
                      <ArrowUpRight size={25} />
                    </span>
                  </div>
                  <div className="horizontal-projects__metadata">
                    <span>{String(index + 1).padStart(2, '0')} / {project.category}</span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </a>
              </article>
            ))}
          </motion.div>
        </div>

        <div className="horizontal-projects__footer" aria-hidden="true">
          <span>SELECTED WORK</span>
          <div className="horizontal-projects__progress">
            <motion.span style={{ scaleX: geometry.enabled ? progressX : 1 }} />
          </div>
          <span>{String(projects.length).padStart(2, '0')} PROJECTS</span>
        </div>
      </div>
    </section>
  );
}
