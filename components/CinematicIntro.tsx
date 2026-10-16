'use client';

import React, { useEffect, useRef, useState } from 'react';

const CODE_LINES = [
  'const developer = {',
  '  name: "Kaveeth Manodhya",',
  '  role: "Full-Stack Developer",',
  '  passion: "Building digital experiences",',
  '  stack: ["React", "Next.js", "Node.js"],',
  '  creative: true,',
  '};',
  '',
  'function createPortfolio(dev) {',
  '  const vision = dev.passion;',
  '  const skills = dev.stack.join(" + ");',
  '  ',
  '  if (dev.creative) {',
  '    return buildExperience({',
  '      design: "pixel-perfect",',
  '      code: "clean & elegant",',
  '      result: "immersive",',
  '    });',
  '  }',
  '}',
  '',
  'createPortfolio(developer);',
  '// Initializing...',
];

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'typing' | 'morph' | 'done'>('typing');
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [spinnerIdx, setSpinnerIdx] = useState(0);
  const spinnerChars = ['|', '/', '-', '\\'];
  const morphProgress = useRef(0);
  const animFrameRef = useRef<number>(0);
  const imageLoaded = useRef<HTMLImageElement | null>(null);

  // Preload profile image
  useEffect(() => {
    const img = new Image();
    img.src = '/profile-pic.png';
    img.onload = () => { imageLoaded.current = img; };
  }, []);

  // Spinner animation
  useEffect(() => {
    if (phase !== 'typing') return;
    const interval = setInterval(() => {
      setSpinnerIdx(prev => (prev + 1) % spinnerChars.length);
    }, 100);
    return () => clearInterval(interval);
  }, [phase, spinnerChars.length]);

  // Typing effect
  useEffect(() => {
    if (phase !== 'typing') return;
    if (currentLineIndex >= CODE_LINES.length) {
      setTimeout(() => setPhase('morph'), 400);
      return;
    }

    const line = CODE_LINES[currentLineIndex];
    if (currentCharIndex <= line.length) {
      const timeout = setTimeout(() => {
        const partial = line.slice(0, currentCharIndex);
        setDisplayedLines(prev => {
          const copy = [...prev];
          copy[currentLineIndex] = partial;
          return copy;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, 12 + Math.random() * 18);
      return () => clearTimeout(timeout);
    } else {
      setCurrentLineIndex(prev => prev + 1);
      setCurrentCharIndex(0);
    }
  }, [phase, currentLineIndex, currentCharIndex]);

  // Morph phase: code text dissolves into particles then reveals image
  useEffect(() => {
    if (phase !== 'morph') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const startTime = Date.now();
    const duration = 2200;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      morphProgress.current = progress;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fade out code text with particle scatter
      if (progress < 0.6) {
        const textOpacity = 1 - (progress / 0.6);
        ctx.globalAlpha = textOpacity;
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = '13px "Space Mono", monospace';
        const lineH = 22;
        const startY = canvas.height / 2 - (CODE_LINES.length * lineH) / 2;

        CODE_LINES.forEach((line, i) => {
          const chars = line.split('');
          chars.forEach((char, ci) => {
            const scatter = progress * 3;
            const ox = (canvas.width / 2 - 200) + ci * 7.8;
            const oy = startY + i * lineH;
            const dx = ox + (Math.random() - 0.5) * scatter * 120;
            const dy = oy + (Math.random() - 0.5) * scatter * 120;

            let color = 'rgba(240,240,240,0.6)';
            if (char === '{' || char === '}' || char === '(' || char === ')' || char === ';') color = 'rgba(79,142,247,0.7)';
            else if (char === '"') color = 'rgba(0,229,160,0.7)';
            else if (char === '/' || char === '*') color = 'rgba(240,240,240,0.3)';

            ctx.fillStyle = color;
            ctx.globalAlpha = textOpacity * (1 - progress * 0.5);
            ctx.fillText(char, dx, dy);
          });
        });
      }

      // Fade to black then trigger completion
      if (progress > 0.6) {
        const fadeIn = (progress - 0.6) / 0.4;
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = fadeIn;
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('done');
        onComplete();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#080808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.5s',
      }}
    >
      {/* Code typing phase */}
      {phase === 'typing' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', maxWidth: 1000, justifyContent: 'space-between', padding: '0 clamp(20px, 5vw, 40px)', alignItems: 'center', gap: '40px' }}>
          {/* Left side: Code Typing */}
          <div style={{ flex: '1 1 300px', maxWidth: 600, fontFamily: '"Space Mono", monospace', fontSize: 13, lineHeight: '22px' }}>
            {displayedLines.map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, minHeight: 22 }}>
                <span style={{ color: 'rgba(240,240,240,0.15)', width: 24, textAlign: 'right', flexShrink: 0, fontSize: 11, userSelect: 'none' }}>
                  {i + 1}
                </span>
                <pre style={{ margin: 0, whiteSpace: 'pre' }}>
                  {colorizeCode(line)}
                  {i === currentLineIndex && <span style={{ color: '#4f8ef7', animation: 'blink 1s step-end infinite' }}>▌</span>}
                </pre>
              </div>
            ))}
          </div>

          {/* Right side: Loading Screen */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '"Space Mono", monospace', color: 'rgba(240,240,240,0.5)', fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ letterSpacing: '0.1em' }}>LOADING SYSTEM_</span>
              <span style={{ color: '#00e5a0', width: 14, textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>{spinnerChars[spinnerIdx]}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(240,240,240,0.3)', letterSpacing: '0.05em' }}>
              INITIALIZING COMPONENTS...
            </div>
            <div style={{ width: 140, height: 2, background: 'rgba(255,255,255,0.1)', marginTop: 16, borderRadius: 2, overflow: 'hidden' }}>
               <div style={{ height: '100%', width: `${(currentLineIndex / CODE_LINES.length) * 100}%`, background: '#00e5a0', transition: 'width 0.1s' }} />
            </div>
          </div>
        </div>
      )}

      {/* Morph canvas */}
      {phase === 'morph' && (
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
      )}
    </div>
  );
}

function colorizeCode(line: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let i = 0;

  const keywords = ['const', 'function', 'if', 'return', 'true'];
  const stringRegex = /"[^"]*"/g;
  const commentRegex = /\/\/.*/g;

  // Simple colorization
  const comment = line.match(commentRegex);
  if (comment && line.trimStart().startsWith('//')) {
    return <span style={{ color: 'rgba(240,240,240,0.25)' }}>{line}</span>;
  }

  const tokens = line.split(/(\s+|[{}().,;:=[\]+"])/);
  tokens.forEach((token, idx) => {
    if (keywords.includes(token)) {
      parts.push(<span key={idx} style={{ color: '#a259ff' }}>{token}</span>);
    } else if (token.startsWith('"') || token === '"') {
      parts.push(<span key={idx} style={{ color: '#00e5a0' }}>{token}</span>);
    } else if (token === '{' || token === '}' || token === '(' || token === ')' || token === '[' || token === ']') {
      parts.push(<span key={idx} style={{ color: 'rgba(79,142,247,0.8)' }}>{token}</span>);
    } else if (token === '=>' || token === '=' || token === '+') {
      parts.push(<span key={idx} style={{ color: '#ff4d8d' }}>{token}</span>);
    } else {
      parts.push(<span key={idx} style={{ color: 'rgba(240,240,240,0.7)' }}>{token}</span>);
    }
  });

  return <>{parts}</>;
}
