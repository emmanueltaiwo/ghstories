import { internalAction, internalMutation } from './_generated/server';

export const syncGitHubFollowing = internalAction({
  args: {},
  handler: async (ctx) => {
    const siteUrl = process.env.SITE_URL;
    const cronSecret = process.env.CRON_SECRET;

    if (!siteUrl || !cronSecret) return;

    const res = await fetch(`${siteUrl}/api/cron/sync-github-following`, {
      method: 'POST',
      headers: { 'x-cron-secret': cronSecret },
    });

    if (!res.ok) {
      throw new Error(`Cron sync failed: ${res.status}`);
    }
  },
});

export const expireStories = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query('stories')
      .withIndex('by_expires_at')
      .filter((q) => q.lt(q.field('expiresAt'), now))
      .collect();

    for (const s of expired) {
      await ctx.db.delete(s._id);
    }
  },
});
