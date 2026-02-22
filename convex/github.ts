import { v } from 'convex/values';
import { action } from './_generated/server';
import { api, internal } from './_generated/api';

export const processPush = action({
  args: {
    pusherName: v.string(),
    repository: v.object({
      name: v.string(),
      full_name: v.string(),
    }),
    commits: v.array(
      v.object({
        id: v.string(),
        message: v.string(),
        author: v.object({
          name: v.optional(v.string()),
          email: v.optional(v.string()),
        }),
        committer: v.optional(
          v.object({
            name: v.optional(v.string()),
            email: v.optional(v.string()),
          })
        ),
        url: v.optional(v.string()),
        timestamp: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    if (args.commits.length === 0) return;

    const user = await ctx.runQuery(api.users.getByUsername, {
      username: args.pusherName,
    });
    if (!user) return;

    const userId = user.authUserId;
    const ts = (d: string | undefined) =>
      d ? new Date(d).getTime() : Date.now();

    for (const c of args.commits) {
      const authorName = c.author?.name ?? c.committer?.name ?? 'Unknown';
      const authorEmail = c.author?.email ?? c.committer?.email ?? '';
      const url =
        c.url ??
        `https://github.com/${args.repository.full_name}/commit/${c.id}`;

      await ctx.runMutation(internal.stories.createCommitAndStory, {
        userId,
        repositoryName: args.repository.name,
        repositoryFullName: args.repository.full_name,
        sha: c.id,
        message: c.message,
        authorName,
        authorEmail,
        url,
        createdAt: ts(c.timestamp),
      });
    }
  },
});
