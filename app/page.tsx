'use client';

import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { ArrowRight, Github, GitBranch, Zap, Eye } from 'lucide-react';
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

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Connect your repo',
    desc: 'Sign in with GitHub and connect any repository from your profile. We add a webhook so new commits are sent to ghstories automatically.',
    icon: GitBranch,
  },
  {
    step: 2,
    title: 'Push commits',
    desc: 'Code as usual. Every push creates a new story. No extra tools or commands—just your normal workflow.',
    icon: Zap,
  },
  {
    step: 3,
    title: 'Stories in your feed',
    desc: 'Your commits show up as stories. Follow other developers to see their stories. Pin favorites to your profile highlights.',
    icon: Eye,
  },
];

export default function HomePage() {
  const { signIn, isAuthenticated, user } = useAuth();

  return (
    <div className='min-h-screen bg-[#faf8f5] text-black relative overflow-hidden'>
      <section className='relative min-h-screen flex items-center px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20'>
        <div className='max-w-7xl mx-auto w-full space-y-8 md:space-y-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-8'
          >
            <div className='text-sm text-black/70 uppercase tracking-wider font-(--font-sketch)'>
              GitHub commits → Stories
            </div>
            <h1 className='text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] font-(--font-sketch)'>
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
            className='max-w-2xl space-y-4 md:space-y-6'
          >
            <p className='text-lg sm:text-xl md:text-2xl leading-relaxed text-black/90 font-(--font-sketch)'>
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
            className='flex flex-col sm:flex-row gap-4 sm:gap-6'
          >
            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signIn()}
                className='px-6 py-3 sm:px-10 sm:py-4 border-[3px] border-black bg-black text-white text-base sm:text-lg hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 sm:gap-3 rounded-xl font-(--font-sketch)'
                style={{ transform: 'rotate(-1deg)' }}
              >
                Get Started
                <ArrowRight className='w-5 h-5' />
              </motion.button>
            )}
            {isAuthenticated && (
              <Link
                href='/feed'
                className='px-6 py-3 sm:px-10 sm:py-4 border-[3px] border-black bg-white text-black text-base sm:text-lg hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 rounded-xl font-(--font-sketch)'
                style={{ transform: 'rotate(1deg)' }}
              >
                View Feed
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      <section className='relative px-4 sm:px-6 md:px-12 py-12 md:py-20 bg-[#faf8f5]'>
        <div className='max-w-7xl mx-auto'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-3xl sm:text-4xl md:text-5xl font-(--font-sketch) mb-8 md:mb-12'
            style={{ transform: 'rotate(-0.5deg)' }}
          >
            How it works
          </motion.h2>
          <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8'>
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className='relative p-4 sm:p-5 md:p-6 bg-white border-[3px] border-black rounded-2xl'
                style={{ transform: i % 2 === 0 ? 'rotate(-0.5deg)' : 'rotate(0.5deg)' }}
              >
                <div className='w-12 h-12 border-[3px] border-black rounded-xl flex items-center justify-center mb-4 bg-[#faf8f5]'>
                  <item.icon className='w-6 h-6' />
                </div>
                <span className='text-sm text-black/60 font-(--font-sketch)'>
                  Step {item.step}
                </span>
                <h3 className='text-xl font-(--font-sketch) mt-1 mb-3'>
                  {item.title}
                </h3>
                <p className='text-black/70 text-sm font-(--font-sketch) leading-relaxed'>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative px-4 sm:px-6 md:px-12 py-12 md:py-20 bg-[#faf8f5]'>
        <div className='max-w-3xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='p-5 sm:p-6 md:p-10 bg-white border-[3px] border-black rounded-2xl text-center'
            style={{ transform: 'rotate(0.5deg)' }}
          >
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-(--font-sketch) mb-3 md:mb-4'>
              Connect a repository
            </h2>
            <p className='text-black/70 font-(--font-sketch) mb-4 md:mb-6 max-w-xl mx-auto text-sm sm:text-base'>
              After signing in, go to your profile and use the Repositories section to connect any GitHub repo. We set up the webhook for you—no copy-pasting URLs or digging through repo settings.
            </p>
            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn()}
                className='inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 border-[3px] border-black bg-black text-white rounded-xl font-(--font-sketch) hover:bg-white hover:text-black transition-colors text-sm sm:text-base'
              >
                Sign in with GitHub
                <Github className='w-5 h-5' />
              </motion.button>
            )}
            {isAuthenticated && (() => {
              const username = (user as { username?: string })?.username;
              return (
                <Link
                  href={username ? `/profile/${username}` : '/feed'}
                  className='inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 border-[3px] border-black bg-white text-black rounded-xl font-(--font-sketch) hover:bg-black hover:text-white transition-colors text-sm sm:text-base'
                >
                  {username ? 'Connect a repo in your profile' : 'Go to feed'}
                  <ArrowRight className='w-5 h-5' />
                </Link>
              );
            })()}
          </motion.div>
        </div>
      </section>

      <footer className='border-t-[3px] border-black px-4 sm:px-6 md:px-12 py-6 md:py-8 bg-[#faf8f5]'>
        <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-sm text-black/70 font-(--font-sketch)'>
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
