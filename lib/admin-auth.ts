import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';
export const cookieName = 'portfolio_admin_session';
function signature(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters');
  return createHmac('sha256', secret).update(value).digest('hex');
}
export function issueSession() {
  const expiry = String(Date.now() + 1000 * 60 * 60 * 12);
  return expiry + '.' + signature(expiry);
}
export async function isAuthenticated() {
  try {
    const token = (await cookies()).get(cookieName)?.value || '';
    const [expiry, sig] = token.split('.');
    if (!expiry || !sig || Number(expiry) < Date.now() || !/^\d+$/.test(expiry)) return false;
    const expected = Buffer.from(signature(expiry), 'hex');
    const received = Buffer.from(sig, 'hex');
    return expected.length === received.length && timingSafeEqual(expected, received);
  } catch { return false; }
}
export function passwordValid(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 12) return false;
  const a = createHmac('sha256', 'portfolio-password').update(input).digest();
  const b = createHmac('sha256', 'portfolio-password').update(expected).digest();
  return timingSafeEqual(a,b);
}
