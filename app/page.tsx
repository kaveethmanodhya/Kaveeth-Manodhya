'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Menu, X, Github, Linkedin } from 'lucide-react';
import ScrollFilm from '../components/ScrollFilm';
import Contact from '../components/Contact';

const projects = [
  {name:'Ceylon Gate', kind:'TRAVEL & WEB DEVELOPMENT', image:'/ceylongate.png', url:'https://ceylongate.com', text:'An immersive online experience presenting Sri Lanka through travel, destinations, and thoughtful web design.'},
  {name:'KodexLK', kind:'DIGITAL EXPERIENCES', image:'/kodexlk-logo.webp', url:'https://kodexlk.online', text:'An evolving creative studio platform for digital invitations, websites, and bespoke digital experiences.'},
  {name:'Alpha Crew', kind:'PHOTOGRAPHY & WEB', image:'/alpha-crew.png', url:'https://alphacrewweb.vercel.app', text:'Visual storytelling through photography, paired with a digital home for the creative brand.'}
];
const disciplines = [
  {num:'01', title:'DEVELOPMENT', desc:'Ideas made functional. Java, C, C++, React, Next.js, Node.js, databases and networking.', tags:['Java','C / C++','React','Next.js','Networking']},
  {num:'02', title:'PHOTOGRAPHY', desc:'The art of seeing. Portraits, events, image editing, retouching and the stories that linger.',tags:['Photography','Lightroom','Photoshop','Retouching']},
  {num:'03', title:'CREATIVE WORK', desc:'Designing memorable experiences across digital invitations, video, motion, and visual identity.',tags:['Design','Video','Motion','Storytelling']}
];
const timeline = [
  ['2025 — PRESENT','Wayamba University of Sri Lanka','B.Sc. Applied Sciences undergraduate'],
  ['2025 — PRESENT','KodexLK','Founder and Developer'],
  ['2023 — PRESENT','Alpha Crew Photography','Founder and Photographer'],
  ['2025','Newgen Lanka Healthcare','Quality Assurance Trainee']
];
function Reveal({children,className=''}:{children:React.ReactNode;className?:string}){
  return <motion.div className={className} initial={{opacity:0,y:36}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.8,ease:[.2,1,.2,1]}}>{children}</motion.div>;
}
export default function Portfolio(){
 const [menu,setMenu]=useState(false);
 const nav=[['About','#about'],['Expertise','#expertise'],['Work','#work'],['Journey','#journey'],['Contact','#contact']];
 return <main className="new-portfolio">
  <header className="new-nav">
    <a className="new-logo" href="#home">KM<span>.</span></a>
    <nav className="new-desktop-nav">{nav.slice(0,4).map(([name,href])=><a href={href} key={href}>{name}</a>)}</nav>
    <a className="new-nav-contact" href="#contact">LET'S TALK <ArrowUpRight size={16}/></a>
    <button className="new-menu-button" aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    {menu&&<nav className="new-mobile-nav">{nav.map(([name,href])=><a href={href} key={href} onClick={()=>setMenu(false)}>{name} <ArrowUpRight size={17}/></a>)}</nav>}
  </header>
  <ScrollFilm/>
  <section id="about" className="new-section new-about">
   <Reveal><div className="new-section-top"><span>01 / THE PERSON</span><span>BEHIND THE PIXELS</span></div>
   <div className="new-about-layout"><p className="new-margin-note">A LITTLE BIT OF EVERYTHING.<br/>ALWAYS LEARNING.</p><div><h2>I BUILD WITH <span>LOGIC.</span><br/>I CREATE WITH <em>FEELING.</em></h2><div className="new-about-bottom"><p>I am Kaveeth, an Applied Sciences undergraduate at Wayamba University of Sri Lanka, a programmer, and a photographer. My work brings together the technical side of building things and the human side of telling stories.</p><a href="#expertise">WHAT I DO <ArrowDownRight size={18}/></a></div></div></div></Reveal>
  </section>
  <section id="expertise" className="new-section new-expertise">
   <Reveal><div className="new-section-top"><span>02 / EXPERTISE</span><span>THREE WORLDS, ONE PERSPECTIVE</span></div><h2 className="new-big-title">WHAT I <em>DO.</em></h2></Reveal>
   {disciplines.map(d=><Reveal key={d.num}><article className="new-discipline"><span>{d.num}</span><h3>{d.title}</h3><div><p>{d.desc}</p><div className="new-tags">{d.tags.map(t=><span key={t}>{t}</span>)}</div></div><ArrowUpRight size={25}/></article></Reveal>)}
  </section>
  <section id="work" className="new-section new-work">
   <Reveal><div className="new-section-top"><span>03 / SELECTED WORK</span><span>MADE WITH PURPOSE</span></div><div className="new-work-header"><h2 className="new-big-title">THE <em>WORK.</em></h2><p>A selection of things I have built, captured, and brought to life.</p></div></Reveal>
   <div className="new-project-grid">{projects.map((p,i)=><Reveal key={p.name} className={'new-project new-project-'+i}><a href={p.url} target="_blank" rel="noopener noreferrer"><div className="new-project-image"><Image src={p.image} alt={p.name+' project preview'} fill sizes="(max-width: 800px) 95vw, 60vw"/><div className="new-project-view"><ArrowUpRight size={29}/></div></div><div className="new-project-label"><span>0{i+1} / {p.kind}</span><ArrowUpRight size={18}/></div><h3>{p.name}</h3><p>{p.text}</p></a></Reveal>)}</div>
  </section>
  <section className="new-manifesto"><div className="new-manifesto-top"><span>ALWAYS EXPLORING</span><span>CODE / IMAGE / STORY</span></div><Reveal><p>THE BEST IDEAS<br/>LIVE <em>BETWEEN</em><br/>DISCIPLINES<span>.</span></p></Reveal><span className="new-manifesto-bottom">KEEP CREATING ↓</span></section>
  <section id="journey" className="new-section new-journey">
   <Reveal><div className="new-section-top"><span>04 / MY JOURNEY</span><span>A WORK IN PROGRESS</span></div><h2 className="new-big-title">SO FAR<span>.</span></h2></Reveal>
   <div className="new-journey-grid"><Reveal className="new-journey-image"><Image src="/profile-v2.webp" fill sizes="(max-width: 800px) 90vw, 35vw" alt="Portrait of Kaveeth Manodhya"/></Reveal><div className="new-timeline">{timeline.map(([date,name,role])=><Reveal key={name}><div className="new-timeline-row"><span>{date}</span><div><h3>{name}</h3><p>{role}</p></div><ArrowUpRight size={17}/></div></Reveal>)}</div></div>
  </section>
  <section id="contact" className="new-contact"><div className="new-section"><Reveal><div className="new-section-top"><span>05 / SAY HELLO</span><span>THE NEXT STORY STARTS HERE</span></div><h2>GOT AN <em>IDEA?</em><br/>LET'S MAKE <span>IT REAL.</span></h2><div className="new-contact-social"><a href="https://github.com/kaveethmanodhya" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><Github/></a><a href="https://www.linkedin.com/in/kaveeth-manodhya-b3917330a" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><Linkedin/></a></div></Reveal><div className="new-contact-form"><Contact/></div></div></section>
  <footer className="new-footer"><a href="#home" className="new-logo">KM<span>.</span></a><p>© 2026 KAVEETH MANODHYA</p><a href="#home">BACK TO TOP ↑</a></footer>
 </main>;
}