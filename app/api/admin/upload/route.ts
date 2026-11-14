import { NextRequest,NextResponse } from 'next/server';
import { isAuthenticated } from '../../../../lib/admin-auth';
import { randomUUID } from 'node:crypto';
export const runtime = 'nodejs';
export async function POST(req:NextRequest) {
  if(!(await isAuthenticated()))return NextResponse.json({error:'Unauthorized'},{status:401});
  const token=process.env.GITHUB_CONTENT_TOKEN;
  if(!token)return NextResponse.json({error:'GitHub token missing'},{status:503});
  const data=await req.formData().catch(()=>null);
  const file=data?.get('file');
  if(!(file instanceof File))return NextResponse.json({error:'Select an image'},{status:400});
  const allowed:Record<string,string>={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif'};
  const ext=allowed[file.type];
  if(!ext || file.size>5*1024*1024)return NextResponse.json({error:'Only PNG/JPG/WEBP/GIF under 5 MB'},{status:400});
  const repo=process.env.GITHUB_CONTENT_REPO || 'kaveethmanodhya/Kaveeth-Manodhya';
  const branch=process.env.GITHUB_CONTENT_BRANCH || 'main';
  const name='admin-'+randomUUID()+'.'+ext;
  const bytes=Buffer.from(await file.arrayBuffer());
  const path='public/uploads/'+name;
  const response=await fetch('https://api.github.com/repos/'+repo+'/contents/'+path,{method:'PUT',headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','Content-Type':'application/json'},body:JSON.stringify({message:'assets: upload portfolio image',content:bytes.toString('base64'),branch})});
  const result=await response.json().catch(()=>({}));
  if(!response.ok)return NextResponse.json({error:result.message || 'Upload failed'},{status:502});
  return NextResponse.json({path:'/uploads/'+name});
}
