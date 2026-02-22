'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import type { Story } from '@/lib/types';

interface StoryBubbleProps {
  story: Story;
  isActive?: boolean;
  onClick?: () => void;
}

function HandDrawnCircle({ isActive }: { isActive: boolean }) {
  return (
    <motion.svg
      width={80}
      height={80}
      viewBox='0 0 80 80'
      className='absolute inset-0'
    >
      <motion.circle
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        cx='40'
        cy='40'
        r='38'
        fill='none'
        stroke='black'
        strokeWidth={isActive ? 3 : 2}
        strokeLinecap='round'
        strokeDasharray='240'
        style={{ filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.1))' }}
      />
      {isActive && (
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          cx='40'
          cy='40'
          r='35'
          fill='none'
          stroke='black'
          strokeWidth='2'
          strokeDasharray='10 5'
        />
      )}
    </motion.svg>
  );
}

export function StoryBubble({ story, isActive, onClick }: StoryBubbleProps) {
  const user = story.user;

  if (!user) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className='flex flex-col items-center gap-3 cursor-pointer group shrink-0 pt-1'
    >
      <div className='relative w-20 h-20 mt-1'>
        <HandDrawnCircle isActive={!!isActive} />

        <div className='absolute inset-2 rounded-full overflow-hidden border-2 border-black bg-white'>
          <Image
            src={user.avatarUrl ?? ''}
            alt={user.username ?? ''}
            width={64}
            height={64}
            className='rounded-full object-cover w-full h-full'
          />
        </div>
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className='absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full border-2 border-white'
          />
        )}
      </div>

      <span className='text-xs text-black/70 max-w-[90px] truncate group-hover:text-black transition-colors font-(--font-sketch)'>
        {user.username}
      </span>
    </motion.div>
  );
}
