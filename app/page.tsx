'use client';

import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { ArrowRight, Github, GitBranch, Zap, Eye, UserPlus } from 'lucide-react';
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

const FEATURE_ITEMS = [
  { label: '24h expiry', key: 'expiry' },
  { label: 'Real-time', key: 'realtime' },
  { label: 'Free forever', key: 'free' },
];

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
      <section className='relative lg:min-h-screen flex items-center px-4 sm:px-6 md:px-12 py-14 sm:py-20 md:py-24'>
        <div className='max-w-5xl mx-auto w-full space-y-8 md:space-y-10'>
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
            <div className='flex flex-wrap gap-2'>
              {FEATURE_ITEMS.map((item) => (
                <span
                  key={item.key}
                  className='inline-block px-3 py-1.5 rounded-lg border-2 border-black/20 bg-white/80 text-sm text-black/80 font-(--font-sketch)'
                >
                  {item.label}
                </span>
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

      <section className='relative px-4 sm:px-6 md:px-12 py-16 md:py-24 bg-[#faf8f5]'>
        <div className='max-w-5xl mx-auto'>
          <p className='text-sm text-black/50 uppercase tracking-wider font-(--font-sketch) mb-3'>
            How it works
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-2xl sm:text-3xl md:text-4xl font-(--font-sketch) mb-10 md:mb-12 text-black'
          >
            Three steps to stories
          </motion.h2>
          <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6'>
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className='relative p-5 md:p-6 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0_0_rgba(0,0,0,1)]'
                style={{ transform: `rotate(${i === 0 ? -0.5 : i === 1 ? 0 : 0.5}deg)` }}
              >
                <div className='w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center mb-4 bg-[#faf8f5]'>
                  <item.icon className='w-5 h-5' />
                </div>
                <span className='text-xs text-black/50 font-(--font-sketch)'>
                  Step {item.step}
                </span>
                <h3 className='text-lg font-(--font-sketch) mt-0.5 mb-2 text-black'>
                  {item.title}
                </h3>
                <p className='text-black/65 text-sm font-(--font-sketch) leading-relaxed'>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative px-4 sm:px-6 md:px-12 py-16 md:py-24 bg-[#f5f3ef]'>
        <div className='max-w-5xl mx-auto'>
          <p className='text-sm text-black/50 uppercase tracking-wider font-(--font-sketch) mb-3'>
            Why ghstories
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-2xl sm:text-3xl md:text-4xl font-(--font-sketch) mb-8 md:mb-10 text-black'
          >
            Connect repos · Sync follows
          </motion.h2>
          <div className='grid md:grid-cols-2 gap-5 md:gap-6'>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='p-5 md:p-6 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0_0_rgba(0,0,0,1)]'
              style={{ transform: 'rotate(-0.5deg)' }}
            >
              <div className='w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center mb-4 bg-[#faf8f5]'>
                <Github className='w-5 h-5' />
              </div>
              <h3 className='text-lg font-(--font-sketch) mb-2 text-black'>
                Connect a repository
              </h3>
              <p className='text-black/65 text-sm font-(--font-sketch) leading-relaxed mb-5'>
                In your profile, connect any GitHub repo. We add the webhook for you—no copy-pasting or digging through repo settings.
              </p>
              {!isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => signIn()}
                  className='inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-black text-white rounded-lg font-(--font-sketch) text-sm hover:bg-white hover:text-black transition-colors'
                >
                  Sign in with GitHub
                  <ArrowRight className='w-4 h-4' />
                </motion.button>
              )}
              {isAuthenticated && (() => {
                const username = (user as { username?: string })?.username;
                return (
                  <Link
                    href={username ? `/profile/${username}` : '/feed'}
                    className='inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white text-black rounded-lg font-(--font-sketch) text-sm hover:bg-black hover:text-white transition-colors'
                  >
                    {username ? 'Go to profile' : 'Go to feed'}
                    <ArrowRight className='w-4 h-4' />
                  </Link>
                );
              })()}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='p-5 md:p-6 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0_0_rgba(0,0,0,1)]'
              style={{ transform: 'rotate(0.5deg)' }}
            >
              <div className='w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center mb-4 bg-[#faf8f5]'>
                <UserPlus className='w-5 h-5' />
              </div>
              <h3 className='text-lg font-(--font-sketch) mb-2 text-black'>
                Follow on GitHub → follow on ghstories
              </h3>
              <p className='text-black/65 text-sm font-(--font-sketch) leading-relaxed'>
                We sync your GitHub following list. Anyone you follow there is automatically followed here, so your feed fills with their commit stories.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className='border-t-2 border-black/20 px-4 sm:px-6 md:px-12 py-6 md:py-8 bg-[#faf8f5]'>
        <div className='max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-black/60 font-(--font-sketch)'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 border-2 border-black rounded-lg flex items-center justify-center bg-white'>
              <Github className='w-4 h-4' />
            </div>
            <span className='text-base font-(--font-sketch)'>ghstories</span>
          </div>
          <div className='flex gap-4 text-xs'>
            <span>Open Source</span>
            <span>·</span>
            <span>Free forever</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
