'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Eye, X } from 'lucide-react';
import Image from 'next/image';
import type { StoryViewerRecord } from '@/lib/types';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

interface StoryViewersModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: Id<'stories'>;
  ownerId: string;
}

export function StoryViewersModal({
  isOpen,
  onClose,
  storyId,
  ownerId,
}: StoryViewersModalProps) {
  const args = isOpen && storyId && ownerId ? { storyId, ownerId } : 'skip';

  const data = useQuery(api.storyViews.listViewers, args);

  const viewers: StoryViewerRecord[] = data?.viewers ?? [];
  const totalViews = data?.totalViews ?? 0;
  const isLoading = isOpen && data === undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/50 z-50'
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className='fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 max-h-[80vh] flex flex-col max-w-md mx-auto'
          >
            <div className='flex items-center justify-between p-4 border-b'>
              <div className='flex items-center gap-2'>
                <Eye className='w-5 h-5 text-gray-600' />
                <h2 className='text-lg font-semibold'>Story Viewers</h2>
              </div>
              <button
                onClick={onClose}
                className='p-1 hover:bg-gray-100 rounded-full transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='p-4 border-b bg-gray-50'>
              <p className='text-sm text-gray-600'>
                <span className='font-semibold'>{totalViews}</span> total view
                {totalViews !== 1 ? 's' : ''}
              </p>
            </div>

            <div className='flex-1 overflow-y-auto'>
              {isLoading ? (
                <div className='flex justify-center py-12'>
                  <div className='w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin' />
                </div>
              ) : viewers.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-12 px-4'>
                  <Eye className='w-12 h-12 text-gray-300 mb-2' />
                  <p className='text-gray-500 text-sm'>No viewers yet</p>
                </div>
              ) : (
                <div className='divide-y'>
                  {viewers.map((viewer) => (
                    <div
                      key={viewer.id}
                      className='flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors'
                    >
                      <div className='relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0'>
                        {viewer.avatarUrl ? (
                          <Image
                            src={viewer.avatarUrl}
                            alt={viewer.username ?? ''}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-400'>
                            {viewer.username?.[0]?.toUpperCase() ?? '?'}
                          </div>
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-sm truncate'>
                          {viewer.displayName ?? viewer.username}
                        </p>

                        <p className='text-xs text-gray-500 truncate'>
                          @{viewer.username}
                        </p>
                      </div>
                      <p className='text-xs text-gray-400'>
                        {new Date(viewer.viewedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
