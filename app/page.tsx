'use client';

import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

function HandDrawnUnderline({ delay = 0 }: { delay?: number }) {
  return (
    <motion.svg
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay, duration: 1.2, ease: 'easeInOut' }}
      className='absolute -bottom-3 left-0 w-full h-6'
      viewBox='0 0 300 30'
      preserveAspectRatio='none'
    >
      <path
        d='M5,20 Q15,15 25,18 T45,22 Q55,18 65,20 T85,19 Q95,22 105,18 T125,21 Q135,17 145,20 T165,19 Q175,22 185,18 T205,21 Q215,17 225,20 T245,19 Q255,22 265,18 T285,20 Q290,18 295,19'
        fill='none'
        stroke='black'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </motion.svg>
  );
}

const FEATURE_ITEMS = ['24 hour expiry', 'Real-time updates', 'Free forever'];

export default function HomePage() {
  const { signIn, isAuthenticated } = useAuth();

  return (
    <div className='min-h-screen bg-[#faf8f5] text-black relative overflow-hidden'>
      <section className='relative min-h-screen flex items-center px-6 md:px-12 py-20'>
        <div className='max-w-7xl mx-auto w-full space-y-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-8'
          >
            <div className='text-sm text-black/70 uppercase tracking-wider font-(--font-sketch)'>
              GitHub commits → Stories
            </div>
            <h1 className='text-6xl md:text-8xl leading-[0.85] font-(--font-sketch)'>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='block'
                style={{ transform: 'rotate(-0.5deg)' }}
              >
                Turn your
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className='block'
                style={{ transform: 'rotate(0.5deg)' }}
              >
                commits into
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className='relative inline-block'
                style={{ transform: 'rotate(-1deg)' }}
              >
                stories
                <HandDrawnUnderline delay={0.8} />
              </motion.span>
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className='max-w-2xl space-y-6'
          >
            <p className='text-xl md:text-2xl leading-relaxed text-black/90 font-(--font-sketch)'>
              Every GitHub commit becomes an ephemeral story. Share your coding
              journey with the developer community.
            </p>
            <div className='flex flex-wrap gap-6 text-sm text-black/70 font-(--font-sketch)'>
              {FEATURE_ITEMS.map((item) => (
                <span key={item}>• {item}</span>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className='flex flex-col sm:flex-row gap-6'
          >
            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signIn()}
                className='px-10 py-4 border-[3px] border-black bg-black text-white text-lg hover:bg-white hover:text-black transition-all flex items-center gap-3 rounded-xl font-(--font-sketch)'
                style={{ transform: 'rotate(-1deg)' }}
              >
                Get Started
                <ArrowRight className='w-5 h-5' />
              </motion.button>
            )}
            {isAuthenticated && (
              <Link
                href='/feed'
                className='px-10 py-4 border-[3px] border-black bg-white text-black text-lg hover:bg-black hover:text-white transition-all flex items-center gap-2 rounded-xl font-(--font-sketch)'
                style={{ transform: 'rotate(1deg)' }}
              >
                View Feed
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      <footer className='border-t-[3px] border-black px-6 md:px-12 py-8 bg-[#faf8f5]'>
        <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-black/70 font-(--font-sketch)'>
          <div className='flex items-center gap-3'>
            <div
              className='w-8 h-8 border-[3px] border-black rounded-lg flex items-center justify-center bg-white'
              style={{ transform: 'rotate(-2deg)' }}
            >
              <Github
                className='w-4 h-4'
                style={{ transform: 'rotate(2deg)' }}
              />
            </div>
            <span className='text-lg'>ghstories</span>
          </div>
          <div className='flex gap-6 text-xs'>
            <span>Open Source</span>
            <span>•</span>
            <span>Free Forever</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
