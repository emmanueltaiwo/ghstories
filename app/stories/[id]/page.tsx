'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { StoryViewer } from '@/components/story-viewer';
import type { StoryViewerStory } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { use, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { user } = useAuth();

  const story = useQuery(
    api.stories.get,
    id ? { storyId: id as Id<'stories'> } : 'skip'
  );

  const storyUserId = story?.userId;

  const userStories =
    useQuery(
      api.stories.listUserStories,
      storyUserId ? { userId: storyUserId } : 'skip'
    ) ?? [];

  const { sortedStories, currentStoryIndex } = useMemo(() => {
    if (userStories.length === 0)
      return { sortedStories: [], currentStoryIndex: 0 };

    const sorted = [...userStories].sort((a, b) => a.createdAt - b.createdAt);
    const allViewed = sorted.every((s) => s.viewCount > 0);
    const foundIndex = sorted.findIndex((s) => s.id === id);
    const index =
      allViewed && foundIndex === sorted.length - 1
        ? 0
        : Math.max(0, foundIndex);

    return { sortedStories: sorted, currentStoryIndex: index };
  }, [userStories, id]);

  if (story === undefined) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white' />
      </div>
    );
  }

  if (!story) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black text-white'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>Story not found</h2>

          <button
            onClick={() => router.push('/feed')}
            className='px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200'
          >
            Go to Feed
          </button>
        </div>
      </div>
    );
  }

  const currentStory = sortedStories[currentStoryIndex] ?? story;

  const handleNext = () => {
    if (currentStoryIndex < sortedStories.length - 1)
      router.push(`/stories/${sortedStories[currentStoryIndex + 1].id}`);
    else router.push('/feed');
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0)
      router.push(`/stories/${sortedStories[currentStoryIndex - 1].id}`);
  };

  return (
    <StoryViewer
      key={currentStory.id}
      story={currentStory as unknown as StoryViewerStory}
      onClose={() => router.push('/feed')}
      onNext={
        currentStoryIndex < sortedStories.length - 1 ? handleNext : undefined
      }
      onPrevious={currentStoryIndex > 0 ? handlePrevious : undefined}
      hasNext={currentStoryIndex < sortedStories.length - 1}
      hasPrevious={currentStoryIndex > 0}
      allStories={sortedStories as unknown as StoryViewerStory[]}
      currentIndex={currentStoryIndex}
      currentUserId={user?.id ?? null}
    />
  );
}
