'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import type { PortfolioContent } from '../lib/portfolio';
import { Briefcase, GraduationCap, MapPin, Mail, Calendar, ExternalLink } from 'lucide-react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';


function AnimatedNumber({ end, suffix = "+" }: { end: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2500, bounce: 0 });
  
  React.useEffect(() => {
    if (isInView) {
      motionValue.set(end);
    }
  }, [isInView, end, motionValue]);

  const rounded = useTransform(springValue, (latest) => Math.floor(latest));
  const display = useTransform(rounded, (latest) => `${latest}${suffix}`);

  return <motion.span ref={ref}>{display}</motion.span>;
}

function ExperienceCard({ exp, index, isInView }: { exp: any; index: number; isInView: boolean }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
      className="group relative glass-card"
      style={{
        borderRadius: 24,
        padding: '32px 40px',
        border: `1px solid var(--border-subtle)`,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = exp.borderColor;
        el.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--border-subtle)';
        el.style.transform = 'translateY(0)';
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          borderRadius: 24,
          background: `linear-gradient(135deg, rgba(79,142,247,0.06) 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            {exp.logo && (
              <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', padding: 8, position: 'relative' }}>
                <Image src={exp.logo} alt="" fill style={{ objectFit: 'contain' }} sizes="48px" />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 700, color: '#fff' }}>
                {exp.role}
              </h3>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: exp.accentColor }}>
                {exp.company}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar style={{ width: 14, height: 14 }} />
              <span>{exp.period}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin style={{ width: 14, height: 14 }} />
              <span>{exp.location}</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          style={{ overflow: 'hidden' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '0.25rem' }}>
            {exp.description.map((item: string, i: number) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                <span style={{ marginTop: '0.5rem', width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: exp.accentColor }} />
                {item}
              </li>
            ))}
          </ul>

          {exp.url && (
            <div style={{ paddingTop: '1.5rem' }}>
              <a
                href={exp.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: exp.accentColor, transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <ExternalLink style={{ width: 16, height: 16 }} />
                Visit Website
              </a>
            </div>
          )}
        </motion.div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            alignSelf: 'flex-start',
            marginTop: isExpanded ? '1rem' : '0',
            padding: '8px 16px',
            borderRadius: '999px',
            border: '1px solid var(--border-subtle)',
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = 'var(--border-medium)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          {isExpanded ? 'Hide Details' : 'View Details'}
        </button>
      </div>
    </motion.div>
  );
}

export default function Resume({ experiencesData, educationData, skillsData, statsData, headings }: { experiencesData:PortfolioContent['experiences']; educationData:PortfolioContent['education']; skillsData:PortfolioContent['skills']; statsData:PortfolioContent['stats']; headings:PortfolioContent['headings'] }) {
  const experiences = experiencesData.map((item,index)=>({...item,borderColor:['rgba(0, 229, 160, 0.25)','rgba(79,142,247,0.25)','rgba(162,89,255,0.25)'][index%3]}));
  const education = educationData;
  const skills = skillsData;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <div ref={sectionRef} style={{ width: '100%', maxWidth: 1024, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6rem', padding: '80px 0' }}>
      {/* Experience Section */}
      <section id="experience" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-number" style={{ marginBottom: 12 }}>{headings.experienceEyebrow}</p>
          <h2
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 4.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}
          >
            {headings.experience}
            <span className="gradient-text">.</span>
          </h2>
        </motion.div>

        {/* Experience Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}
        >
          <div className="glass-card" style={{ padding: '32px 24px', borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 700, color: 'var(--accent-blue)', lineHeight: 1 }}>
              <AnimatedNumber end={statsData[0]?.value ?? 6} suffix={statsData[0]?.suffix ?? '+'} />
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 16 }}>{statsData[0]?.label ?? 'Years Experience'}</span>
          </div>
          <div className="glass-card" style={{ padding: '32px 24px', borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 700, color: 'var(--accent-purple)', lineHeight: 1 }}>
              <AnimatedNumber end={statsData[1]?.value ?? 150} suffix={statsData[1]?.suffix ?? '+'} />
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 16 }}>{statsData[1]?.label ?? 'Various Projects'}</span>
          </div>
          <div className="glass-card" style={{ padding: '32px 24px', borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 700, color: 'var(--accent-pink)', lineHeight: 1 }}>
              <AnimatedNumber end={statsData[2]?.value ?? 100} suffix={statsData[2]?.suffix ?? '+'} />
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 16 }}>{statsData[2]?.label ?? 'Happy Customers'}</span>
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} exp={exp} index={index} isInView={isInView} />
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section id="education" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="section-number" style={{ marginBottom: 12 }}>{headings.educationEyebrow}</p>
          <h2
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 4.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}
          >
            {headings.education}
            <span className="gradient-text">.</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="group relative glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 24,
                padding: '32px',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'var(--border-medium)';
                el.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'var(--border-subtle)';
                el.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                {edu.logo && (
                  <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', padding: 8, position: 'relative' }}>
                    <Image src={edu.logo} alt="" fill style={{ objectFit: 'contain' }} sizes="48px" />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h3
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}
                  >
                    {edu.institution}
                  </h3>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: edu.accentColor }}>
                    {edu.degree}
                  </p>
                </div>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
              >
                <Calendar style={{ width: 14, height: 14 }} />
                <span>{edu.period}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >
          <p className="section-number" style={{ marginBottom: 12 }}>{headings.skillsEyebrow}</p>
          <h2
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 4.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}
          >
            {headings.skills}
            <span className="gradient-text">.</span>
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
              className="tag-pill cursor-default"
              style={{
                padding: '10px 20px',
                fontSize: '0.85rem',
                borderRadius: '999px',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'var(--border-medium)';
                el.style.color = 'var(--text-primary)';
                el.style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'var(--border-subtle)';
                el.style.color = 'var(--text-secondary)';
                el.style.background = 'rgba(255,255,255,0.04)';
              }}
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
