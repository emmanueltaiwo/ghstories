import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const syncUser = mutation({
  args: {
    authUserId: v.string(),
    username: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_auth_user_id', (q) => q.eq('authUserId', args.authUserId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        username: args.username ?? existing.username,
        displayName: args.displayName ?? existing.displayName,
        avatarUrl: args.avatarUrl ?? existing.avatarUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert('users', {
      authUserId: args.authUserId,
      username: args.username,
      displayName: args.displayName,
      avatarUrl: args.avatarUrl,
    });
  },
});

export const storeGithubToken = mutation({
  args: {
    userId: v.string(),
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('githubTokens')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .unique();

    const data = {
      userId: args.userId,
      accessToken: args.accessToken,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert('githubTokens', data);
    }
  },
});

export const listGithubTokens = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('githubTokens').collect();
  },
});

export const getTokenForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query('githubTokens')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .unique();
    return row ? { accessToken: row.accessToken } : null;
  },
});

export const getByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .unique();
  },
});
