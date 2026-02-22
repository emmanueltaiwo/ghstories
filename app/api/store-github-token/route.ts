import { NextRequest, NextResponse } from 'next/server';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export async function POST(request: NextRequest) {
  try {
    const baseUrl = process.env.SITE_URL ?? request.nextUrl.origin;

    const res = await fetch(`${baseUrl}/api/auth/get-access-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') ?? '',
      },
      body: JSON.stringify({ providerId: 'github' }),
    });

    if (!res.ok) return NextResponse.json({ ok: false }, { status: 401 });

    const data = (await res.json()) as { accessToken?: string };
    const accessToken = data?.accessToken;

    if (!accessToken) return NextResponse.json({ ok: false }, { status: 401 });

    const sessionRes = await fetch(`${baseUrl}/api/auth/get-session`, {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
    });

    if (!sessionRes.ok)
      return NextResponse.json({ ok: false }, { status: 401 });

    const sessionData = (await sessionRes.json()) as { user?: { id?: string } };
    const userId = sessionData?.user?.id;

    if (!userId) return NextResponse.json({ ok: false }, { status: 401 });

    await fetchMutation(api.users.storeGithubToken, {
      userId,
      accessToken,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
