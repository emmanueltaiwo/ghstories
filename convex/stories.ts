import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';
import { STORY_EXPIRY_HOURS } from './constants';

const now = () => Date.now();

export const createCommitAndStory = internalMutation({
  args: {
    userId: v.string(),
    repositoryName: v.string(),
    repositoryFullName: v.string(),
    sha: v.string(),
    message: v.string(),
    authorName: v.string(),
    authorEmail: v.string(),
    url: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('commits')
      .withIndex('by_user_sha_repo', (q) =>
        q
          .eq('userId', args.userId)
          .eq('sha', args.sha)
          .eq('repositoryFullName', args.repositoryFullName)
      )
      .unique();

    if (existing) return null;

    const commitId = await ctx.db.insert('commits', {
      userId: args.userId,
      repositoryName: args.repositoryName,
      repositoryFullName: args.repositoryFullName,
      sha: args.sha,
      message: args.message,
      authorName: args.authorName,
      authorEmail: args.authorEmail,
      url: args.url,
      createdAt: args.createdAt,
    });

    const ts = now();
    const expiresAt = ts + STORY_EXPIRY_HOURS * 60 * 60 * 1000;
    const storyId = await ctx.db.insert('stories', {
      userId: args.userId,
      commitId,
      expiresAt,
      viewCount: 0,
      isHighlight: false,
      createdAt: ts,
      updatedAt: ts,
    });

    return { commitId, storyId };
  },
});

export const listFeed = query({
  args: { currentUserId: v.string() },
  handler: async (ctx, args) => {
    const following = await ctx.db
      .query('follows')
      .withIndex('by_follower', (q) => q.eq('followerId', args.currentUserId))
      .collect();

    const followingIds = [...new Set(following.map((f) => f.followingId))];
    if (followingIds.length === 0) return [];

    const ts = now();
    const all = await ctx.db.query('stories').collect();
    const filtered = all.filter(
      (s) => followingIds.includes(s.userId) && s.expiresAt >= ts
    );
    filtered.sort((a, b) => b.createdAt - a.createdAt);

    const limit = 50;
    const stories = filtered.slice(0, limit);
    const result = [];

    for (const s of stories) {
      const commit = await ctx.db.get(s.commitId);
      const user = await ctx.db
        .query('users')
        .withIndex('by_auth_user_id', (q) => q.eq('authUserId', s.userId))
        .unique();

      if (commit && user) {
        result.push({
          ...s,
          id: s._id,
          commit: {
            ...(commit as object),
            id: (commit as { _id: string })._id,
          },
          user: {
            id: user.authUserId,
            username: user.username ?? null,
            avatarUrl: user.avatarUrl ?? null,
          },
        });
      }
    }

    return result;
  },
});

export const listMyStories = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const ts = now();
    const stories = await ctx.db
      .query('stories')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .filter((q) => q.gte(q.field('expiresAt'), ts))
      .order('desc')
      .collect();

    const user = await ctx.db
      .query('users')
      .withIndex('by_auth_user_id', (q) => q.eq('authUserId', args.userId))
      .unique();

    if (!user) return [];

    const result = [];
    for (const s of stories) {
      const commit = await ctx.db.get(s.commitId);
      if (commit) {
        result.push({
          ...s,
          id: s._id,
          commit: {
            ...(commit as object),
            id: (commit as { _id: string })._id,
          },
          user: {
            id: user.authUserId,
            username: user.username ?? null,
            avatarUrl: user.avatarUrl ?? null,
          },
        });
      }
    }

    return result;
  },
});

export const listUserStories = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const ts = now();
    const stories = await ctx.db
      .query('stories')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .filter((q) => q.gte(q.field('expiresAt'), ts))
      .order('desc')
      .collect();

    const user = await ctx.db
      .query('users')
      .withIndex('by_auth_user_id', (q) => q.eq('authUserId', args.userId))
      .unique();

    if (!user) return [];

    const result = [];
    for (const s of stories) {
      const commit = await ctx.db.get(s.commitId);
      if (commit) {
        result.push({
          ...s,
          id: s._id,
          commit: {
            ...(commit as object),
            id: (commit as { _id: string })._id,
          },
          user: {
            id: user.authUserId,
            username: user.username ?? null,
            avatarUrl: user.avatarUrl ?? null,
          },
        });
      }
    }

    return result;
  },
});

export const get = query({
  args: { storyId: v.id('stories') },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story) return null;

    const commit = await ctx.db.get(story.commitId);
    const user = await ctx.db
      .query('users')
      .withIndex('by_auth_user_id', (q) => q.eq('authUserId', story.userId))
      .unique();

    if (!commit || !user) return null;

    const c = commit as {
      _id: string;
      message: string;
      repositoryName: string;
      url: string;
      authorName: string;
      authorEmail: string;
      createdAt: number;
      repositoryFullName: string;
      sha: string;
      userId: string;
    };

    return {
      ...story,
      id: story._id,
      commit: { ...c, id: c._id },
      user: {
        id: user.authUserId,
        username: user.username ?? null,
        avatarUrl: user.avatarUrl ?? null,
      },
    };
  },
});

export const recordView = mutation({
  args: { storyId: v.id('stories'), viewerId: v.string() },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story || story.userId === args.viewerId) return;

    const existing = await ctx.db
      .query('storyViews')
      .withIndex('by_story_id', (q) => q.eq('storyId', args.storyId))
      .filter((q) => q.eq(q.field('viewerId'), args.viewerId))
      .first();

    if (existing) return;

    await ctx.db.insert('storyViews', {
      storyId: args.storyId,
      viewerId: args.viewerId,
      viewedAt: now(),
    });
    await ctx.db.patch(args.storyId, { viewCount: story.viewCount + 1 });
  },
});

export const setHighlight = mutation({
  args: { storyId: v.id('stories'), userId: v.string() },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story || story.userId !== args.userId) return;

    await ctx.db.patch(args.storyId, { isHighlight: true, updatedAt: now() });
  },
});

export const unsetHighlight = mutation({
  args: { storyId: v.id('stories'), userId: v.string() },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story || story.userId !== args.userId) return;

    await ctx.db.patch(args.storyId, { isHighlight: false, updatedAt: now() });
  },
});
