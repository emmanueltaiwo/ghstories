import { v } from 'convex/values';
import { query } from './_generated/server';

export const listViewers = query({
  args: {
    storyId: v.id('stories'),
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story || story.userId !== args.ownerId) {
      return { viewers: [], totalViews: 0 };
    }

    const views = await ctx.db
      .query('storyViews')
      .withIndex('by_story_id', (q) => q.eq('storyId', args.storyId))
      .order('desc')
      .collect();

    const seen = new Set<string>();
    const viewers = [];

    for (const view of views) {
      if (!view.viewerId || view.viewerId === args.ownerId) continue;
      if (seen.has(view.viewerId)) continue;

      seen.add(view.viewerId);

      const user = await ctx.db
        .query('users')
        .withIndex('by_auth_user_id', (q) => q.eq('authUserId', view.viewerId!))
        .unique();

      if (user) {
        viewers.push({
          id: user.authUserId,
          username: user.username ?? null,
          avatarUrl: user.avatarUrl ?? null,
          displayName: user.displayName ?? null,
          viewedAt: new Date(view.viewedAt).toISOString(),
        });
      }
    }

    return { viewers, totalViews: viewers.length };
  },
});
