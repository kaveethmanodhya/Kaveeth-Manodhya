'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Menu, X, Github, Linkedin } from 'lucide-react';
import ScrollFilm from '../components/ScrollFilm';
import SmoothScroll from '../components/SmoothScroll';
import Contact from '../components/Contact';

// Add future projects here. Each project becomes its own vertical row.
// The list grows naturally with the page without introducing horizontal scrolling.
const projects = [
  {
    name: 'Ceylon Gate',
    kind: 'TRAVEL & WEB DEVELOPMENT',
    image: '/ceylongate.png',
    url: 'https://ceylongate.com',
    text: 'A modern travel website presenting Sri Lanka through destinations, tours, and thoughtful web design.',
  },
  {
    name: 'KodexLK',
    kind: 'DIGITAL SERVICES & WEB SOLUTIONS',
    image: '/kodexlk-logo.webp',
    url: 'https://kodexlk.online',
    text: 'A creative digital services platform offering website development, design, and customised online solutions.',
  },
  {
    name: 'Alpha Crew',
    kind: 'PHOTOGRAPHY & WEB',
    image: '/alpha-crew.png',
    url: 'https://alphacrewweb.vercel.app',
    text: 'Photography, visual storytelling, and a digital home for a growing creative brand.',
  },
];

const disciplines = [
  {
    num: '01',
    title: 'DEVELOPMENT',
    desc: 'Ideas made functional. Java, C, C++, React, Next.js, Node.js, databases, and networking.',
    tags: ['Java', 'C / C++', 'React', 'Next.js', 'Networking'],
  },
  {
    num: '02',
    title: 'PHOTOGRAPHY',
    desc: 'The art of seeing. Portraits, events, image editing, retouching, and the stories that linger.',
    tags: ['Photography', 'Lightroom', 'Photoshop', 'Retouching'],
  },
  {
    num: '03',
    title: 'DIGITAL SERVICES',
    desc: 'Web solutions, creative design, media production, and digital experiences tailored to different needs.',
    tags: ['Web Solutions', 'Graphic Design', 'Video', 'Creative Services'],
  },
];

const experience = [
  { period: '2025 — PRESENT', name: 'KodexLK', role: 'Founder and Developer' },
  { period: '2023 — PRESENT', name: 'Alpha Crew Photography', role: 'Founder and Photographer' },
  { period: '2025', name: 'Newgen Lanka Healthcare', role: 'Quality Assurance Trainee' },
];

const education = [
  {
    period: '2025 — PRESENT',
    name: 'Wayamba University of Sri Lanka',
    qualification: 'B.Sc. Applied Sciences undergraduate',
    image: '/wayamba_uni.png',
  },
  {
    period: '2013 — 2021',
    name: 'Bandaranayake College, Gampaha',
    qualification: 'Secondary Education',
    image: '/bandaranayake_college.png',
  },
];

