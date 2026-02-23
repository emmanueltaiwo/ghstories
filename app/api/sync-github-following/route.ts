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
    const body = (await request.json()) as {
      accessToken?: string;
      userId?: string;
    };
    const { accessToken, userId } = body;

    if (!accessToken || !userId) {
      return NextResponse.json(
        { ok: false, error: 'accessToken and userId required' },
        { status: 400 }
      );
    }

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
