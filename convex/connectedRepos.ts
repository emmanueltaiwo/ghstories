import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('connectedRepos')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();
  },
});

export const add = mutation({
  args: {
    userId: v.string(),
    repositoryFullName: v.string(),
    hookId: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('connectedRepos')
      .withIndex('by_user_repo', (q) =>
        q
          .eq('userId', args.userId)
          .eq('repositoryFullName', args.repositoryFullName),
      )
      .unique();

    if (existing) return existing._id;
    
    return await ctx.db.insert('connectedRepos', {
      userId: args.userId,
      repositoryFullName: args.repositoryFullName,
      hookId: args.hookId,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { userId: v.string(), repositoryFullName: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query('connectedRepos')
      .withIndex('by_user_repo', (q) =>
        q
          .eq('userId', args.userId)
          .eq('repositoryFullName', args.repositoryFullName),
      )
      .unique();
    if (row) await ctx.db.delete(row._id);
  },
});
