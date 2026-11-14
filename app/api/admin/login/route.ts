import { NextRequest, NextResponse } from 'next/server';
import { cookieName, issueSession, passwordValid, isAuthenticated } from '../../../../lib/admin-auth';
export const runtime = 'nodejs';
export async function GET() { return NextResponse.json({ authenticated: await isAuthenticated() }, { headers: { 'Cache-Control':'no-store' } }); }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!passwordValid(String(body.password || ''))) return NextResponse.json({ error: 'Invalid password or admin configuration' }, { status: 401 });
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(cookieName, issueSession(), { httpOnly:true, secure: process.env.NODE_ENV === 'production', sameSite:'strict', path:'/', maxAge: 43200 });
  return response;
}
export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(cookieName, '', { httpOnly:true, secure: process.env.NODE_ENV === 'production', sameSite:'strict', path:'/', maxAge:0 });
  return response;
}
