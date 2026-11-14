import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '../../../../lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const folders: Record<string, string> = {
  profile: 'portfolio/profile',
  projects: 'portfolio/projects',
  logos: 'portfolio/logos',
  education: 'portfolio/education',
};
const maxBytes = 8 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  }

  // A browser with the session cookie may upload only from this website.
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in Vercel.' },
      { status: 503 }
    );
  }
  if (!/^[A-Za-z0-9_-]+$/.test(cloudName)) {
    return NextResponse.json({ error: 'Invalid Cloudinary cloud name.' }, { status: 503 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  const category = String(form?.get('category') || '');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Please choose an image.' }, { status: 400 });
  }
  if (!Object.hasOwn(folders, category)) {
    return NextResponse.json({ error: 'Invalid image category.' }, { status: 400 });
  }
  if (!allowedTypes.has(file.type) || file.size === 0 || file.size > maxBytes) {
    return NextResponse.json(
      { error: 'Use a PNG, JPG, WEBP, GIF or AVIF image smaller than 8 MB.' },
      { status: 400 }
    );
  }

  try {
    const payload = new FormData();
    payload.append('file', file, file.name);
    payload.append('folder', folders[category]);

    const encodedCredentials = Buffer.from(apiKey + ':' + apiSecret).toString('base64');
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/' + cloudName + '/image/upload',
      {
        method: 'POST',
        headers: { Authorization: 'Basic ' + encodedCredentials },
        body: payload,
        cache: 'no-store',
        signal: AbortSignal.timeout(25000)
      }
    );
    const result: { secure_url?: string; public_id?: string; error?: { message?: string } } =
      await response.json().catch(() => ({}));

    if (!response.ok || !result.secure_url || !result.public_id) {
      console.error('Cloudinary upload failed', response.status, result.error?.message);
      return NextResponse.json(
        { error: 'Cloudinary upload failed. Check the credentials, file and account limits.' },
        { status: 502 }
      );
    }
    const imageUrl = new URL(result.secure_url);
    if (imageUrl.protocol !== 'https:' || imageUrl.hostname !== 'res.cloudinary.com') {
      return NextResponse.json({ error: 'Unexpected image URL from Cloudinary.' }, { status: 502 });
    }
    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error('Cloudinary upload request failed', error);
    return NextResponse.json({ error: 'Could not upload image. Please try again.' }, { status: 502 });
  }
}