const nav = [
  ['About', '#about'],
  ['Expertise', '#expertise'],
  ['Work', '#work'],
  ['Journey', '#journey'],
  ['Contact', '#contact'],
];

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: [0.2, 1, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Portfolio() {
  const [menu, setMenu] = useState(false);

  return (
    <main className="new-portfolio">
      <SmoothScroll />

      <header className="new-nav">
        <a className="new-logo" href="#home" aria-label="Home">KM<span>.</span></a>

        <nav className="new-desktop-nav" aria-label="Main navigation">
          {nav.slice(0, 4).map(([name, href]) => (
            <a href={href} key={href}>{name}</a>
          ))}
        </nav>

        <a className="new-nav-contact" href="#contact">
          LET'S TALK <ArrowUpRight size={16} />
        </a>

        <button
          className="new-menu-button"
          type="button"
          aria-label={menu ? 'Close menu' : 'Open menu'}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>

        {menu && (
          <nav className="new-mobile-nav" aria-label="Mobile navigation">
            {nav.map(([name, href]) => (
              <a href={href} key={href} onClick={() => setMenu(false)}>
                {name} <ArrowUpRight size={17} />
              </a>
            ))}
          </nav>
        )}
      </header>

      <ScrollFilm />

      <section id="about" className="new-section new-about">
        <Reveal>
          <div className="new-section-top"><span>01 / THE PERSON</span></div>
          <div className="new-about-layout">
            <div>
              <h2>
                I BUILD WITH <span>LOGIC.</span><br />
                I CREATE WITH <em>FEELING.</em>
              </h2>
              <div className="new-about-bottom">
                <p>
                  I am Kaveeth, an Applied Sciences undergraduate at Wayamba University of Sri Lanka,
                  a programmer, and a photographer. My work brings together the technical side of
                  building things and the human side of telling stories.
                </p>
                <a href="#expertise">WHAT I DO <ArrowDownRight size={18} /></a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="expertise" className="new-section new-expertise">
        <Reveal>
          <div className="new-section-top"><span>02 / EXPERTISE</span></div>
          <h2 className="new-big-title">WHAT I <em>DO.</em></h2>
        </Reveal>
        {disciplines.map(d => (
          <Reveal key={d.num}>
            <article className="new-discipline">
              <span>{d.num}</span>
              <h3>{d.title}</h3>
              <div>
                <p>{d.desc}</p>
                <div className="new-tags">
                  {d.tags.map(tag => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <ArrowUpRight size={25} />
            </article>
          </Reveal>
        ))}
      </section>

      <section id="work" className="new-section new-work">
        <Reveal>
          <div className="new-section-top"><span>03 / SELECTED WORK</span></div>
          <div className="new-work-header">
            <h2 className="new-big-title">THE <em>WORK.</em></h2>
          </div>
        </Reveal>

        <div className="new-project-grid">
          {projects.map(project => (
            <Reveal key={project.name} className="new-project">
              <a
                className="new-project-link"
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={'View ' + project.name + ' project'}
              >
                <div className="new-project-image">
                  <Image
                    src={project.image}
                    alt={project.name + ' project preview'}
                    fill
                    sizes="(max-width: 720px) 100vw, 40vw"
                  />
                  <span className="new-project-view" aria-hidden="true">
                    <ArrowUpRight size={25} />
                  </span>
                </div>
                <div className="new-project-information">
                  <p className="new-project-category">{project.kind}</p>
                  <h3>{project.name}</h3>
                  <p className="new-project-description">{project.text}</p>
                  <span className="new-project-action">
                    VIEW PROJECT <ArrowUpRight size={17} />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="new-manifesto">
        <Reveal>
          <p>THE BEST IDEAS<br />LIVE <em>BETWEEN</em><br />DISCIPLINES<span>.</span></p>
        </Reveal>
      </section>

      <section id="journey" className="new-section new-journey">
        <Reveal>
          <div className="new-section-top"><span>04 / MY JOURNEY</span></div>
          <h2 className="new-big-title">SO FAR<span>.</span></h2>
        </Reveal>

        <div className="new-journey-grid">
          <Reveal className="new-journey-image">
            <Image
              src="/profile-v2.webp"
              fill
              sizes="(max-width: 850px) 90vw, 35vw"
              alt="Portrait of Kaveeth Manodhya"
            />
          </Reveal>

          <div className="new-journey-content">
            <Reveal><h3 className="new-journey-heading">Experience</h3></Reveal>
            <div className="new-timeline">
              {experience.map(item => (
                <Reveal key={item.name}>
                  <div className="new-timeline-row">
                    <span>{item.period}</span>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.role}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal><h3 className="new-journey-heading new-education-heading">Education</h3></Reveal>
            <div className="new-education-list">
              {education.map(item => (
                <Reveal key={item.name}>
                  <div className="new-education-row">
                    <div className="new-education-logo">
                      <Image src={item.image} alt="" fill sizes="64px" />
                    </div>
                    <div className="new-education-info">
                      <span>{item.period}</span>
                      <h4>{item.name}</h4>
                      <p>{item.qualification}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="new-contact">
        <div className="new-section">
          <Reveal>
            <div className="new-section-top"><span>05 / SAY HELLO</span></div>
            <h2>GOT AN <em>IDEA?</em><br />LET'S MAKE <span>IT REAL.</span></h2>
            <div className="new-contact-social">
              <a href="https://github.com/kaveethmanodhya" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><Github /></a>
              <a href="https://www.linkedin.com/in/kaveeth-manodhya-b3917330a" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><Linkedin /></a>
            </div>
          </Reveal>
          <div className="new-contact-form"><Contact /></div>
        </div>
      </section>

      <footer className="new-footer">
        <a href="#home" className="new-logo">KM<span>.</span></a>
        <p>© 2026 KAVEETH MANODHYA</p>
        <a href="#home">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
