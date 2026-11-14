'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, LayoutDashboard, FolderKanban, GraduationCap, FileText, Settings, LogOut, Save, ChevronUp, ChevronDown, Trash2, Plus, ExternalLink, UploadCloud, Check, AlertCircle } from 'lucide-react';
import defaults from '../../data/portfolio.json';

type Content = typeof defaults;
type Section = keyof Content;
type JsonObject = Record<string, unknown>;
type MediaCategory = 'profile' | 'projects' | 'education' | 'logos';

const navigation: { key: Section | 'media'; name: string; group: string; icon: typeof ImageIcon }[] = [
  { key: 'intro', name: 'Cinematic Intro', group: 'Website', icon: LayoutDashboard },
  { key: 'navigation', name: 'Navigation', group: 'Website', icon: LayoutDashboard },
  { key: 'about', name: 'About Me', group: 'Website', icon: FileText },
  { key: 'expertise', name: 'Expertise', group: 'Website', icon: FileText },
  { key: 'work', name: 'Projects', group: 'Content', icon: FolderKanban },
  { key: 'journey', name: 'Experience & Education', group: 'Content', icon: GraduationCap },
  { key: 'manifesto', name: 'Manifesto', group: 'Content', icon: FileText },
  { key: 'contact', name: 'Contact & Links', group: 'Content', icon: FileText },
  { key: 'media', name: 'Media Manager', group: 'Media', icon: ImageIcon },
  { key: 'footer', name: 'Footer', group: 'Settings', icon: Settings },
  { key: 'seo', name: 'SEO', group: 'Settings', icon: Settings },
];

const categories: { key: MediaCategory; title: string; description: string; section: Section; path: (string | number)[] }[] = [
  { key: 'profile', title: 'Intro Profile Portrait', description: 'The photo used in the cinematic reveal', section: 'intro', path: ['portrait'] },
  { key: 'profile', title: 'Journey Profile Portrait', description: 'Profile image in the experience section', section: 'journey', path: ['portrait'] },
];
const background: React.CSSProperties = { minHeight:'100vh',background:'#090f1b',color:'#edf3ff',fontFamily:'system-ui, sans-serif',padding:'24px' };
const inputStyle: React.CSSProperties = { width:'100%',padding:'12px 14px',borderRadius:11,border:'1px solid #34415e',background:'#101c2e',color:'#f4f7fe',fontSize:14,outline:'none' };
const actionStyle: React.CSSProperties = { borderRadius:10,padding:'10px 14px',border:'1px solid #344363',background:'#18273d',color:'#f5f8ff',fontSize:13,fontWeight:600,cursor:'pointer' };
const primaryStyle: React.CSSProperties = { ...actionStyle,background:'#376cf0',borderColor:'#376cf0',color:'#fff' };
const boxStyle: React.CSSProperties = { background:'#101a2b',border:'1px solid #283750',borderRadius:18,padding:22 };

function humanize(key: string) {
 return key.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase());
}
function editAt(root: unknown, path: (string | number)[], value: unknown): unknown {
 if(!path.length) return value;
 const [first,...rest] = path;
 if(Array.isArray(root)){ const next=[...root]; next[Number(first)]=editAt(next[Number(first)],rest,value); return next; }
 const obj=root && typeof root==='object'?root as JsonObject:{};
 return {...obj,[first]:editAt(obj[String(first)],rest,value)};
}
function mediaEntries(data: Content) {
 const entries = [...categories];
 for(let i=0;i<data.work.projects.length;i++){
  entries.push({key:'projects' as MediaCategory,title:data.work.projects[i].name || 'Untitled Project',description:'Project cover image',section:'work' as Section,path:['projects',i,'image']});
 }
 for(let i=0;i<data.journey.education.length;i++){
  entries.push({key:'education' as MediaCategory,title:data.journey.education[i].name || 'Education Logo',description:'Institution logo',section:'journey' as Section,path:['education',i,'image']});
 }
 return entries;
}
function currentValue(data: Content,section:Section,path:(string|number)[]) {
 return path.reduce<unknown>((value,key) => value && typeof value==='object' ? (value as JsonObject)[String(key)] : undefined,data[section]);
}
function ImagePreview({src,alt}:{src:string;alt:string}) {
 return <div className="film-admin-preview">{src?<img src={src} alt={alt} referrerPolicy="no-referrer" />:<ImageIcon size={28}/>}</div>;
}

