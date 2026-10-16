'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface WorkItem {
  title: string;
  category: string;
  image: string;
  url?: string;
  githubUrl?: string;
  description: string;
  tags: string[];
  accentColor: string;
  isOngoing?: boolean;
}

const workItems: WorkItem[] = [
  {
    title: 'Ceylon Gate',
    category: 'Web Development',
    image: '/ceylongate.png',
    url: 'https://ceylongate.com',
    description: 'Travel and tourism website for Ceylon Gate, showcasing tours, destinations, and booking capabilities.',
    tags: ['Next.js', 'PostgreSQL', 'Framer Motion', 'Cloudinary'],
    accentColor: '#ff4d8d',
  },
  {
    title: 'Kodexlk Platform',
    category: 'Web Platform',
    image: '/kodexlk-logo.webp',
    url: 'https://kodexlk.online',
    githubUrl: 'https://github.com/kaveethmanodhya/Kodexlk',
    description: 'Modern web platform & admin dashboard for digital invitations and event management.',
    tags: ['Next.js', 'MongoDB', 'Cloudinary'],
    accentColor: '#00d4ff',
  },
  {
    title: 'Alpha Crew Website',
    category: 'Web Development',
    image: '/alpha-crew.png',
    url: 'https://alphacrewweb.vercel.app',
    githubUrl: 'https://github.com/kaveeth555/ALPHA-Crew-Website',
    description: 'Official portfolio website for Alpha Crew Photography — event, portrait & lifestyle photography brand.',
    tags: ['Next.js', 'React', 'Cloudinary'],
    accentColor: '#4f8ef7',
  },
  {
    title: 'Portfolio Website',
    category: 'Web Development',
    image: '/profile-pic.png',
    url: 'https://kaveeth-manodhya.vercel.app',
    githubUrl: 'https://github.com/kaveeth555/Kaveeth-Manodhya',
    description: 'Personal portfolio showcasing skills, projects & professional experience.',
    tags: ['Next.js', 'GSAP', 'Framer Motion'],
    accentColor: '#a259ff',
  },
  {
    title: 'Travel & Tours Platform',
    category: 'Web Development (Ongoing)',
    image: '/tourism-ongoing.png',
    description: 'An upcoming comprehensive tourism platform currently in development, focusing on seamless travel experiences.',
    tags: ['Next.js', 'React', 'Tailwind CSS'],
    accentColor: '#f59e0b',
    isOngoing: true,
  },
];

export default function Projects() {
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [paddingLeft, setPaddingLeft] = useState(24);

  useEffect(() => {
    const calculatePadding = () => {
      const windowWidth = window.innerWidth;
      const contentWidth = 800; // max-w-3xl is 768px, but our container uses 800px max-width in page.tsx
      if (windowWidth > contentWidth) {
        setPaddingLeft((windowWidth - contentWidth) / 2 + 24);
      } else {
        setPaddingLeft(24);
      }
    };
    calculatePadding();
    window.addEventListener('resize', calculatePadding);
    return () => window.removeEventListener('resize', calculatePadding);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-85%']);
  const titleY = useTransform(scrollYProgress, [0, 0.1], [0, -40]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <section 
      id="projects" 
      ref={targetRef} 
      style={{ 
        position: 'relative', 
        height: '350svh', // Extends height to allow scrolling, using svh for mobile
      }}
    >
      <div 
        style={{ 
          position: 'sticky', 
          top: 0, 
          height: '100svh', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 70%)' 
        }}
      >
        <motion.div 
          style={{ 
            width: '100%', 
            maxWidth: 800, 
            margin: '0 auto', 
            padding: '0 24px',
            y: titleY,
            opacity: titleOpacity,
            marginBottom: '4vh'
          }}
        >
          <p className="section-number" style={{ marginBottom: 12 }}>— Selected Work</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
              My Work<span className="gradient-text">.</span>
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              Scroll Down <ArrowRight style={{ width: 14, height: 14 }} />
            </p>
          </div>
        </motion.div>

        <motion.div 
          ref={containerRef}
          style={{ 
            x, 
            display: 'flex', 
            width: 'max-content',
            gap: 24, 
            paddingLeft: paddingLeft, 
            paddingRight: paddingLeft,
            alignItems: 'center',
          }}
        >
          {workItems.map((item, index) => (
            <div
              key={index}
              style={{
                flexShrink: 0, 
                width: 360, 
                height: 500,
                borderRadius: 24, 
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--border-subtle)',
                transition: 'border-color 0.3s, transform 0.3s',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = item.accentColor + '80';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                position: 'relative', width: '100%', height: 220,
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  style={{ objectFit: 'cover', opacity: 0.8, filter: item.isOngoing ? 'blur(8px) brightness(0.6)' : 'none', transform: item.isOngoing ? 'scale(1.1)' : 'none' }} 
                  sizes="360px" 
                />
                {item.isOngoing && (
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(8,8,8,0.4)', backdropFilter: 'blur(4px)', zIndex: 10
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 'bold', letterSpacing: '0.2em', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 999, background: 'rgba(0,0,0,0.5)' }}>COMING SOON</span>
                  </div>
                )}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
                  background: 'linear-gradient(to top, rgba(8,8,8,0.9) 0%, transparent 100%)',
                }} />
                <span style={{
                  position: 'absolute', top: 16, left: 16,
                  fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: item.accentColor,
                  padding: '6px 12px', borderRadius: 999,
                  background: 'rgba(8,8,8,0.8)', border: `1px solid ${item.accentColor}40`,
                  backdropFilter: 'blur(12px)',
                }}>{item.category}</span>
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', flex: 1 }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24, marginTop: 16 }}>
                  {item.tags.map((tag, i) => (
                    <span key={i} className="tag-pill" style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(255,255,255,0.05)' }}>{tag}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                        background: 'rgba(255,255,255,0.06)', border: `1px solid ${item.accentColor}40`,
                        color: item.accentColor, textDecoration: 'none', transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    >
                      <ExternalLink style={{ width: 14, height: 14 }} /> Live
                    </a>
                  )}
                  {item.githubUrl && (
                    <a href={item.githubUrl} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                        background: 'transparent', border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      <Github style={{ width: 14, height: 14 }} /> Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
