import { NextRequest, NextResponse } from 'next/server';
import { fetchQuery, fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret');
  const expected = process.env.CRON_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tokens = await fetchQuery(api.users.listGithubTokens, {});

    for (const row of tokens) {
      try {
        const res = await fetch('https://api.github.com/user/following', {
          headers: { Authorization: `Bearer ${row.accessToken}` },
        });

        if (!res.ok) continue;

        const data = (await res.json()) as Array<{ login?: string }>;
        const githubUsernames = data
          .map((u) => u.login)
          .filter((login): login is string => typeof login === 'string');

        if (githubUsernames.length > 0) {
          await fetchMutation(api.follows.syncFromGitHubUsernames, {
            followerId: row.userId,
            githubUsernames,
          });
        }
      } catch {
        continue;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Cron sync error:', err);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
