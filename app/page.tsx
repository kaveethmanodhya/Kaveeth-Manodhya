'use client';

import { useState, useEffect, type ReactNode } from 'react';
import defaults from '../data/portfolio.json';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Menu, X, Github, Linkedin } from 'lucide-react';
import MatchCutIntro from '../components/MatchCutIntro';
import SmoothScroll from '../components/SmoothScroll';
import Contact from '../components/Contact';
import HorizontalProjects from '../components/HorizontalProjects';


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
  const [content, setContent] = useState(defaults);
  useEffect(() => { fetch('/api/portfolio', {cache:'no-store'}).then(r=>r.json()).then(d=>{if(d?.intro&&d?.work)setContent(d);}).catch(()=>{}); }, []);
  const {intro,navigation,about,expertise,work,manifesto,journey,contact,footer}=content;
  const nav=navigation.items;

  return (
    <main className="new-portfolio">
      <SmoothScroll />

      <header className="new-nav">
        <a className="new-logo" href="#home" aria-label="Home">{navigation.logo}<span>.</span></a>

        <nav className="new-desktop-nav" aria-label="Main navigation">
          {nav.slice(0, 4).map(({name, href}) => (
            <a href={href} key={href}>{name}</a>
          ))}
        </nav>

        <a className="new-nav-contact" href="#contact">
          {navigation.contactButton} <ArrowUpRight size={16} />
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
            {nav.map(({name, href}) => (
              <a href={href} key={href} onClick={() => setMenu(false)}>
                {name} <ArrowUpRight size={17} />
              </a>
            ))}
          </nav>
        )}
      </header>

      <MatchCutIntro details={intro} />

      <section id="about" className="new-section new-about">
        <Reveal>
          <div className="new-section-top"><span>{about.label}</span></div>
          <div className="new-about-layout">
            <div>
              <h2>
                {about.headingFirst} <span>{about.headingFirstAccent}</span><br />
                {about.headingSecond} <em>{about.headingSecondAccent}</em>
              </h2>
              <div className="new-about-bottom">
                {about.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
                <a href="#expertise">{about.button} <ArrowDownRight size={18} /></a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="expertise" className="new-section new-expertise">
        <Reveal>
          <div className="new-section-top"><span>{expertise.label}</span></div>
          <h2 className="new-big-title">{expertise.heading} <em>{expertise.accent}</em></h2>
        </Reveal>
        {expertise.items.map(d => (
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

      <HorizontalProjects details={work} />

      <section className="new-manifesto">
        <Reveal>
          <p>{manifesto.lines[0]}<br />{manifesto.lines[1]} <em>{manifesto.lines[2]}</em><br />{manifesto.lines[3]}<span>.</span></p>
        </Reveal>
      </section>

      <section id="journey" className="new-section new-journey">
        <Reveal>
          <div className="new-section-top"><span>{journey.label}</span></div>
          <h2 className="new-big-title">{journey.heading}<span>.</span></h2>
        </Reveal>

        <div className="new-stats" aria-label="Portfolio statistics">
          {journey.stats.map(item => (
            <Reveal key={item.label} className="new-stat">
              <strong>{item.number}</strong>
              <span>{item.label}</span>
            </Reveal>
          ))}
        </div>

        <div className="new-journey-grid">
          <Reveal className="new-journey-image">
            <Image
              src={journey.portrait}
              fill
              sizes="(max-width: 850px) 90vw, 35vw"
              alt="Portrait of Kaveeth Manodhya"
            />
          </Reveal>

          <div className="new-journey-content">
            <Reveal><h3 className="new-journey-heading">{journey.experienceHeading}</h3></Reveal>
            <div className="new-timeline">
              {journey.experience.map(item => (
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

            <Reveal><h3 className="new-journey-heading new-education-heading"{journey.educationHeading}</h3></Reveal>
            <div className="new-education-list">
              {journey.education.map(item => (
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
            <div className="new-section-top"><span>{contact.label}</span></div>
            <h2>{contact.headingOne} <em>{contact.headingAccentOne}</em><br />{contact.headingTwo} <span>{contact.headingAccentTwo}</span></h2>
            <div className="new-contact-social">
              {contact.socialLinks.map(link=><a key={link.name} href={link.url} aria-label={link.name} target="_blank" rel="noopener noreferrer">{link.name.toLowerCase()==='linkedin'?<Linkedin/>:<Github/>}</a>)}
            </div>
          </Reveal>
          <div className="new-contact-form"><Contact details={contact} /></div>
        </div>
      </section>

      <footer className="new-footer">
        <a href="#home" className="new-logo">{navigation.logo}<span>.</span></a>
        <p>{footer.copyright}</p>
        <a href="#home">{footer.backToTop}</a>
      </footer>
    </main>
  );
}
