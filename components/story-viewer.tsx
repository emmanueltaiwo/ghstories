'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, type PanInfo } from 'motion/react';
import { X, Heart, Eye, Star } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { StoryViewersModal } from './story-viewers-modal';
import type { StoryViewerStory, Reaction } from '@/lib/types';

const THEME_GRADIENTS: Record<string, string> = {
  sunset: 'from-orange-400 via-pink-500 to-red-500',
  ocean: 'from-blue-400 via-cyan-500 to-teal-500',
  forest: 'from-green-400 via-emerald-500 to-teal-500',
  purple: 'from-purple-400 via-pink-500 to-purple-600',
  pink: 'from-pink-400 via-rose-500 to-pink-600',
  blue: 'from-blue-400 via-indigo-500 to-blue-600',
  green: 'from-green-400 via-emerald-500 to-green-600',
  orange: 'from-orange-400 via-amber-500 to-orange-600',
};

interface StoryViewerProps {
  story: StoryViewerStory;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  allStories?: StoryViewerStory[];
  currentIndex?: number;
  currentUserId?: string | null;
}

export function StoryViewer({
  story,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  allStories = [],
  currentIndex = 0,
  currentUserId,
}: StoryViewerProps) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showViewersModal, setShowViewersModal] = useState(false);

  const storyId = story.id as Id<'stories'>;
  const isOwnStory = currentUserId && story.userId === currentUserId;

  const reactions =
    useQuery(api.reactions.list, {
      storyId,
      currentUserId: currentUserId ?? undefined,
    }) ?? [];

  const recordView = useMutation(api.stories.recordView);
  const addReaction = useMutation(api.reactions.add);
  const removeReaction = useMutation(api.reactions.remove);
  const setHighlight = useMutation(api.stories.setHighlight);
  const unsetHighlight = useMutation(api.stories.unsetHighlight);

  useEffect(() => {
    if (currentUserId && story.userId !== currentUserId) {
      recordView({ storyId, viewerId: currentUserId }).catch(() => {});
    }
  }, [storyId, currentUserId, story.userId, recordView]);

  useEffect(() => {
    if (isPaused || progress >= 100) {
      if (progress >= 100 && !isPaused) {
        if (hasNext && onNext) onNext();
        else onClose();
      }
      return;
    }

    const duration = 5000;
    const interval = 100;
    const increment = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + increment));
    }, interval);
    return () => clearInterval(timer);
  }, [isPaused, progress, hasNext, onNext, onClose]);

  const handleReaction = useCallback(
    async (emoji: string) => {
      if (!currentUserId) return;
      const current = reactions.find((r) => r.hasReacted);
      if (current?.emoji === emoji) {
        await removeReaction({ storyId, userId: currentUserId, emoji });
      } else {
        await addReaction({ storyId, userId: currentUserId, emoji });
      }
    },
    [storyId, currentUserId, reactions, addReaction, removeReaction]
  );

  const handleHighlight = useCallback(async () => {
    if (!currentUserId || story.userId !== currentUserId) return;
    if (story.isHighlight) {
      await unsetHighlight({ storyId, userId: currentUserId });
    } else {
      await setHighlight({ storyId, userId: currentUserId });
    }
  }, [
    storyId,
    currentUserId,
    story.userId,
    story.isHighlight,
    setHighlight,
    unsetHighlight,
  ]);

  const handleClick = useCallback(() => {
    onNext?.();
  }, [onNext]);

  const handleDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 50;
      if (info.offset.x > threshold && onPrevious) onPrevious();
      else if (info.offset.x < -threshold && onNext) onNext();
    },
    [onNext, onPrevious]
  );

  const commit = story.commit;
  const theme = 'blue';
  const gradient = THEME_GRADIENTS[theme] ?? THEME_GRADIENTS.blue;
  const createdAtMs =
    typeof story.createdAt === 'number'
      ? story.createdAt
      : new Date(story.createdAt).getTime();

  return (
    <div className='fixed inset-0 z-50 bg-black'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='relative h-full w-full'
      >
        {allStories.length > 0 ? (
          <div className='absolute top-4 left-4 right-4 z-10 flex gap-1'>
            {allStories.map((s, index) => {
              const isCurrent = index === currentIndex;
              const isViewed =
                index < currentIndex || (isCurrent && progress > 0);
              const currentProgress = isCurrent ? progress : isViewed ? 100 : 0;
              return (
                <div
                  key={s.id}
                  className='flex-1 h-1 bg-white/30 rounded-full overflow-hidden'
                >
                  <motion.div
                    className='h-full bg-white'
                    initial={{ width: 0 }}
                    animate={{ width: `${currentProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className='absolute top-0 left-0 right-0 h-0.5 bg-black/30 z-10'>
            <motion.div
              className='h-full bg-white shadow-lg shadow-white/50'
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className='absolute top-6 right-6 z-20 p-3 border-[3px] border-white/30 bg-black/60 hover:bg-black/80 backdrop-blur-sm transition-all hover:border-white/50 rounded-xl'
          style={{ transform: 'rotate(-2deg)' }}
        >
          <X className='w-5 h-5 text-white' />
        </motion.button>

        {hasPrevious && onPrevious && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onPrevious}
            className='absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 border-[3px] border-white/30 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-xl'
            style={{ transform: 'rotate(-2deg)' }}
          >
            <svg
              className='w-6 h-6 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </motion.button>
        )}

        {hasNext && onNext && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onNext}
            className='absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 border-[3px] border-white/30 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-xl'
            style={{ transform: 'rotate(2deg)' }}
          >
            <svg
              className='w-6 h-6 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </motion.button>
        )}

        <motion.div
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onClick={handleClick}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={`h-full w-full bg-linear-to-br ${gradient} flex items-center justify-center p-8 relative overflow-hidden cursor-pointer`}
        >
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse' />
            <div
              className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse'
              style={{ animationDelay: '1s' }}
            />
          </div>
          <div className='max-w-2xl w-full text-center space-y-8 relative z-10'>
            {commit && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/20'
              >
                <span className='text-white/90 text-xs font-mono font-medium'>
                  {commit.repositoryName}
                </span>
              </motion.div>
            )}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className='text-5xl md:text-7xl font-bold text-white drop-shadow-2xl leading-tight'
            >
              {commit?.message?.split('\n')[0] ?? 'Commit Story'}
            </motion.h1>
            {commit?.message?.includes('\n') && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className='text-xl md:text-2xl text-white/95 drop-shadow-lg leading-relaxed max-w-xl mx-auto whitespace-pre-line'
              >
                {commit.message.split('\n').slice(1).join('\n').trim()}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='text-white/80 text-sm font-medium'
            >
              {new Date(createdAtMs).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </motion.div>
          </div>
        </motion.div>

        <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3'>
          {['❤️', '🔥', '🚀', '✨'].map((emoji) => {
            const r = reactions.find((x) => x.emoji === emoji);
            const active = r?.hasReacted ?? false;
            const activeClass =
              emoji === '❤️'
                ? 'bg-red-500 border-red-400'
                : emoji === '🔥'
                  ? 'bg-orange-500 border-orange-400'
                  : emoji === '🚀'
                    ? 'bg-blue-500 border-blue-400'
                    : 'bg-yellow-500 border-yellow-400';
            return (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction(emoji);
                }}
                className={`p-3.5 rounded-xl transition-all backdrop-blur-sm border text-xl ${active ? `${activeClass} text-white` : 'bg-white/10 text-white hover:bg-white/20 border-white/20'}`}
              >
                {emoji === '❤️' ? (
                  <Heart
                    className={`w-5 h-5 ${active ? 'fill-current' : ''}`}
                  />
                ) : (
                  emoji
                )}
              </motion.button>
            );
          })}
          {isOwnStory && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleHighlight();
              }}
              className={`p-3.5 rounded-xl transition-all backdrop-blur-sm border ${
                story.isHighlight
                  ? 'bg-yellow-500 text-white border-yellow-400'
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
              }`}
            >
              <Star
                className={`w-5 h-5 ${story.isHighlight ? 'fill-current' : ''}`}
              />
            </motion.button>
          )}
        </div>

        {reactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2'
          >
            {reactions.map((reaction) => (
              <div
                key={reaction.emoji}
                className='px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-sm flex items-center gap-1.5 border border-white/10'
              >
                <span className='text-base'>{reaction.emoji}</span>
                <span className='font-medium'>{reaction.count}</span>
              </div>
            ))}
          </motion.div>
        )}

        {isOwnStory && story.viewCount !== undefined && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowViewersModal(true)}
            className='absolute top-20 right-4 z-20 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-sm flex items-center gap-2 border border-white/10 hover:bg-black/80'
          >
            <Eye className='w-4 h-4' />
            <span className='font-medium'>{story.viewCount ?? 0}</span>
          </motion.button>
        )}

        <StoryViewersModal
          isOpen={showViewersModal}
          onClose={() => setShowViewersModal(false)}
          storyId={storyId}
          ownerId={story.userId}
        />
      </motion.div>
    </div>
  );
}
