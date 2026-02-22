import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const syncFromGitHubUsernames = mutation({
  args: {
    followerId: v.string(),
    githubUsernames: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    for (const username of args.githubUsernames) {
      const user = await ctx.db
        .query('users')
        .withIndex('by_username', (q) => q.eq('username', username))
        .unique();

      if (!user || user.authUserId === args.followerId) continue;

      const existing = await ctx.db
        .query('follows')
        .withIndex('by_follower_following', (q) =>
          q.eq('followerId', args.followerId).eq('followingId', user.authUserId)
        )
        .unique();

      if (!existing) {
        await ctx.db.insert('follows', {
          followerId: args.followerId,
          followingId: user.authUserId,
          createdAt: Date.now(),
        });
      }
    }
  },
});

export const getProfile = query({
  args: { username: v.string(), currentUserId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .unique();

    if (!user) {
      return null;
    }

    let isFollowing = false;
    if (args.currentUserId && args.currentUserId !== user.authUserId) {
      const follow = await ctx.db
        .query('follows')
        .withIndex('by_follower_following', (q) =>
          q
            .eq('followerId', args.currentUserId!)
            .eq('followingId', user.authUserId)
        )
        .unique();
      isFollowing = !!follow;
    }

    const highlights = await ctx.db
      .query('stories')
      .withIndex('by_user_highlight', (q) =>
        q.eq('userId', user.authUserId).eq('isHighlight', true)
      )
      .order('desc')
      .collect();

    const highlightRows = [];
    for (const s of highlights) {
      const commit = await ctx.db.get(s.commitId);
      if (commit) {
        highlightRows.push({
          ...s,
          id: s._id,
          commit: {
            ...(commit as object),
            id: (commit as { _id: string })._id,
          },
        });
      }
    }

    return {
      user: {
        id: user.authUserId,
        username: user.username ?? null,
        displayName: user.displayName ?? null,
        avatarUrl: user.avatarUrl ?? null,
        createdAt: (user as { _creationTime?: number })._creationTime ?? 0,
        isFollowing,
      },
      highlights: highlightRows,
    };
  },
});

export const follow = mutation({
  args: { followerId: v.string(), followingId: v.string() },
  handler: async (ctx, args) => {
    if (args.followerId === args.followingId) {
      return;
    }

    const existing = await ctx.db
      .query('follows')
      .withIndex('by_follower_following', (q) =>
        q.eq('followerId', args.followerId).eq('followingId', args.followingId)
      )
      .unique();

    if (!existing) {
      await ctx.db.insert('follows', {
        followerId: args.followerId,
        followingId: args.followingId,
        createdAt: Date.now(),
      });
    }
  },
});

export const unfollow = mutation({
  args: { followerId: v.string(), followingId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('follows')
      .withIndex('by_follower_following', (q) =>
        q.eq('followerId', args.followerId).eq('followingId', args.followingId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