export default function AdminPage(){
 const [logged,setLogged]=useState(false);
 const [loading,setLoading]=useState(true);
 const [password,setPassword]=useState('');
 const [data,setData]=useState<Content>(defaults);
 const [active,setActive]=useState<Section|'media'>('intro');
 const [status,setStatus]=useState('');
 const [error,setError]=useState(false);
 const [dirty,setDirty]=useState(false);
 const [saving,setSaving]=useState(false);
 const [uploads,setUploads]=useState<Record<string,boolean>>({});
 const [search,setSearch]=useState('');
 const [mediaTab,setMediaTab]=useState<'all'|MediaCategory>('all');

 useEffect(()=>{
  let cancelled=false;
  async function initialise(){
   try{
    const response=await fetch('/api/admin/login',{cache:'no-store'});
    const auth=await response.json();
    if(cancelled)return;
    if(auth.authenticated){
     setLogged(true);
     const content=await fetch('/api/admin/content',{cache:'no-store'}).then(r=>r.json());
     if(!cancelled && !content.error)setData(content);
    }
   } catch {if(!cancelled){setStatus('Cannot connect to the server.');setError(true);}}
   finally{if(!cancelled)setLoading(false);}
  }
  void initialise();
  return ()=>{cancelled=true;};
 },[]);
 function change(section:Section,path:(string|number)[],value:unknown) {
  setData(prev=>({...prev,[section]:editAt(prev[section],path,value)} as Content));
  setDirty(true);
  setError(false);
  setStatus('You have unsaved changes.');
 }
 async function login(e:React.FormEvent){
  e.preventDefault();setError(false);setStatus('');
  try {
   const response=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});
   if(!response.ok)throw Error('Invalid password or missing server configuration.');
   setLogged(true);setPassword('');
   const content=await fetch('/api/admin/content',{cache:'no-store'}).then(r=>r.json());
   if(content.error)throw Error(content.error);
   setData(content);
  }catch(e){setError(true);setStatus(e instanceof Error?e.message:'Sign in failed');}
 }
 async function logout(){
  if(dirty&&!window.confirm('Unsaved changes will be lost. Sign out?'))return;
  await fetch('/api/admin/login',{method:'DELETE'});
  setLogged(false);setDirty(false);setStatus('');
 }
 async function save(){
  setSaving(true);setStatus('Saving updates to GitHub…');setError(false);
  try{
   const response=await fetch('/api/admin/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
   const result=await response.json();
   if(!response.ok)throw Error(result.error || 'Could not save changes.');
   setDirty(false);setStatus('Changes saved successfully.');
  }catch(e){setError(true);setStatus(e instanceof Error?e.message:'Save failed');}
  finally{setSaving(false);}
 }
 async function upload(file:File,section:Section,path:(string|number)[],category:MediaCategory) {
  const id=section+':'+path.join('.');
  setUploads(prev=>({...prev,[id]:true}));setStatus('Uploading '+file.name+' to Cloudinary…');setError(false);
  try{
   const form=new FormData();form.append('file',file);form.append('category',category);
   const response=await fetch('/api/admin/upload',{method:'POST',body:form});
   const result=await response.json();
   if(!response.ok)throw Error(result.error||'Upload failed');
   change(section,path,result.url);
   setStatus('Uploaded to Cloudinary. Click Save Changes to publish the new image.');
  }catch(e){setError(true);setStatus(e instanceof Error?e.message:'Upload failed');}
  finally{setUploads(prev=>({...prev,[id]:false}));}
 }
 function imageField(section:Section,path:(string|number)[],label:string,category:MediaCategory):ReactNode{
  const id=section+':'+path.join('.');
  const value=String(currentValue(data,section,path)||'');
  return <div className="film-admin-media-field" key={id}>
   <ImagePreview src={value} alt={label}/>
   <div className="film-admin-media-details">
    <strong>{label}</strong>
    <small>PNG, JPG, WEBP, GIF or AVIF · Max 8 MB</small>
    <label className="film-admin-upload"><UploadCloud size={16}/>{uploads[id]?'Uploading…':'Upload Image'}
     <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" disabled={uploads[id]} onChange={e=>{const f=e.target.files?.[0];if(f)void upload(f,section,path,category);e.target.value='';}}/>
    </label>
    <input style={inputStyle} aria-label={label+' image URL'} value={value} placeholder="Or paste an image URL" onChange={e=>change(section,path,e.target.value)}/>
   </div>
  </div>;
 }
 function renderEditor(section:Section,path:(string|number)[],key:string,value:unknown):ReactNode {
  const update=(next:unknown)=>change(section,path,next);
  if(typeof value==='boolean')return <label className="film-admin-check"><input type="checkbox" checked={value} onChange={e=>update(e.target.checked)}/>{humanize(key)}</label>;
  if(typeof value==='number')return <label className="film-admin-field"><span>{humanize(key)}</span><input style={inputStyle} type="number" value={value} onChange={e=>update(Number(e.target.value))}/></label>;
  if(typeof value==='string'){
   if(/^(image|logo|profileImage|portrait)$/i.test(key)){
    const cat:MediaCategory=section==='work'?'projects':section==='journey'&&key==='image'?'education':'profile';
    return imageField(section,path,humanize(key),cat);
   }
   const multiline=value.length>100||/description|paragraph|desc|copyright|summary|location/i.test(key);
   return <label className="film-admin-field" key={path.join('.')}><span>{humanize(key||'Text')}</span>
    {multiline?<textarea style={{...inputStyle,minHeight:105,resize:'vertical'}} value={value} onChange={e=>update(e.target.value)}/>:<input style={inputStyle} value={value} onChange={e=>update(e.target.value)}/>}
   </label>;
  }
  if(Array.isArray(value)){
   return <div className="film-admin-list">
    <div className="film-admin-list-head"><strong>{humanize(key||'Items')} <span>({value.length})</span></strong>
     <button style={actionStyle} onClick={()=>update([...value,typeof value[0]==='string'?'':value.length?JSON.parse(JSON.stringify(value[0])):{}])}><Plus size={15}/> Add Item</button>
    </div>
    {value.map((item,index)=><details key={index} className="film-admin-entry" open={value.length<4?true:undefined}>
     <summary><strong>{typeof item==='object' && item !== null ? String((item as JsonObject).name||(item as JsonObject).title||(item as JsonObject).period||'Item '+(index+1)):String(item||'Item '+(index+1))}</strong><div className="film-admin-entry-actions">
       <button aria-label="Move up" title="Move up" disabled={index===0} onClick={e=>{e.preventDefault();const next=[...value];[next[index-1],next[index]]=[next[index],next[index-1]];update(next);}}><ChevronUp size={16}/></button>
       <button aria-label="Move down" title="Move down" disabled={index===value.length-1} onClick={e=>{e.preventDefault();const next=[...value];[next[index+1],next[index]]=[next[index],next[index+1]];update(next);}}><ChevronDown size={16}/></button>
       <button aria-label="Remove" title="Remove" onClick={e=>{e.preventDefault();if(window.confirm('Remove this item?'))update(value.filter((_,i)=>i!==index));}}><Trash2 size={16}/></button>
      </div></summary>
     <div className="film-admin-entry-content">{renderEditor(section,[...path,index],'',item)}</div>
    </details>)}
   </div>;
  }
  if(value && typeof value==='object')return <div className="film-admin-fields">{Object.entries(value as JsonObject).map(([child,childValue])=><div key={child}>{renderEditor(section,[...path,child],child,childValue)}</div>)}</div>;
  return null;
 }
 const filteredMedia=mediaEntries(data).filter(item=>(mediaTab==='all'||item.key===mediaTab)&&item.title.toLowerCase().includes(search.toLowerCase()));
 return <main className="film-admin-root" style={background}>
 <div className="film-admin-shell">
  <header className="film-admin-header">
   <div><span className="film-admin-overline">PORTFOLIO CONTROL CENTER</span><h1>Dashboard <span>Studio</span></h1><p>Edit your website without touching the code.</p></div>
   <div className="film-admin-top-actions"><Link href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={16}/> View Website</Link>{logged&&<button style={actionStyle} onClick={logout}><LogOut size={16}/> Sign Out</button>}</div>
  </header>
  {loading?<div style={boxStyle}>Loading your dashboard…</div>:!logged?
   <form onSubmit={login} className="film-admin-login"><LayoutDashboard size={34}/><h2>Welcome back</h2><p>Sign in to manage your portfolio.</p>
    <label className="film-admin-field"><span>Admin Password</span><input type="password" autoComplete="current-password" style={inputStyle} value={password} onChange={e=>setPassword(e.target.value)} required/></label>
    <button style={primaryStyle} type="submit">Sign In</button>{status&&<p role="alert" style={{color:error?'#ff9ca9':'#9fc0ff'}}>{status}</p>}
   </form>:
   <div className="film-admin-layout">
    <aside className="film-admin-sidebar" aria-label="Admin navigation">
     {navigation.map((item,i)=><div key={item.key}>
      {(i===0||navigation[i-1].group!==item.group)&&<div className="film-admin-navgroup">{item.group}</div>}
      <button className={active===item.key?'film-admin-navitem active':'film-admin-navitem'} onClick={()=>{setActive(item.key);setStatus('');setSearch('');}}><item.icon size={17}/>{item.name}</button>
     </div>)}
    </aside>
    <section className="film-admin-main">
     <div className="film-admin-toolbar"><div><h2>{navigation.find(x=>x.key===active)?.name}</h2><p>{active==='media'?'Manage portraits, project covers and logos in one place.':'Edit fields, then save your changes.'}</p></div>
      <button style={{...primaryStyle,opacity:!dirty||saving?0.55:1}} onClick={save} disabled={!dirty||saving}><Save size={16}/>{saving?'Saving…':'Save Changes'}</button>
     </div>
     {status&&<div role="status" className={error?'film-admin-alert error':'film-admin-alert'}>{error?<AlertCircle size={16}/>:<Check size={16}/>}<span>{status}</span></div>}
     {dirty&&<p className="film-admin-unsaved">Unsaved edits — publish changes with Save Changes.</p>}
     {active==='media'?
       <div className="film-admin-media-manager">
        <div className="film-admin-media-controls"><input style={inputStyle} placeholder="Search images, projects or logos…" value={search} onChange={e=>setSearch(e.target.value)}/>
         <select style={inputStyle} value={mediaTab} onChange={e=>setMediaTab(e.target.value as 'all'|MediaCategory)}>
          <option value="all">All Images</option><option value="profile">Profile Portraits</option><option value="projects">Project Covers</option><option value="education">Education Logos</option>
         </select></div>
        <div className="film-admin-media-grid">{filteredMedia.map(item=><div className="film-admin-media-card" key={item.section+item.path.join('.')}>{imageField(item.section,item.path,item.title,item.key)}<small>{item.description}</small></div>)}</div>
        {filteredMedia.length===0&&<p>No matching media found.</p>}
       </div>:
       <div className="film-admin-edit-panel">{renderEditor(active,[],navigation.find(x=>x.key===active)?.name||'',data[active])}</div>
     }
    </section>
   </div>}
 </div>
 </main>;
}
