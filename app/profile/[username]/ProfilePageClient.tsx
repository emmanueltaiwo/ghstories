'use client';

import { use, useState, useCallback } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/hooks/use-auth';
import { StoryBubble } from '@/components/story-bubble';
import { StoryViewer } from '@/components/story-viewer';
import {
  UserPlus,
  UserMinus,
  Pin,
  Eye,
  Github,
  Plus,
  Loader2,
  Unplug,
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import type { HighlightStory, Story } from '@/lib/types';

function HandDrawnCardBorder() {
  return (
    <svg
      className='absolute inset-0 w-full h-full pointer-events-none'
      viewBox='0 0 500 300'
      preserveAspectRatio='none'
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        d='M15,15 Q10,10 15,20 T25,30 Q20,35 30,40 T40,50 Q35,55 45,60 T55,70 Q50,75 60,80 T70,90 Q65,95 75,100 T85,110 Q80,115 90,120 T100,130 Q95,135 105,140 T115,150 Q110,155 120,160 T130,170 Q125,175 135,180 T145,190 Q140,195 150,200 T160,210 Q155,215 165,220 T175,230 Q170,235 180,240 T190,250 Q185,255 195,260 T205,270 Q200,275 210,280 T220,280 L480,280 Q490,275 490,265 L490,25 Q485,15 475,15 L25,15 Q20,10 15,15 Z'
        fill='none'
        stroke='black'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default function ProfilePageClient({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { user: currentUser } = useAuth();
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const data = useQuery(api.follows.getProfile, {
    username,
    currentUserId: currentUser?.id,
  });

  const follow = useMutation(api.follows.follow);
  const unfollow = useMutation(api.follows.unfollow);
  const setHighlight = useMutation(api.stories.setHighlight);
  const unsetHighlight = useMutation(api.stories.unsetHighlight);
  const listReposForConnect = useAction(api.github.listReposForConnect);
  const createWebhook = useAction(api.github.createWebhook);
  const deleteWebhook = useAction(api.github.deleteWebhook);

  const profile = data?.user ?? null;
  const highlights = (data?.highlights ?? []) as unknown as HighlightStory[];
  const isFollowing = profile?.isFollowing ?? false;
  const isOwnProfile = currentUser?.id === profile?.id;

  const connectedRepos = useQuery(
    api.connectedRepos.listByUser,
    isOwnProfile && currentUser?.id ? { userId: currentUser.id } : 'skip',
  );

  const [reposForConnect, setReposForConnect] = useState<
    { fullName: string; name: string; owner: string }[] | null
  >(null);
  const [reposConnectedSet, setReposConnectedSet] = useState<Set<string>>(
    new Set(),
  );
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [connectingRepo, setConnectingRepo] = useState<string | null>(null);
  const [disconnectingRepo, setDisconnectingRepo] = useState<string | null>(
    null,
  );
  const [reposError, setReposError] = useState<string | null>(null);

  const loadReposForConnect = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoadingRepos(true);
    setReposError(null);
    try {
      const result = await authClient.getAccessToken({ providerId: 'github' });
      const accessToken =
        result && 'data' in result && result.data
          ? result.data.accessToken
          : undefined;
      if (!accessToken) {
        setReposError('GitHub token not found. Try signing out and back in.');
        setLoadingRepos(false);
        return;
      }
      const data = await listReposForConnect({
        accessToken,
        userId: currentUser.id,
      });
      setReposForConnect(data.repos);
      setReposConnectedSet(new Set(data.connected));
    } catch (e) {
      setReposError(e instanceof Error ? e.message : 'Failed to load repos');
    } finally {
      setLoadingRepos(false);
    }
  }, [currentUser?.id, listReposForConnect]);

  const handleConnectRepo = async (owner: string, repo: string) => {
    if (!currentUser?.id) return;
    const fullName = `${owner}/${repo}`;
    setConnectingRepo(fullName);
    try {
      const result = await authClient.getAccessToken({ providerId: 'github' });
      const accessToken =
        result && 'data' in result && result.data
          ? result.data.accessToken
          : undefined;
      if (!accessToken) {
        setReposError('GitHub token not found.');
        return;
      }
      await createWebhook({
        accessToken,
        userId: currentUser.id,
        owner,
        repo,
      });
      setReposConnectedSet((prev) => new Set(prev).add(fullName));
    } catch (e) {
      setReposError(e instanceof Error ? e.message : 'Failed to connect repo');
    } finally {
      setConnectingRepo(null);
    }
  };

  const handleDisconnectRepo = async (repositoryFullName: string) => {
    if (!currentUser?.id) return;
    setDisconnectingRepo(repositoryFullName);
    setReposError(null);
    try {
      const result = await authClient.getAccessToken({ providerId: 'github' });
      const accessToken =
        result && 'data' in result && result.data
          ? result.data.accessToken
          : undefined;
      if (!accessToken) {
        setReposError('GitHub token not found.');
        return;
      }
      await deleteWebhook({
        accessToken,
        userId: currentUser.id,
        repositoryFullName,
      });
      setReposConnectedSet((prev) => {
        const next = new Set(prev);
        next.delete(repositoryFullName);
        return next;
      });
    } catch (e) {
      setReposError(
        e instanceof Error ? e.message : 'Failed to disconnect repo',
      );
    } finally {
      setDisconnectingRepo(null);
    }
  };

  const handleFollow = async () => {
    if (!profile) return;

    try {
      if (isFollowing)
        await unfollow({
          followerId: currentUser!.id,
          followingId: profile.id,
        });
      else
        await follow({ followerId: currentUser!.id, followingId: profile.id });

      window.location.reload();
    } catch {
      // ignore
    }
  };

  const handleHighlight = async (storyId: string, isHighlighted: boolean) => {
    if (!currentUser?.id) return;

    try {
      if (isHighlighted)
        await unsetHighlight({
          storyId: storyId as never,
          userId: currentUser.id,
        });
      else
        await setHighlight({
          storyId: storyId as never,
          userId: currentUser.id,
        });
    } catch {
      // ignore
    }
  };

  if (data === undefined) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#fefefe] px-4'>
        <div className='flex flex-col items-center gap-4'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className='w-10 h-10 sm:w-12 sm:h-12 border-2 sm:border-[3px] border-black border-t-transparent rounded-full'
          />

          <p className='text-black/70 text-xs sm:text-sm font-(--font-sketch)'>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#fefefe] px-4'>
        <div className='text-center space-y-3 sm:space-y-4'>
          <h2 className='text-2xl sm:text-3xl text-black font-(--font-sketch)'>
            User not found
          </h2>

          <p className='text-black/70 font-(--font-sketch) text-sm sm:text-base'>
            This user doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const selectedStory = highlights.find((s) => s.id === selectedStoryId);

  return (
    <div className='min-h-screen bg-[#faf8f5]'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-24 sm:py-8 sm:pb-24 lg:pb-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='relative p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 bg-white border-[3px] border-black rounded-2xl'
          style={{ transform: 'rotate(-0.5deg)' }}
        >
          <HandDrawnCardBorder />

          <div className='relative z-10 flex items-start gap-4 sm:gap-6'>
            <div className='relative shrink-0'>
              <Image
                src={profile.avatarUrl ?? ''}
                alt={profile.username ?? ''}
                className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl border-[3px] border-black'
                width={96}
                height={96}
              />
            </div>

            <div className='flex-1 min-w-0'>
              <h1 className='text-2xl sm:text-3xl md:text-4xl text-black mb-1 font-(--font-sketch) truncate'>
                {profile.displayName ?? profile.username}
              </h1>

              <p className='text-black/70 mb-4 sm:mb-6 text-xs sm:text-sm font-(--font-sketch)'>
                @{profile.username}
              </p>

              {!isOwnProfile && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFollow}
                  className={`flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 border-[3px] border-black text-base sm:text-lg transition-all rounded-xl font-(--font-sketch) ${
                    isFollowing
                      ? 'bg-black text-white hover:bg-white hover:text-black'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className='w-4 h-4' /> Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className='w-4 h-4' /> Follow
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='relative p-4 sm:p-6 mb-6 sm:mb-8 bg-white border-[3px] border-black rounded-2xl'
            style={{ transform: 'rotate(-0.5deg)' }}
          >
            <HandDrawnCardBorder />
            <div className='relative z-10'>
              <div className='flex items-center gap-2 mb-3 sm:mb-4'>
                <Github className='w-5 h-5 sm:w-6 sm:h-6' />
                <h2 className='text-xl sm:text-2xl text-black font-(--font-sketch)'>
                  Repositories
                </h2>
              </div>
              <p className='text-xs sm:text-sm text-black/70 mb-3 sm:mb-4 font-(--font-sketch)'>
                Connect repos to turn commits into stories automatically.
              </p>
              {connectedRepos && connectedRepos.length > 0 && (
                <ul className='space-y-2 mb-4'>
                  {connectedRepos.map((r) => (
                    <li
                      key={r.repositoryFullName}
                      className='flex items-center justify-between gap-2 p-3 bg-[#faf8f5] border-2 border-black rounded-lg font-(--font-sketch)'
                    >
                      <a
                        href={`https://github.com/${r.repositoryFullName}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-black hover:underline truncate min-w-0'
                      >
                        {r.repositoryFullName}
                      </a>
                      <div className='flex items-center gap-2 shrink-0'>
                        <span className='text-xs text-black/60 hidden sm:inline'>
                          Connected
                        </span>
                        <motion.button
                          type='button'
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleDisconnectRepo(r.repositoryFullName)
                          }
                          disabled={disconnectingRepo === r.repositoryFullName}
                          className='flex items-center gap-1.5 px-2.5 py-1.5 border-2 border-black rounded-lg bg-white hover:bg-red-50 hover:border-red-400 text-black text-xs font-(--font-sketch) transition-colors disabled:opacity-60'
                          title='Disconnect repo'
                        >
                          {disconnectingRepo === r.repositoryFullName ? (
                            <Loader2 className='w-3.5 h-3.5 animate-spin' />
                          ) : (
                            <Unplug className='w-3.5 h-3.5' />
                          )}
                          <span className='hidden sm:inline'>Disconnect</span>
                        </motion.button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {connectedRepos &&
                connectedRepos.length === 0 &&
                !reposForConnect && (
                  <p className='text-sm text-black/60 mb-4 font-(--font-sketch)'>
                    No repositories connected yet.
                  </p>
                )}
              {reposError && (
                <p className='text-sm text-red-600 mb-4 font-(--font-sketch)'>
                  {reposError}
                </p>
              )}
              {reposForConnect === null ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadReposForConnect}
                  disabled={loadingRepos}
                  className='flex items-center gap-2 px-4 py-2 border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors font-(--font-sketch) disabled:opacity-60'
                >
                  {loadingRepos ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <Plus className='w-4 h-4' />
                  )}
                  {loadingRepos ? 'Loading...' : 'Connect repository'}
                </motion.button>
              ) : (
                <div className='space-y-2 max-h-60 overflow-y-auto'>
                  {reposForConnect.filter(
                    (r) => !reposConnectedSet.has(r.fullName),
                  ).length === 0 ? (
                    <p className='text-sm text-black/70 font-(--font-sketch) py-2'>
                      All listed repos are already connected.
                    </p>
                  ) : (
                    reposForConnect
                      .filter((r) => !reposConnectedSet.has(r.fullName))
                      .slice(0, 100)
                      .map((r) => (
                        <div
                          key={r.fullName}
                          className='flex items-center justify-between p-3 bg-[#faf8f5] border-2 border-black rounded-lg'
                        >
                          <span className='font-(--font-sketch) text-sm'>
                            {r.fullName}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleConnectRepo(
                                r.owner || r.fullName.split('/')[0],
                                r.name,
                              )
                            }
                            disabled={connectingRepo === r.fullName}
                            className='px-3 py-1.5 border-2 border-black rounded-lg bg-black text-white text-sm font-(--font-sketch) hover:bg-white hover:text-black transition-colors disabled:opacity-60'
                          >
                            {connectingRepo === r.fullName ? (
                              <Loader2 className='w-4 h-4 animate-spin inline' />
                            ) : (
                              'Connect'
                            )}
                          </motion.button>
                        </div>
                      ))
                  )}
                  {reposForConnect.filter(
                    (r) => !reposConnectedSet.has(r.fullName),
                  ).length > 20 && (
                    <p className='text-xs text-black/60 font-(--font-sketch)'>
                      Showing first 100. Connect one to add more.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {highlights.length > 0 && (
          <div>
            <div className='flex items-center justify-between mb-4 sm:mb-6'>
              <h2
                className='text-2xl sm:text-3xl md:text-4xl text-black font-(--font-sketch)'
                style={{ transform: 'rotate(-1deg)' }}
              >
                Highlights
              </h2>

              <span className='text-xs sm:text-sm text-black/60 font-(--font-sketch)'>
                {highlights.length} saved
              </span>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4'>
              {highlights.map((story) => (
                <div
                  key={story.id}
                  className='group relative p-3 sm:p-4 md:p-6 bg-white border-[3px] border-black cursor-pointer aspect-square flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all hover:scale-105 rounded-2xl'
                >
                  <HandDrawnCardBorder />

                  <div
                    className='relative z-10 w-full h-full flex flex-col items-center justify-center'
                    onClick={() => setSelectedStoryId(story.id)}
                  >
                    <StoryBubble story={story as Story} />

                    {story.commit && (
                      <p className='text-xs text-black/70 text-center line-clamp-2 mt-2 font-(--font-sketch)'>
                        {story.commit.message?.split('\n')[0]}
                      </p>
                    )}

                    <div className='flex items-center gap-1 mt-2 text-xs text-black/60'>
                      <Eye className='w-3 h-3' />
                      <span>{story.viewCount ?? 0}</span>
                    </div>
                  </div>

                  {isOwnProfile && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHighlight(story.id, story.isHighlight);
                      }}
                      className='absolute top-2 right-2 z-20 p-1.5 bg-white border border-black rounded-full hover:bg-yellow-50'
                    >
                      <Pin
                        className={`w-4 h-4 ${story.isHighlight ? 'fill-yellow-400 text-yellow-500' : 'text-gray-400'}`}
                      />
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {highlights.length === 0 && isOwnProfile && (
          <div className='text-center py-10 sm:py-16 px-4'>
            <p className='text-black/70 mb-1 font-(--font-sketch) text-sm sm:text-base'>
              No highlights yet
            </p>

            <p className='text-xs sm:text-sm text-black/60 font-(--font-sketch)'>
              Pin your favorite stories to save them permanently
            </p>
          </div>
        )}

        {isOwnProfile && highlights.length > 0 && (
          <div className='mt-6 sm:mt-8 relative p-4 sm:p-6 bg-white border-[3px] border-black rounded-2xl'>
            <HandDrawnCardBorder />

            <div className='relative z-10'>
              <h2 className='text-xl sm:text-2xl text-black mb-3 sm:mb-4 font-(--font-sketch)'>
                Insights
              </h2>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
                <div className='p-4 bg-[#faf8f5] border-2 border-black rounded-lg'>
                  <div className='flex items-center gap-2 mb-1'>
                    <Eye className='w-5 h-5' />
                    <h3 className='text-base font-(--font-sketch)'>
                      Total Views
                    </h3>
                  </div>

                  <p className='text-2xl font-bold'>
                    {highlights.reduce((sum, s) => sum + (s.viewCount ?? 0), 0)}
                  </p>
                </div>

                <div className='p-4 bg-[#faf8f5] border-2 border-black rounded-lg'>
                  <div className='flex items-center gap-2 mb-1'>
                    <Pin className='w-5 h-5 text-yellow-500 fill-yellow-500' />
                    <h3 className='text-base font-(--font-sketch)'>
                      Highlights
                    </h3>
                  </div>

                  <p className='text-2xl font-bold'>{highlights.length}</p>
                </div>

                <div className='p-4 bg-[#faf8f5] border-2 border-black rounded-lg'>
                  <h3 className='text-base font-(--font-sketch)'>Avg Views</h3>

                  <p className='text-2xl font-bold'>
                    {highlights.length > 0
                      ? Math.round(
                          highlights.reduce(
                            (sum, s) => sum + (s.viewCount ?? 0),
                            0,
                          ) / highlights.length,
                        )
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedStory && (
        <StoryViewer
          key={selectedStory.id}
          story={selectedStory}
          onClose={() => setSelectedStoryId(null)}
          currentUserId={currentUser?.id ?? null}
        />
      )}
    </div>
  );
}
