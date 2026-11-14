'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Github, Youtube, Facebook, Linkedin, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
import dynamic from 'next/dynamic';
import SectionBackground from '../components/SectionBackground';
import defaults from '../data/portfolio.json';
import type { PortfolioContent } from '../lib/portfolio';

// Lazy loaded components for better performance
const CinematicIntro = dynamic(() => import('../components/CinematicIntro'), { ssr: false });
const GlitchProfileImage = dynamic(() => import('../components/GlitchProfileImage'), { ssr: false });
const Resume = dynamic(() => import('../components/Resume'));
const Projects = dynamic(() => import('../components/Projects'));
const Services = dynamic(() => import('../components/Services'));
const Contact = dynamic(() => import('../components/Contact'));

export default function Portfolio() {
  const [introComplete, setIntroComplete] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [viewCount, setViewCount] = useState<string>('---');
  const [isAdmin, setIsAdmin] = useState(false);
  const [content, setContent] = useState<PortfolioContent>(defaults);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  useEffect(() => { fetch('/api/portfolio', { cache: 'no-store' }).then(r => r.json()).then(d => { if (d?.hero && d?.projects) setContent(d); }).catch(() => {}); }, []);

  // Admin & view count
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('portfolio_k_admin') === 'true') setIsAdmin(true);
    fetch('/api/views').then(r => r.json()).then(d => { if (d?.count) setViewCount(d.count); }).catch(() => {});
  }, []);

  const handleSecretClick = () => {
    const s = !isAdmin; setIsAdmin(s);
    if (typeof window !== 'undefined') { s ? localStorage.setItem('portfolio_k_admin', 'true') : localStorage.removeItem('portfolio_k_admin'); }
  };

  const socialLinks = [
    ...content.socialLinks.map(link => ({ ...link, icon: ({ GitHub: Github, YouTube: Youtube, LinkedIn: Linkedin, Facebook: Facebook } as Record<string, typeof Github>)[link.name] || Github }))
  ];

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  // Lenis smooth scroll
  useEffect(() => {
    if (!introComplete) return;
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [introComplete]);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    const onMouse = (e: MouseEvent) => { mousePos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousemove', onMouse);
    onScroll();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse); };
  }, []);

  // Interactive canvas bg
  useEffect(() => {
    if (!introComplete) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let afId: number;
    let pts: { x: number; y: number; ox: number; oy: number; vx: number; vy: number; c: string }[] = [];
    const sp = 45, ir = 250, vr = 350, rs = 0.02;
    const cols = ['79,142,247', '162,89,255', '0,212,255', '255,77,141', '0,229,160'];

    const init = () => {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight; pts = [];
      for (let x = 0; x < canvas.width; x += sp) for (let y = 0; y < canvas.height; y += sp)
        pts.push({ x, y, ox: x, oy: y, vx: 0, vy: 0, c: cols[Math.floor(Math.random() * cols.length)] });
    };
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const m = mousePos.current;
      pts.forEach(p => {
        const dx = m.x - p.x, dy = m.y - p.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < ir) { const f = ((ir - d) / ir) ** 2; const a = Math.atan2(dy, dx); p.vx -= Math.cos(a) * f * 2.5; p.vy -= Math.sin(a) * f * 2.5; }
        p.vx += (p.ox - p.x) * rs; p.vy += (p.oy - p.y) * rs; p.vx *= 0.92; p.vy *= 0.92; p.x += p.vx; p.y += p.vy;
        if (d < vr) { const op = Math.max(0, (1 - d / vr) ** 2 * 0.6); if (op > 0.01) { ctx.fillStyle = `rgba(${p.c},${op})`; ctx.fillRect(p.x - 1, p.y - 3, 2, 6); } }
      });
      afId = requestAnimationFrame(animate);
    };
    init(); animate();
    const onResize = () => init();
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(afId); };
  }, [introComplete]);

  return (
    <>
      {/* ── CINEMATIC INTRO ── */}
      {!introComplete && <CinematicIntro onComplete={handleIntroComplete} profileImage={content.hero.profileImage} />}

      {/* ── MAIN PORTFOLIO ── */}
      <div
        style={{
          opacity: introComplete ? 1 : 0,
          transition: 'opacity 0.8s ease-in',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          minHeight: '100vh',
          position: 'relative',
          overflowX: 'clip',
        }}
        className="noise-overlay"
      >
        <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none hidden md:block" />

        {/* ── NAV (Desktop) ── */}
        <nav
          className="hidden md:flex fixed top-0 w-full z-[100] transition-all duration-500 justify-center items-center"
          style={{
            background: isScrolled ? 'rgba(8,8,8,0.85)' : 'transparent',
            backdropFilter: isScrolled ? 'blur(20px)' : 'none',
            borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
            padding: isScrolled ? '14px 24px' : '28px 24px',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ display: 'flex', gap: 36, fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
            {navItems.map(item => (
              <a key={item.label} href={item.href} style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >{item.label}</a>
            ))}
          </div>
        </nav>

        {/* ── NAV (Mobile) ── */}
        <div
          className="flex md:hidden fixed bottom-0 left-0 right-0 z-[100] justify-around items-center"
          style={{
            padding: '16px 12px', background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)',
            fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)',
            pointerEvents: 'auto',
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          }}
        >
          {navItems.slice(0, 4).map(item => (
            <a key={item.label} href={item.href} style={{ textDecoration: 'none', color: 'inherit', padding: '8px 12px', display: 'block' }}>{item.label}</a>
          ))}
        </div>

        {/* ── FLOATING SOCIALS ── */}
        <div className="hidden md:flex flex-col gap-[14px]" style={{ position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 60 }}>
          {socialLinks.map(link => {
            const Icon = link.icon;
            return (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" title={link.name}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)',
                  backdropFilter: 'blur(8px)', transition: 'all 0.3s', color: 'var(--text-secondary)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = link.accent; e.currentTarget.style.transform = 'translateX(-4px) scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'none'; }}
              >
                <Icon style={{ width: 16, height: 16 }} />
              </a>
            );
          })}
        </div>

        {/* ══════════ HERO ══════════ */}
        <SectionBackground 
          theme="hero" 
          className="relative min-h-screen"
          contentClassName="flex flex-col items-center justify-center text-center px-6 pb-20 pt-[130px] md:pt-[210px]"
        >
          {/* Ambient glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,142,247,0.15) 0%, rgba(162,89,255,0.08) 40%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

          {/* Profile image with Glitch Effect */}
          <div className="-translate-y-[40px] mb-[-50px] md:translate-y-[40px] md:mb-0" style={{ position: 'relative', zIndex: 2 }}>
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ position: 'relative', width: 'clamp(340px, 90vw, 450px)', height: 'clamp(340px, 90vw, 450px)', zIndex: 0 }}
            >
              <GlitchProfileImage startGlitch={introComplete} profileImage={content.hero.profileImage} />
            </motion.div>
          </div>

          {/* Title */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.35em', color: 'var(--text-muted)', marginBottom: 20, zIndex: 10, position: 'relative' }}
          >
            {content.hero.eyebrow}
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 10vw, 9rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: 24, zIndex: 10 }}
          >
            <span style={{ color: '#fff' }}>{content.hero.greeting}</span><br />
            <span className="gradient-text">{content.hero.name}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
            style={{ maxWidth: 480, fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 40, zIndex: 10 }}
          >
            {content.hero.description}
          </motion.p>

          {/* CTA buttons — properly spaced */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', zIndex: 10 }}
          >
            <a href="#projects" style={{
              display: 'inline-flex', alignItems: 'center', padding: '14px 32px',
              borderRadius: 999, background: 'var(--grad-hero)', color: '#fff',
              fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'transform 0.3s, box-shadow 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(79,142,247,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
            >{content.hero.primaryButton}</a>
            <a href="#contact" style={{
              display: 'inline-flex', alignItems: 'center', padding: '14px 32px',
              borderRadius: 999, background: 'transparent', border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
              backdropFilter: 'blur(8px)', transition: 'transform 0.3s, border-color 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
            >{content.hero.secondaryButton}</a>
          </motion.div>



          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--text-muted)' }}>Scroll</span>
            <ChevronDown className="bounce-slow" style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
          </motion.div>
        </SectionBackground>

        {/* ══════════ ABOUT ══════════ */}
        <SectionBackground theme="about" style={{ padding: '80px 0' }}>
          <div id="about" style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7 }}>
              <p className="section-number" style={{ marginBottom: 12 }}>{content.about.eyebrow}</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 32 }}>
                {content.about.heading}<span className="gradient-text">.</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {content.about.paragraphs.map((paragraph, index) => (<p key={index} style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)' }}>{paragraph}</p>))}
              </div>
            </motion.div>
          </div>
        </SectionBackground>

        {/* ══════════ SERVICES ══════════ */}
        <SectionBackground theme="services">
          <Services items={content.services} headings={content.headings} />
        </SectionBackground>

        {/* ══════════ PROJECTS ══════════ */}
        <SectionBackground theme="projects">
          <Projects items={content.projects} headings={content.headings} />
        </SectionBackground>

        {/* ══════════ RESUME / EXPERIENCE ══════════ */}
        <SectionBackground theme="experience">
          <div id="experience" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
            <Resume experiencesData={content.experiences} educationData={content.education} skillsData={content.skills} statsData={content.stats} headings={content.headings} />
          </div>
        </SectionBackground>

        {/* ══════════ CONTACT ══════════ */}
        <SectionBackground theme="contact">
          <Contact details={content.contact} />
        </SectionBackground>

        {/* ══════════ FOOTER ══════════ */}
        <footer style={{
          width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 20, padding: '48px 24px 100px',
          position: 'relative', zIndex: 30, color: 'var(--text-muted)', fontSize: 13,
        }}>
          <div style={{ position: 'absolute', bottom: '50%', left: '50%', transform: 'translate(-50%,50%)', width: 200, height: 100, borderRadius: '50%', filter: 'blur(40px)', opacity: 0.15, background: 'var(--grad-hero)', pointerEvents: 'none' }} />

          {isAdmin && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '8px 20px', borderRadius: 999,
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(12px)',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Profile Views</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--accent-blue)' }}>{viewCount}</span>
            </div>
          )}

          <p style={{ cursor: 'default', userSelect: 'none', transition: 'color 0.3s' }}
            onDoubleClick={handleSecretClick} title="© 2026 Kaveeth Manodhya"
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >{content.footer.copyright}</p>
        </footer>
      </div>
    </>
  );
}