import { createClient, type GenericCtx } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { components } from './_generated/api';
import type { DataModel } from './_generated/dataModel';
import { query } from './_generated/server';
import { betterAuth } from 'better-auth';
import authConfig from './auth.config';

const siteUrl = process.env.SITE_URL;
if (!siteUrl?.trim()) {
  throw new Error(
    'SITE_URL is not set in Convex. Set it to your app URL, e.g. http://localhost:3000 or https://yourdomain.com: npx convex env set SITE_URL "http://localhost:3000"'
  );
}

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret || secret.trim() === '') {
  throw new Error(
    'BETTER_AUTH_SECRET is not set. Set it in Convex: npx convex env set BETTER_AUTH_SECRET "your-secret" (use a long random string, e.g. openssl rand -base64 32)'
  );
}

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
if (!githubClientId?.trim() || !githubClientSecret?.trim()) {
  throw new Error(
    'GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set in Convex (not .env.local). npx convex env set GITHUB_CLIENT_ID "..." and npx convex env set GITHUB_CLIENT_SECRET "..."'
  );
}

export const authComponent = createClient<DataModel>(
  (components as { betterAuth: Parameters<typeof createClient<DataModel>>[0] })
    .betterAuth
);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    secret,
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    emailAndPassword: { enabled: false },
    socialProviders: {
      github: {
        clientId: githubClientId,
        clientSecret: githubClientSecret,
        mapProfileToUser: async (profile) => ({
          username: profile.login,
          displayUsername: profile.name ?? profile.login,
          image: profile.avatar_url ?? undefined,
        }),
      },
    },
    user: {
      additionalFields: {
        username: { type: 'string', required: false },
        displayUsername: { type: 'string', required: false },
      },
    },
    plugins: [convex({ authConfig })],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
