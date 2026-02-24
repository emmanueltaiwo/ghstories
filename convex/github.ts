import { v } from 'convex/values';
import { action } from './_generated/server';
import { api, internal } from './_generated/api';

const siteUrl = process.env.SITE_URL ?? '';
const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET ?? '';

export const listReposForConnect = action({
  args: { accessToken: v.string(), userId: v.string() },
  handler: async (
    ctx,
    args,
  ): Promise<{
    repos: { fullName: string; name: string; owner: string }[];
    connected: string[];
  }> => {
    const res = await fetch(
      'https://api.github.com/user/repos?per_page=100&sort=updated',
      {
        headers: { Authorization: `Bearer ${args.accessToken}` },
      },
    );
    if (!res.ok) return { repos: [], connected: [] };
    const repos = (await res.json()) as Array<{
      full_name: string;
      name: string;
      owner?: { login: string };
    }>;
    const connected = await ctx.runQuery(api.connectedRepos.listByUser, {
      userId: args.userId,
    });
    const connectedSet = new Set<string>(
      connected.map(
        (r: { repositoryFullName: string }) => r.repositoryFullName,
      ),
    );
    return {
      repos: repos.map((r) => ({
        fullName: r.full_name,
        name: r.name,
        owner: r.owner?.login ?? '',
      })),
      connected: Array.from(connectedSet),
    };
  },
});

export const createWebhook = action({
  args: {
    accessToken: v.string(),
    userId: v.string(),
    owner: v.string(),
    repo: v.string(),
  },
  handler: async (ctx, args) => {
    const repoFullName = `${args.owner}/${args.repo}`;
    const config: Record<string, string> = {
      url: `${siteUrl}/api/webhooks/github`,
      content_type: 'json',
    };
    if (webhookSecret) config.secret = webhookSecret;
    const res = await fetch(
      `https://api.github.com/repos/${args.owner}/${args.repo}/hooks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${args.accessToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          name: 'web',
          active: true,
          events: ['push'],
          config,
        }),
      },
    );

    const data = (await res.json()) as { id?: number; message?: string };
    if (!res.ok) {
      throw new Error(data.message ?? `GitHub API error: ${res.status}`);
    }
    const hookId = typeof data.id === 'number' ? data.id : 0;

    await ctx.runMutation(api.connectedRepos.add, {
      userId: args.userId,
      repositoryFullName: repoFullName,
      hookId,
    });
    return { ok: true };
  },
});

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
          }),
        ),
        url: v.optional(v.string()),
        timestamp: v.optional(v.string()),
      }),
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
