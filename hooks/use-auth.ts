'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useConvex } from 'convex/react';
import { authClient } from '@/lib/auth-client';
import { api } from '@/convex/_generated/api';

async function syncGitHubFollowing(userId: string): Promise<void> {
  const result = await authClient.getAccessToken({
    providerId: 'github',
  });

  const accessToken =
    result && 'data' in result && result.data
      ? result.data.accessToken
      : undefined;

      if (!accessToken) return;

  const res = await fetch('/api/sync-github-following', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken, userId }),
  });
}

export function useAuth() {
  const queryClient = useQueryClient();
  const convex = useConvex();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const session = await authClient.getSession();
      const user = session?.data?.user ?? null;
      const sessionData = session?.data?.session ?? null;

      if (user && convex) {
        await convex.mutation(api.users.syncUser, {
          authUserId: user.id,
          username: (user as { username?: string }).username,
          displayName:
            (user as { displayName?: string }).displayName ??
            user.name ??
            undefined,
          avatarUrl:
            (user as { avatarUrl?: string }).avatarUrl ??
            user.image ??
            undefined,
        });

        syncGitHubFollowing(user.id).catch(() => {});
      }

      return { user, session: sessionData };
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    isLoading,
    isAuthenticated: !!data?.user,
    signIn: () =>
      authClient.signIn.social({
        provider: 'github',
        callbackURL:
          typeof window !== 'undefined'
            ? `${window.location.origin}/feed`
            : '/feed',
      }),
    signOut: async () => {
      await authClient.signOut();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    },
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });
      refetch();
    },
  };
}
