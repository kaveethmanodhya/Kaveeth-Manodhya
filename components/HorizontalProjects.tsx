'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// Add new project objects to this list. Horizontal scroll distance is
// measured from the rendered cards, so future projects work automatically.
type Project = {
  name: string;
  category: string;
  image: string;
  description: string;
  url?: string;
  isOngoing?: boolean;
};

const projects: Project[] = [
  {
    name: 'Ceylon Gate',
    category: 'WEB DEVELOPMENT',
    image: '/ceylongate.png',
    url: 'https://ceylongate.com',
    description: 'A travel and tourism website featuring destinations, tour experiences, and a modern browsing experience.',
  },
  {
    name: 'KodexLK Platform',
    category: 'DIGITAL SERVICES & WEB SOLUTIONS',
    image: '/kodexlk-logo.webp',
    url: 'https://kodexlk.online',
    description: 'A digital services platform offering website development, creative design, and customised online solutions.',
  },
  {
    name: 'Alpha Crew Website',
    category: 'PHOTOGRAPHY & WEB DEVELOPMENT',
    image: '/alpha-crew.png',
    url: 'https://alphacrewweb.vercel.app',
    description: 'The online portfolio for Alpha Crew Photography, presenting portraits, events, and visual storytelling.',
  },
  {
    name: 'Portfolio Website',
    category: 'PERSONAL WEB DEVELOPMENT',
    image: '/profile-v2.webp',
    url: 'https://kaveeth-manodhya.vercel.app',
    description: 'My personal portfolio showcasing selected projects, technical skills, creative work, and professional experience.',
  },
  {
    name: 'Travel & Tours Platform',
    category: 'WEB DEVELOPMENT / IN PROGRESS',
    image: '/tourism-ongoing.png',
    description: 'An upcoming travel platform designed to make exploring destinations and planning trips more convenient.',
    isOngoing: true,
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
            {projects.map((project, index) => {
              const content = (
                <>
                  <div className="horizontal-projects__image">
                    <Image
                      src={project.image}
                      alt={`${project.name} preview`}
                      fill
                      sizes="(max-width: 767px) 86vw, (max-width: 1200px) 48vw, 580px"
                    />
                    {project.isOngoing ? (
                      <span className="horizontal-projects__coming-soon">COMING SOON</span>
                    ) : (
                      <span className="horizontal-projects__open" aria-hidden="true">
                        <ArrowUpRight size={25} />
                      </span>
                    )}
                  </div>
                  <div className="horizontal-projects__metadata">
                    <span>{String(index + 1).padStart(2, '0')} / {project.category}</span>
                    {!project.isOngoing && <ArrowUpRight size={18} aria-hidden="true" />}
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </>
              );

              return (
                <article
                  className="horizontal-projects__card"
                  data-ongoing={project.isOngoing ? 'true' : undefined}
                  key={project.name}
                >
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.name}`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="horizontal-projects__card-content">{content}</div>
                  )}
                </article>
              );
            })}
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
