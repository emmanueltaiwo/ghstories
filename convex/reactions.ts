import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

type Reactor = {
  id: string;
  username: string | null;
  avatarUrl: string | null;
  displayName: string | null;
};

type ReactionEntry = {
  emoji: string;
  count: number;
  hasReacted: boolean;
  reactors: Reactor[];
};

export const list = query({
  args: {
    storyId: v.id('stories'),
    currentUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query('reactions')
      .withIndex('by_story_id', (q) => q.eq('storyId', args.storyId))
      .collect();

    const byEmoji = new Map<string, ReactionEntry>();

    for (const r of rows) {
      const user = await ctx.db
        .query('users')
        .withIndex('by_auth_user_id', (q) => q.eq('authUserId', r.userId))
        .unique();

      const reactor: Reactor = user
        ? {
            id: user.authUserId,
            username: user.username ?? null,
            avatarUrl: user.avatarUrl ?? null,
            displayName: user.displayName ?? null,
          }
        : {
            id: r.userId,
            username: null,
            avatarUrl: null,
            displayName: null,
          };

      const entry = byEmoji.get(r.emoji);
      if (!entry) {
        byEmoji.set(r.emoji, {
          emoji: r.emoji,
          count: 1,
          hasReacted: args.currentUserId === r.userId,
          reactors: user ? [reactor] : [],
        });
      } else {
        entry.count++;
        if (args.currentUserId === r.userId) entry.hasReacted = true;
        if (user) entry.reactors.push(reactor);
      }
    }

    return Array.from(byEmoji.values());
  },
});

export const add = mutation({
  args: {
    storyId: v.id('stories'),
    userId: v.string(),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('reactions')
      .withIndex('by_story_id', (q) => q.eq('storyId', args.storyId))
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .collect();

    for (const e of existing) {
      await ctx.db.delete(e._id);
    }

    await ctx.db.insert('reactions', {
      storyId: args.storyId,
      userId: args.userId,
      emoji: args.emoji,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    storyId: v.id('stories'),
    userId: v.string(),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('reactions')
      .withIndex('by_story_user_emoji', (q) =>
        q
          .eq('storyId', args.storyId)
          .eq('userId', args.userId)
          .eq('emoji', args.emoji)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
