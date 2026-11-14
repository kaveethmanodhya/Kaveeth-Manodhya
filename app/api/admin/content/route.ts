import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '../../../../lib/admin-auth';
import { getPortfolioContent, safeContent } from '../../../../lib/portfolio';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({error:'Unauthorized'},{status:401});
  return NextResponse.json(await getPortfolioContent(), { headers: {'Cache-Control':'no-store'} });
}
export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({error:'Unauthorized'},{status:401});
  const token=process.env.GITHUB_CONTENT_TOKEN;
  if (!token) return NextResponse.json({error:'Set GITHUB_CONTENT_TOKEN in environment'},{status:503});
  let content;
  try { content=safeContent(await req.json()); } catch (error) {return NextResponse.json({error:String(error)},{status:400});}
  const repo=process.env.GITHUB_CONTENT_REPO || 'kaveethmanodhya/Kaveeth-Manodhya';
  const branch=process.env.GITHUB_CONTENT_BRANCH || 'redesign/scroll-film-portfolio';
  const endpoint='https://api.github.com/repos/'+repo+'/contents/data/portfolio.json';
  const headers={Authorization:'Bearer '+token,Accept:'application/vnd.github+json','Content-Type':'application/json'};
  const prior=await fetch(endpoint+'?ref='+encodeURIComponent(branch),{headers,cache:'no-store'});
  if(!prior.ok) return NextResponse.json({error:'Could not load GitHub content ('+prior.status+')'},{status:502});
  const file=await prior.json();
  const response=await fetch(endpoint,{method:'PUT',headers,body:JSON.stringify({
    message:'content: update portfolio via admin dashboard',
    content:Buffer.from(JSON.stringify(content,null,2)+'\n').toString('base64'),
    sha:file.sha,branch
  })});
  const result=await response.json().catch(()=>({}));
  if(!response.ok) return NextResponse.json({error:result.message || 'GitHub save failed'},{status:response.status === 409 ? 409:502});
  return NextResponse.json({saved:true,commit:result.commit?.sha});
}
