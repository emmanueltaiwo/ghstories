import { NextRequest, NextResponse } from 'next/server';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

async function fetchAllGitHubFollowing(
  accessToken: string
): Promise<string[]> {
  const usernames: string[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const res = await fetch(
      `https://api.github.com/user/following?per_page=${perPage}&page=${page}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!res.ok) break;

    const data = (await res.json()) as Array<{ login?: string }>;
    const batch = data
      .map((u) => u.login)
      .filter((login): login is string => typeof login === 'string');
    usernames.push(...batch);

    if (batch.length < perPage) break;
    page += 1;
  }

  return usernames;
}

export async function POST(request: NextRequest) {
  try {
    const baseUrl =
      process.env.SITE_URL ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      request.nextUrl.origin;

    const tokenRes = await fetch(`${baseUrl}/api/auth/get-access-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') ?? '',
      },
      body: JSON.stringify({ providerId: 'github' }),
    });

    if (!tokenRes.ok)
      return NextResponse.json({ ok: false }, { status: 401 });

    const tokenData = (await tokenRes.json()) as { accessToken?: string };
    const accessToken = tokenData?.accessToken;

    if (!accessToken)
      return NextResponse.json({ ok: false }, { status: 401 });

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

    if (!userId)
      return NextResponse.json({ ok: false }, { status: 401 });

    const githubUsernames = await fetchAllGitHubFollowing(accessToken);

    if (githubUsernames.length > 0) {
      await fetchMutation(api.follows.syncFromGitHubUsernames, {
        followerId: userId,
        githubUsernames,
      });
    }

    // Store token for daily cron sync
    await fetchMutation(api.users.storeGithubToken, {
      userId,
      accessToken,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[sync-github-following]', error);
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
