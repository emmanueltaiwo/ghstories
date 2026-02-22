import { NextRequest, NextResponse } from 'next/server';
import { fetchAction } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import crypto from 'crypto';

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-hub-signature-256') ?? '';
    const event = request.headers.get('x-github-event') ?? '';
    const body = await request.text();
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

    if (webhookSecret && signature && !verifySignature(body, signature, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    if (event === 'ping') {
      return NextResponse.json({ message: 'Webhook configured successfully' });
    }

    if (event !== 'push') {
      return NextResponse.json({ received: true });
    }

    const payload = JSON.parse(body) as {
      pusher?: { name?: string };
      repository?: { name?: string; full_name?: string };
      commits?: Array<{
        id?: string;
        message?: string;
        author?: { name?: string; email?: string };
        committer?: { name?: string; email?: string };
        url?: string;
        timestamp?: string;
      }>;
    };
    const pusher = payload.pusher?.name;
    const repo = payload.repository;
    const commits = payload.commits ?? [];

    if (!pusher || !repo || commits.length === 0) {
      return NextResponse.json({ received: true });
    }

    await fetchAction(api.github.processPush, {
      pusherName: pusher,
      repository: { name: repo.name ?? '', full_name: repo.full_name ?? '' },
      commits: commits.map((c) => ({
        id: c.id ?? '',
        message: c.message ?? '',
        author: { name: c.author?.name, email: c.author?.email },
        committer: c.committer ? { name: c.committer.name, email: c.committer.email } : undefined,
        url: c.url,
        timestamp: c.timestamp,
      })),
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
