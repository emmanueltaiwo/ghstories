'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Story, StoryViewerStory } from '@/lib/types';
import { StoryBubble } from '@/components/story-bubble';
import { StoryViewer } from '@/components/story-viewer';
import { useAuth } from '@/hooks/use-auth';

function HandDrawnCardBorder() {
  return (
    <svg
      className='absolute inset-0 w-full h-full pointer-events-none'
      viewBox='0 0 400 200'
      preserveAspectRatio='none'
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        d='M10,10 Q5,5 10,15 T20,20 Q15,25 25,30 T35,40 Q30,45 40,50 T50,60 Q45,65 55,70 T65,80 Q60,85 70,90 T80,100 Q75,105 85,110 T95,120 Q90,125 100,130 T110,140 Q105,145 115,150 T125,160 Q120,165 130,170 T140,180 Q135,185 145,190 T155,190 L380,190 Q390,185 390,175 L390,25 Q385,15 375,15 L25,15 Q15,10 10,10 Z'
        fill='none'
        stroke='black'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default function FeedPage() {
  const { user, isLoading: isLoadingUser } = useAuth();
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const feedStoriesQuery = useQuery(
    api.stories.listFeed,
    user?.id ? { currentUserId: user.id } : 'skip'
  );
  const myStoriesQuery = useQuery(
    api.stories.listMyStories,
    user?.id ? { userId: user.id } : 'skip'
  );

  const feedStories = feedStoriesQuery ?? [];
  const myStories = myStoriesQuery ?? [];

  const storyMap = new Map<string, Story>();

  feedStories.forEach((s) => storyMap.set(s.id, s as unknown as Story));
  myStories.forEach((s) => {
    if (!storyMap.has(s.id)) storyMap.set(s.id, s as unknown as Story);
  });

  const allStories = Array.from(storyMap.values()).sort(
    (a, b) => b.createdAt - a.createdAt
  );

  const isStoriesLoading =
    isLoadingUser ||
    (!!user?.id &&
      (feedStoriesQuery === undefined || myStoriesQuery === undefined));

  const selectedStory = allStories.find((s) => s.id === selectedStoryId);
  const selectedUserId = selectedStory?.userId;

  const userStories =
    useQuery(
      api.stories.listUserStories,
      selectedUserId ? { userId: selectedUserId } : 'skip'
    ) ?? [];

  const currentUserStories = useMemo(() => {
    if (userStories.length === 0 && selectedStory) return [selectedStory];
    if (userStories.length === 0) return [];

    const sorted = [...userStories].sort((a, b) => a.createdAt - b.createdAt);
    const firstUnviewed = sorted.findIndex((s) => s.viewCount === 0);

    if (firstUnviewed >= 0) return sorted.slice(firstUnviewed);
    return sorted;
  }, [userStories, selectedStory]);

  const currentIndex =
    selectedStoryId && currentUserStories.length > 0
      ? currentUserStories.findIndex((s) => s.id === selectedStoryId)
      : -1;

  const handleStoryClick = (userId: string) => {
    const list = allStories.filter((s) => s.userId === userId);
    const sorted = [...list].sort((a, b) => a.createdAt - b.createdAt);
    const firstUnviewedIndex = sorted.findIndex((s) => s.viewCount === 0);
    const start = firstUnviewedIndex >= 0 ? firstUnviewedIndex : 0;

    setSelectedStoryId(sorted[start]?.id ?? null);
  };

  const handleNext = () => {
    if (currentIndex < currentUserStories.length - 1)
      setSelectedStoryId(currentUserStories[currentIndex + 1].id);
    else setSelectedStoryId(null);
  };

  const handlePrevious = () => {
    if (currentIndex > 0)
      setSelectedStoryId(currentUserStories[currentIndex - 1].id);
  };

  const storiesByUser = useMemo(() => {
    const acc: Record<string, Story[]> = {};

    allStories.forEach((s) => {
      if (!acc[s.userId]) acc[s.userId] = [];
      acc[s.userId].push(s);
    });

    return acc;
  }, [allStories]);

  if (!user && !isLoadingUser) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#faf8f5] px-4'>
        <p className='text-black/70 font-(--font-sketch) text-sm sm:text-base text-center'>
          Sign in to see your feed.
        </p>
      </div>
    );
  }

  if (isStoriesLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#faf8f5] px-4'>
        <div className='flex flex-col items-center gap-4'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className='w-10 h-10 sm:w-12 sm:h-12 border-2 sm:border-[3px] border-black border-t-transparent rounded-full'
          />

          <p className='text-black/70 text-xs sm:text-sm font-(--font-sketch)'>
            Loading stories...
          </p>
        </div>
      </div>
    );
  }

  if (allStories.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#faf8f5]'>
        <div className='text-center space-y-3 sm:space-y-4 max-w-md'>
          <h2 className='text-2xl sm:text-3xl text-black font-(--font-sketch)'>
            No stories yet
          </h2>

          <p className='text-black/70 font-(--font-sketch) text-sm sm:text-base'>
            {myStories.length === 0
              ? 'Connect a repo in your profile to create stories from commits, or follow other developers to see their stories.'
              : 'Follow other developers to see their commit stories here.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#faf8f5]'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-24 sm:py-6 sm:pb-24 lg:pb-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-4 sm:mb-6'
        >
          <h1
            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black mb-1 sm:mb-2 font-(--font-sketch)'
            style={{ transform: 'rotate(-1deg)' }}
          >
            Stories
          </h1>

          <p
            className='text-black/70 text-xs sm:text-sm font-(--font-sketch)'
            style={{ transform: 'rotate(0.5deg)' }}
          >
            See what developers are building
          </p>
        </motion.div>

        <div className='mb-4 sm:mb-6 pt-2 sm:pt-4 pb-2'>
          <div className='flex gap-2 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 overflow-y-visible'>
            {Object.entries(storiesByUser).map(([userId, list]) => {
              const sorted = [...list].sort(
                (a, b) => a.createdAt - b.createdAt
              );
              const hasUnviewed = list.some((s) => s.viewCount === 0);
              const first = sorted[0];

              if (!first) return null;

              return (
                <StoryBubble
                  key={userId}
                  story={first}
                  isActive={hasUnviewed}
                  onClick={() => handleStoryClick(userId)}
                />
              );
            })}
          </div>
        </div>

        <div className='space-y-3 sm:space-y-4'>
          {Object.entries(storiesByUser).map(([userId, userStoryList], i) => {
            const firstStory = userStoryList[0];
            const user = firstStory.user;
            const latestStory = userStoryList[0];
            const commit = latestStory.commit;
            const rotation = i % 2 === 0 ? -0.5 : 0.5;

            return (
              <motion.div
                key={userId}
                initial={{ opacity: 0, y: 20, rotate: rotation }}
                animate={{ opacity: 1, y: 0, rotate: rotation }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, rotate: rotation + 1, scale: 1.02 }}
                onClick={() => handleStoryClick(userId)}
                className='group relative p-4 sm:p-6 bg-white border-[3px] border-black cursor-pointer transition-all rounded-2xl'
              >
                <HandDrawnCardBorder />

                <div className='relative z-10 flex items-start gap-3 sm:gap-4'>
                  <div className='relative shrink-0'>
                    <motion.img
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      src={user?.avatarUrl ?? undefined}
                      alt={user?.username ?? undefined}
                      className='w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-black'
                    />

                    {userStoryList.some((s) => s.viewCount === 0) && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className='absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full border-2 border-white'
                      />
                    )}
                  </div>

                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1 sm:mb-2'>
                      <h3 className='text-black text-sm sm:text-base font-(--font-sketch) truncate'>
                        {user?.username}
                      </h3>
                      <span className='text-black/50'>·</span>
                      <span className='text-xs text-black/60 font-(--font-sketch)'>
                        {userStoryList.length}{' '}
                        {userStoryList.length === 1 ? 'story' : 'stories'}
                      </span>
                    </div>

                    {commit && (
                      <p className='text-sm text-black/80 truncate mb-2 font-(--font-sketch)'>
                        {commit.message?.split('\n')[0]}
                      </p>
                    )}

                    <div className='flex items-center gap-3 text-xs text-black/60 font-(--font-sketch)'>
                      <span>
                        {new Date(latestStory.createdAt).toLocaleDateString()}
                      </span>
                      {commit?.repositoryName && (
                        <>
                          <span>·</span>
                          <span className='font-mono'>
                            {commit.repositoryName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className='shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <div className='w-10 h-10 border-2 border-black rounded-lg bg-white flex items-center justify-center'>
                      <span className='text-black font-bold'>→</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {selectedStory && (
        <StoryViewer
          key={selectedStory.id}
          story={selectedStory as StoryViewerStory}
          onClose={() => setSelectedStoryId(null)}
          onNext={
            currentIndex < currentUserStories.length - 1
              ? handleNext
              : undefined
          }
          onPrevious={currentIndex > 0 ? handlePrevious : undefined}
          hasNext={currentIndex < currentUserStories.length - 1}
          hasPrevious={currentIndex > 0}
          allStories={currentUserStories as StoryViewerStory[]}
          currentIndex={currentIndex >= 0 ? currentIndex : 0}
          currentUserId={user?.id ?? null}
        />
      )}
    </div>
  );
}
