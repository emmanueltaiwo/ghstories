import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const users = defineTable({
  authUserId: v.string(),
  username: v.optional(v.string()),
  displayName: v.optional(v.string()),
  avatarUrl: v.optional(v.string()),
})
  .index('by_auth_user_id', ['authUserId'])
  .index('by_username', ['username']);

const commits = defineTable({
  userId: v.string(),
  repositoryName: v.string(),
  repositoryFullName: v.string(),
  sha: v.string(),
  message: v.string(),
  authorName: v.string(),
  authorEmail: v.string(),
  url: v.string(),
  createdAt: v.number(),
})
  .index('by_user_id', ['userId'])
  .index('by_user_sha_repo', ['userId', 'sha', 'repositoryFullName']);

const stories = defineTable({
  userId: v.string(),
  commitId: v.id('commits'),
  expiresAt: v.number(),
  viewCount: v.number(),
  isHighlight: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_user_id', ['userId'])
  .index('by_expires_at', ['expiresAt'])
  .index('by_user_highlight', ['userId', 'isHighlight']);

const reactions = defineTable({
  storyId: v.id('stories'),
  userId: v.string(),
  emoji: v.string(),
  createdAt: v.number(),
})
  .index('by_story_id', ['storyId'])
  .index('by_story_user_emoji', ['storyId', 'userId', 'emoji']);

const follows = defineTable({
  followerId: v.string(),
  followingId: v.string(),
  createdAt: v.number(),
})
  .index('by_follower', ['followerId'])
  .index('by_following', ['followingId'])
  .index('by_follower_following', ['followerId', 'followingId']);

const storyViews = defineTable({
  storyId: v.id('stories'),
  viewerId: v.optional(v.string()),
  viewedAt: v.number(),
})
  .index('by_story_id', ['storyId'])
  .index('by_viewer_id', ['viewerId']);

const githubTokens = defineTable({
  userId: v.string(),
  accessToken: v.string(),
  updatedAt: v.number(),
}).index('by_user_id', ['userId']);

export default defineSchema({
  users,
  commits,
  stories,
  reactions,
  follows,
  storyViews,
  githubTokens,
});
