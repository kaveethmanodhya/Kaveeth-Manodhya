'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function GlitchProfileImage({ startGlitch }: { startGlitch: boolean }) {
  const [phase, setPhase] = useState<'idle' | 'initial_glitch' | 'idle_wait' | 'intense_glitch' | 'code' | 'glitching_in' | 'done'>('idle');
  const [codeLines, setCodeLines] = useState<string[]>([]);

  useEffect(() => {
    if (!startGlitch) return;

    let glitcheTimeout: NodeJS.Timeout;
    let codeTypeInterval: NodeJS.Timeout;
    let seq1: NodeJS.Timeout, seq2: NodeJS.Timeout, seq3: NodeJS.Timeout;

    const triggerGlitchSequence = () => {
      setPhase('initial_glitch');
      
      seq1 = setTimeout(() => {
        setPhase('idle_wait');
        
        seq2 = setTimeout(() => {
          setPhase('intense_glitch');
          
          seq3 = setTimeout(() => {
            setPhase('code');
            setCodeLines([]); 
            
            const lines = [
              "ERROR: Image sector corruption detected...",
              "> Attempting auto-recovery...",
              "> Re-compiling visual assets...",
              "> Neural net restoring pixels...",
              "> [████████████] 100%",
              "SUCCESS: Profile image restored."
            ];
            
            let currentLine = 0;
            codeTypeInterval = setInterval(() => {
              if (currentLine < lines.length) {
                setCodeLines(prev => [...prev, lines[currentLine]]);
                currentLine++;
              } else {
                clearInterval(codeTypeInterval);
                setTimeout(() => {
                  setPhase('glitching_in');
                  setTimeout(() => {
                    setPhase('done');
                    const nextDelay = Math.random() * 15000 + 15000;
                    glitcheTimeout = setTimeout(triggerGlitchSequence, nextDelay);
                  }, 1500);
                }, 2000);
              }
            }, 300);
          }, 1200); // 1.2s intense glitch before code
        }, 3000); 
      }, 500); 
    };

    glitcheTimeout = setTimeout(triggerGlitchSequence, 5000);

    return () => {
      clearTimeout(glitcheTimeout);
      clearTimeout(seq1);
      clearTimeout(seq2);
      clearTimeout(seq3);
      clearInterval(codeTypeInterval);
    };
  }, [startGlitch]);

  const initialGlitchAnim = {
    x: [0, -15, 20, -10, 0],
    y: [0, 10, -15, 10, 0],
    skewX: [0, 15, -15, 10, 0],
    filter: [
      'hue-rotate(0deg)', 
      'hue-rotate(90deg) invert(0.8)', 
      'hue-rotate(-90deg) contrast(2)', 
      'hue-rotate(180deg) invert(1)', 
      'hue-rotate(0deg)'
    ],
    opacity: [1, 0.5, 1, 0.8, 1],
    transition: { duration: 0.5, ease: "linear" }
  };

  const intenseGlitchAnim = {
    x: [0, -30, 40, -20, 50, -30, 0],
    y: [0, 20, -30, 40, -15, 20, 0],
    skewX: [0, 30, -40, 50, -30, 20, 0],
    scale: [1, 1.1, 0.9, 1.3, 0.7, 1.2, 0],
    filter: [
      'hue-rotate(0deg)', 
      'hue-rotate(90deg) invert(1)', 
      'hue-rotate(-90deg) blur(2px)', 
      'hue-rotate(180deg) invert(1)', 
      'hue-rotate(270deg) contrast(3)', 
      'brightness(3) blur(10px)',
      'brightness(0)'
    ],
    opacity: [1, 1, 1, 1, 1, 1, 0],
    transition: { duration: 1.2, ease: "easeInOut" }
  };

  const glitchInAnim = {
    x: [20, -20, 10, -5, 0],
    y: [-15, 15, -10, 5, 0],
    scale: [1.3, 1.1, 1.05, 1],
    skewX: [30, -20, 10, 0],
    filter: [
      'blur(10px) hue-rotate(-90deg) invert(1)', 
      'blur(4px) hue-rotate(90deg) contrast(2)', 
      'hue-rotate(0deg) contrast(1)'
    ],
    opacity: [0, 0.5, 1, 1],
    transition: { duration: 1.2, ease: "easeOut" }
  };

  const isNormalPhase = phase === 'idle' || phase === 'idle_wait' || phase === 'done';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 0 }}>
      {/* BACKGROUND GLOW */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', opacity: 0.3, background: 'radial-gradient(circle, rgba(162,89,255,0.5) 0%, transparent 70%)', zIndex: 0 }} />
      
      {/* Normal Image */}
      <div style={{ 
        width: '100%', height: '100%', position: 'absolute', zIndex: 1, 
        opacity: isNormalPhase ? 1 : 0, 
        transition: 'opacity 0.0s' 
      }}>
        <Image src="/profile-pic.png" alt="Kaveeth Manodhya" fill className="profile-mask" style={{ objectFit: 'contain' }} priority />
      </div>

      {/* Initial Glitch Phase */}
      {phase === 'initial_glitch' && (
        <motion.div
          animate={initialGlitchAnim as any}
          style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 3 }}
        >
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 30%)', transform: 'translateX(-10px)', filter: 'hue-rotate(90deg)' }}>
             <Image src="/profile-pic.png" alt="Glitch 1" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 30%, 100% 30%, 100% 70%, 0 70%)', transform: 'translateX(10px)', filter: 'invert(1)' }}>
             <Image src="/profile-pic.png" alt="Glitch 2" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 70%, 100% 70%, 100% 100%, 0 100%)', transform: 'translateY(-10px)' }}>
             <Image src="/profile-pic.png" alt="Glitch 3" fill style={{ objectFit: 'contain' }} priority />
          </div>
        </motion.div>
      )}

      {/* Intense Glitch Phase (Replaces Dust) */}
      {phase === 'intense_glitch' && (
        <motion.div
          animate={intenseGlitchAnim as any}
          style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 3 }}
        >
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 100% 0, 100% 25%, 0 25%)', transform: 'translateX(25px)' }}>
             <Image src="/profile-pic.png" alt="Glitch 1" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 25%, 100% 25%, 100% 50%, 0 50%)', transform: 'translateX(-25px)', filter: 'hue-rotate(90deg)' }}>
             <Image src="/profile-pic.png" alt="Glitch 2" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 50%, 100% 50%, 100% 75%, 0 75%)', transform: 'translateX(30px) scale(1.1)', filter: 'invert(1)' }}>
             <Image src="/profile-pic.png" alt="Glitch 3" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 75%, 100% 75%, 100% 100%, 0 100%)', transform: 'translateY(15px)' }}>
             <Image src="/profile-pic.png" alt="Glitch 4" fill style={{ objectFit: 'contain' }} priority />
          </div>
        </motion.div>
      )}

      {/* Code Phase */}
      {(phase === 'code' || phase === 'glitching_in') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: phase === 'glitching_in' ? 0 : 1, scale: 1 }}
          transition={{ duration: phase === 'glitching_in' ? 1.0 : 0.5, ease: "easeOut" }}
          style={{ 
            width: '100%', height: '100%', position: 'absolute', zIndex: 2,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 'clamp(8px, 2.5vw, 12px)', color: '#00e5a0',
            background: 'rgba(8,8,8,0.95)', border: '1px solid rgba(0, 229, 160, 0.3)', padding: '16px'
          }}
        >
          <div style={{ textAlign: 'left', width: '100%', maxWidth: '95%' }}>
            {codeLines.map((line, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.2 }}
                style={{ marginBottom: 6, color: line && line.startsWith('ERROR') ? '#ff4d8d' : '#00e5a0', textShadow: '0 0 8px currentColor', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {line}
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ width: 10, height: 16, background: '#00e5a0', display: 'inline-block', marginTop: 4, boxShadow: '0 0 8px #00e5a0' }}
            />
          </div>
        </motion.div>
      )}

      {/* Glitch In Phase */}
      {phase === 'glitching_in' && (
        <motion.div
          animate={glitchInAnim as any}
          style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 3 }}
        >
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 40%)', transform: 'translateX(15px)', filter: 'hue-rotate(-90deg)' }}>
             <Image src="/profile-pic.png" alt="Glitch 1" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 40%, 100% 40%, 100% 60%, 0 60%)', transform: 'translateX(-15px)', filter: 'hue-rotate(180deg)' }}>
             <Image src="/profile-pic.png" alt="Glitch 2" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)', transform: 'translateY(10px)' }}>
             <Image src="/profile-pic.png" alt="Glitch 3" fill style={{ objectFit: 'contain' }} priority />
          </div>
        </motion.div>
      )}
    </div>
  );
}
