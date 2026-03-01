'use client';

import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const GITHUB_REPO = 'emmanueltaiwo/ghstories';
const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`;

export function Navbar() {
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const pathname = usePathname();
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === 'number')
          setStars(data.stargazers_count);
      })
      .catch(() => {});
  }, []);

  if (isAuthenticated && pathname !== '/') return null;

  return (
    <nav className='sticky top-0 z-40 w-full border-b-[3px] border-black bg-[#faf8f5]/95 backdrop-blur-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-14 sm:h-16'>
          <Link href='/' className='flex items-center gap-2 sm:gap-3'>
            <motion.div
              whileHover={{ rotate: [0, -2, 2, 0] }}
              className='w-9 h-9 sm:w-10 sm:h-10 border-2 sm:border-[3px] border-black rounded-lg flex items-center justify-center bg-white overflow-hidden'
              style={{ transform: 'rotate(-2deg)' }}
            >
              <Image
                src='/logo.png'
                alt='ghstories'
                width={40}
                height={40}
                className='w-5 h-5 sm:w-6 sm:h-6 object-contain'
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
            <motion.a
              href={GITHUB_REPO_URL}
              target='_blank'
              rel='noopener noreferrer'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/5 border border-black/15 text-black/80 hover:bg-amber-50 hover:border-amber-300/60 hover:text-amber-800 transition-colors text-sm font-medium'
            >
              <Star className='w-3.5 h-3.5 fill-amber-500 text-amber-500' />
              <span>Star</span>
              {stars !== null && (
                <span className='tabular-nums text-black/70'>{stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars}</span>
              )}
            </motion.a>
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
