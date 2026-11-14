'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Camera, Youtube, ChevronRight } from 'lucide-react';
import type { PortfolioContent } from '../lib/portfolio';


export default function Services({items,headings}:{items:PortfolioContent['services'];headings:PortfolioContent['headings']}) {
  const services = items.map((item,index) => ({...item, number:String(index+1).padStart(2,'0'),icon:[Code2,Camera,Youtube][index%3],accentColor:['var(--accent-blue)','var(--accent-purple)','var(--accent-pink)'][index%3],gradient:['linear-gradient(135deg, rgba(79,142,247,0.08), rgba(162,89,255,0.04))','linear-gradient(135deg, rgba(162,89,255,0.08), rgba(255,77,141,0.04))','linear-gradient(135deg, rgba(255,77,141,0.08), rgba(255,100,60,0.04))'][index%3],borderColor:['rgba(79,142,247,0.3)','rgba(162,89,255,0.3)','rgba(255,77,141,0.3)'][index%3]}));
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="services" style={{ position: 'relative', padding: '80px 0' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(79,142,247,0.04) 0%, transparent 70%)' }} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        {/* Section header */}
        <div style={{ marginBottom: 56 }}>
          <p className="section-number" style={{ marginBottom: 12 }}>{headings.servicesEyebrow}</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
            {headings.services}<span className="gradient-text">.</span>
          </h2>
        </div>

        {/* Accordion */}
        <div>
          {services.map((service, index) => {
            const isOpen = openIndex === index;
            const Icon = service.icon;

            return (
              <div key={index}>
                {/* Divider */}
                <div style={{ width: '100%', height: 1, background: 'var(--border-subtle)' }} />

                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%', textAlign: 'left', padding: '32px 0',
                    background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 12, flexShrink: 0,
                        color: isOpen ? service.accentColor : 'var(--text-muted)', transition: 'color 0.3s',
                      }}>{service.number}</span>

                      <div style={{
                        flexShrink: 0, padding: 10, borderRadius: 12, transition: 'all 0.3s',
                        background: isOpen ? service.gradient : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isOpen ? service.borderColor : 'var(--border-subtle)'}`,
                      }}>
                        <Icon style={{ width: 20, height: 20, color: isOpen ? service.accentColor : 'var(--text-secondary)', transition: 'color 0.3s' }} />
                      </div>

                      <h3 style={{
                        fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700,
                        color: isOpen ? '#fff' : 'rgba(240,240,240,0.7)', transition: 'color 0.3s',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{service.title}</h3>
                    </div>

                    <ChevronRight style={{
                      width: 18, height: 18, flexShrink: 0, transition: 'transform 0.3s, color 0.3s',
                      color: isOpen ? service.accentColor : 'var(--text-muted)',
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    }} />
                  </div>

                  <p style={{
                    marginTop: 12, paddingLeft: 62, fontSize: 14, lineHeight: 1.6,
                    color: isOpen ? 'var(--text-secondary)' : 'var(--text-muted)', transition: 'color 0.3s',
                  }}>{service.summary}</p>
                </button>

                {/* Expanded content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ paddingLeft: 62, paddingBottom: 32, borderLeft: `2px solid ${service.borderColor}`, marginLeft: 32 }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                          {service.capabilities.map((cap, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06, duration: 0.3 }}
                              style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}
                            >
                              <span style={{ marginTop: 8, width: 4, height: 4, borderRadius: '50%', flexShrink: 0, background: service.accentColor }} />
                              {cap}
                            </motion.li>
                          ))}
                        </ul>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {service.tags.map((tag, i) => (
                            <span key={i} className="tag-pill" style={{ borderColor: service.borderColor, color: service.accentColor }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <div style={{ width: '100%', height: 1, background: 'var(--border-subtle)' }} />
        </div>
      </div>
    </section>
  );
}
