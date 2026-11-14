'use client';

import React, { useState } from 'react';
import type { PortfolioContent } from '../lib/portfolio';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle, AlertCircle, Mail, User, MessageSquare } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  message: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Contact({details}:{details:PortfolioContent['contact']}) {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', message: '' }); setTimeout(() => setStatus('idle'), 5000); }
      else { setStatus('error'); setTimeout(() => setStatus('idle'), 4000); }
    } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 4000); }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: `1px solid ${focusedField === field ? 'var(--accent-blue)' : form[field as keyof FormState] ? 'var(--border-medium)' : 'var(--border-subtle)'}`,
    color: 'var(--text-primary)', padding: '16px 0', fontSize: 15,
    fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color 0.3s', borderRadius: 0,
  });

  const labelStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
    fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 4,
  };

  return (
    <section id="contact" style={{ position: 'relative', padding: 'clamp(80px,12vw,160px) 0' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(162,89,255,0.06) 0%, transparent 70%)' }} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p className="section-number" style={{ marginBottom: 16 }}>{details.eyebrow}</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 900, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            {details.headlineTop}<br />
            <span className="gradient-text">{details.headlineBottom}</span>
          </h2>
          <p style={{ marginTop: 24, fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 420 }}>
            {details.description}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40, marginBottom: 40 }}>
            <div>
              <label htmlFor="name" style={labelStyle}><User style={{ width: 12, height: 12 }} />Your Name</label>
              <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
                onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                placeholder="Kaveeth Manodhya" style={inputStyle('name')} disabled={status === 'loading'} autoComplete="off" />
            </div>
            <div>
              <label htmlFor="email" style={labelStyle}><Mail style={{ width: 12, height: 12 }} />Email Address</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                placeholder="hello@email.com" style={inputStyle('email')} disabled={status === 'loading'} autoComplete="off" />
            </div>
          </div>

          <div style={{ marginBottom: 40 }}>
            <label htmlFor="message" style={labelStyle}><MessageSquare style={{ width: 12, height: 12 }} />Message</label>
            <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange}
              onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
              placeholder="Tell me about your project, idea, or just say hello..."
              style={{ ...inputStyle('message'), resize: 'none' as const }} disabled={status === 'loading'} />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <motion.button id="contact-submit-btn" type="submit" disabled={status === 'loading' || status === 'success'}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 32px', borderRadius: 999,
                border: '1px solid var(--border-medium)',
                background: status === 'success' ? 'rgba(0,229,160,0.1)' : 'rgba(255,255,255,0.06)',
                color: status === 'success' ? 'var(--accent-green)' : 'var(--text-primary)',
                fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-body)',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s', backdropFilter: 'blur(8px)',
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' && <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />}
              {status === 'success' && <CheckCircle style={{ width: 16, height: 16 }} />}
              {status === 'error' && <AlertCircle style={{ width: 16, height: 16, color: '#ef4444' }} />}
              {status === 'idle' && <Send style={{ width: 16, height: 16 }} />}
              {status === 'idle' && 'Send Message'}
              {status === 'loading' && 'Sending...'}
              {status === 'success' && 'Message Sent!'}
              {status === 'error' && 'Try Again'}
            </motion.button>

            {status === 'success' && (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 13, color: 'var(--accent-green)' }}>✓ I&apos;ll get back to you shortly.</motion.p>
            )}
            {status === 'error' && (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 13, color: '#ef4444' }}>Something went wrong. Please try again.</motion.p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
