'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import defaults from '../../data/portfolio.json';
type Content = typeof defaults;
type Item = Record<string, unknown>;
const tabs: {key:keyof Content; title:string}[] = [
 {key:'intro',title:'Cinematic Intro'},{key:'navigation',title:'Navigation'},
 {key:'about',title:'About Me'},{key:'expertise',title:'Expertise'},{key:'work',title:'Projects & Work'},
 {key:'manifesto',title:'Manifesto'},{key:'journey',title:'Journey'},{key:'contact',title:'Contact'},
 {key:'footer',title:'Footer'},{key:'seo',title:'SEO'}
];
function fieldName(key:string){return key.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase());}
const inputStyle:React.CSSProperties={width:'100%',background:'#151a27',border:'1px solid #353d53',borderRadius:10,color:'white',padding:'11px 14px',fontSize:14,outline:'none'};
const btn:React.CSSProperties={background:'#2d64df',border:0,borderRadius:10,color:'white',padding:'10px 16px',cursor:'pointer',fontWeight:600};
export default function AdminPage(){
 const [password,setPassword]=useState(''),[logged,setLogged]=useState(false),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false);
 const [data,setData]=useState<Content>(defaults),[tab,setTab]=useState<keyof Content>('intro'),[message,setMessage]=useState(''),[dirty,setDirty]=useState(false);
 async function load(){const auth=await fetch('/api/admin/login',{cache:'no-store'}).then(r=>r.json()).catch(()=>({}));setLogged(!!auth.authenticated);
 if(auth.authenticated){const x=await fetch('/api/admin/content',{cache:'no-store'}).then(r=>r.json()).catch(()=>null);if(x&&!x.error)setData(x);}
 setLoading(false);}
 useEffect(()=>{void load();},[]);
 function update(section:keyof Content,value:unknown){setData(prev=>({...prev,[section]:value} as Content));setDirty(true);setMessage('Unsaved changes');}
 async function login(e:React.FormEvent){e.preventDefault();setMessage('');const res=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});if(res.ok){setPassword('');await load();}else setMessage('Incorrect password or missing configuration');}
 async function logout(){await fetch('/api/admin/login',{method:'DELETE'});setLogged(false);}
 async function save(){setSaving(true);setMessage('Saving changes to GitHub…');
 const res=await fetch('/api/admin/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
 const out=await res.json().catch(()=>({}));setSaving(false);
 if(res.ok){setDirty(false);setMessage('Saved on GitHub. The portfolio refreshes its content without editing code.');}else setMessage('Could not save: '+(out.error||res.status));}
 async function upload(file:File,onDone:(path:string)=>void){setMessage('Uploading image…');const fd=new FormData();fd.append('file',file);const response=await fetch('/api/admin/upload',{method:'POST',body:fd});const out=await response.json();if(response.ok){onDone(out.path);setMessage('Image uploaded to GitHub. Save changes to apply it.');}else setMessage('Upload failed: '+out.error);}
 function editor(key:string,value:unknown,onChange:(next:unknown)=>void):React.ReactNode {
  if(typeof value==='boolean')return <label style={{display:'flex',gap:10,alignItems:'center'}}><input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)}/> {fieldName(key)}</label>;
  if(typeof value==='number')return <label style={{display:'block'}}><small>{fieldName(key)}</small><input style={inputStyle} type="number" value={value} onChange={e=>onChange(Number(e.target.value))}/></label>;
  if(typeof value==='string'){
   const isImage=/^(image|logo|profileImage|portrait)$/i.test(key);
   return <label style={{display:'block'}}><small style={{display:'block',marginBottom:6,color:'#b6c2df'}}>{fieldName(key)}</small>
    {value.length>100||/description|summary|paragraph|copyright/i.test(key)?<textarea rows={3} style={{...inputStyle,resize:'vertical'}} value={value} onChange={e=>onChange(e.target.value)}/>:<input style={inputStyle} value={value} onChange={e=>onChange(e.target.value)}/>}
    {isImage&&<div style={{display:'flex',gap:12,alignItems:'center',marginTop:8}}><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e=>{const file=e.target.files?.[0];if(file)void upload(file,p=>onChange(p));}}/>{value&&<img src={value} alt="Preview" style={{height:55,width:75,objectFit:'contain',background:'#181e31',borderRadius:6}}/>}</div>}
   </label>;
  }
  if(Array.isArray(value)){
   const items=value as unknown[];
   const sample=items[0];
   return <div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><h3 style={{margin:0,fontSize:17}}>{fieldName(key)} ({items.length})</h3><button style={btn} onClick={()=>onChange([...items,typeof sample==='string'?'':sample&&typeof sample==='object'?JSON.parse(JSON.stringify(sample)):''])}>+ Add</button></div>
    {items.map((item,index)=><div key={index} style={{border:'1px solid #333d54',borderRadius:12,padding:16,marginBottom:12,background:'#0e1523'}}>
     <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><strong>Item {index+1}</strong><div style={{display:'flex',gap:6}}>
      <button style={{...btn,background:'#29354a'}} disabled={index===0} onClick={()=>{const next=[...items];[next[index-1],next[index]]=[next[index],next[index-1]];onChange(next);}}>↑</button>
      <button style={{...btn,background:'#29354a'}} disabled={index===items.length-1} onClick={()=>{const next=[...items];[next[index+1],next[index]]=[next[index],next[index+1]];onChange(next);}}>↓</button>
      <button style={{...btn,background:'#8c3441'}} onClick={()=>onChange(items.filter((_,i)=>i!==index))}>Remove</button></div></div>
      {editor('',item,v=>onChange(items.map((old,i)=>i===index?v:old)))}
     </div>)}
   </div>;
  }
  if(value && typeof value==='object')return <div style={{display:'grid',gap:16}}>{Object.entries(value as Item).map(([k,v])=><div key={k}>{editor(k,v,next=>onChange({...value,[k]:next}))}</div>)}</div>;
  return null;
 }
 return <main style={{minHeight:'100vh',background:'#090d16',color:'#f3f6fc',fontFamily:'system-ui,sans-serif',padding:'24px'}}>
 <div style={{maxWidth:1200,margin:'auto'}}>
 <header style={{display:'flex',justifyContent:'space-between',gap:20,flexWrap:'wrap',alignItems:'center',marginBottom:28}}>
  <div><div style={{fontSize:12,color:'#88a6ef',letterSpacing:3}}>PORTFOLIO CONTROL CENTER</div><h1 style={{fontSize:30,margin:'5px 0'}}>Admin Dashboard</h1></div>
  <div style={{display:'flex',alignItems:'center',gap:12}}><Link href="/" style={{color:'#afc7ff'}}>← View Portfolio</Link>{logged&&<button style={{...btn,background:'#29354a'}} onClick={logout}>Logout</button>}</div>
 </header>
 {loading?<p>Loading dashboard…</p>:!logged?<form onSubmit={login} style={{maxWidth:420,margin:'80px auto',padding:32,border:'1px solid #2c3952',borderRadius:20,background:'#111a2a'}}>
 <h2>Secure sign in</h2><p style={{color:'#b3bfd5'}}>Enter your administrator password.</p><input style={inputStyle} autoComplete="current-password" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/><button style={{...btn,marginTop:20,width:'100%'}}>Sign In</button><p role="status">{message}</p></form>:
 <div style={{display:'grid',gridTemplateColumns:'minmax(180px,240px) minmax(0,1fr)',gap:24,alignItems:'start'}}>
 <aside style={{display:'grid',gap:4,position:'sticky',top:20}}>
  {tabs.map(t=><button key={t.key} onClick={()=>setTab(t.key)} style={{textAlign:'left',padding:'13px 15px',background:tab===t.key?'#224caa':'#121a29',border:'1px solid #283247',borderRadius:10,color:'white',cursor:'pointer'}}>{t.title}</button>)}
 </aside>
 <section style={{minWidth:0,background:'#111827',border:'1px solid #29354d',borderRadius:18,padding:24}}>
 <div style={{display:'flex',justifyContent:'space-between',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:22}}><h2 style={{margin:0}}>{tabs.find(t=>t.key===tab)?.title}</h2>
 <button style={{...btn,background:saving?'#59647d':'#2563eb'}} disabled={saving||!dirty} onClick={save}>{saving?'Saving…':'Save Changes'}</button></div>
 <div role="status" style={{marginBottom:18,color:dirty?'#ffce7a':'#84e3ba',fontSize:13}}>{message}</div>
 {editor(String(tab),data[tab],v=>update(tab,v))}
 </section></div>}
 </div></main>;
}
