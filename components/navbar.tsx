'use client';

import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { Github } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const pathname = usePathname();

  if (isAuthenticated && pathname !== '/') return null;

  return (
    <nav className='sticky top-0 z-40 w-full border-b-[3px] border-black bg-[#faf8f5]/95 backdrop-blur-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-14 sm:h-16'>
          <Link href='/' className='flex items-center gap-2 sm:gap-3'>
            <motion.div
              whileHover={{ rotate: [0, -2, 2, 0] }}
              className='w-9 h-9 sm:w-10 sm:h-10 border-2 sm:border-[3px] border-black rounded-lg flex items-center justify-center bg-white'
              style={{ transform: 'rotate(-2deg)' }}
            >
              <Github
                className='w-5 h-5'
                style={{ transform: 'rotate(2deg)' }}
              />
            </motion.div>
            <span
              className='text-lg sm:text-xl font-(--font-sketch)'
              style={{ transform: 'rotate(-1deg)' }}
            >
              ghstories
            </span>
          </Link>

          <div className='flex items-center gap-2 sm:gap-3'>
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className='w-7 h-7 sm:w-8 sm:h-8 border-2 sm:border-[3px] border-black border-t-transparent rounded-full'
              />
            ) : isAuthenticated ? (
              <Link href='/feed'>
                <motion.span
                  whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
                  whileTap={{ scale: 0.95 }}
                  className='inline-block px-4 py-2 sm:px-6 sm:py-2.5 border-2 sm:border-[3px] border-black bg-white text-base sm:text-lg hover:bg-black hover:text-white transition-all rounded-lg'
                  style={{
                    transform: 'rotate(1deg)',
                    fontFamily: 'var(--font-sketch)',
                  }}
                >
                  Feed
                </motion.span>
              </Link>
            ) : (

              <motion.button
                whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signIn()}
                className='px-4 py-2 sm:px-6 sm:py-2.5 border-2 sm:border-[3px] border-black bg-white text-base sm:text-lg hover:bg-black hover:text-white transition-all rounded-lg'
                style={{
                  transform: 'rotate(1deg)',
                  fontFamily: 'var(--font-sketch)',
                }}
              >
                Sign in
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
