'use client';

import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Github,
  GitBranch,
  Zap,
  Eye,
  UserPlus,
} from 'lucide-react';
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

const MOCK_FEED_CARDS = [
  {
    username: 'sarahdev',
    storyCount: 2,
    message: 'feat: add story highlights to profile',
    date: 'Today',
    repo: 'ghstories',
    rotation: -0.5,
  },
  {
    username: 'alexcode',
    storyCount: 1,
    message: 'fix: resolve auth redirect loop',
    date: 'Today',
    repo: 'my-app',
    rotation: 0.5,
  },
  {
    username: 'jordanbuilds',
    storyCount: 3,
    message: 'chore: bump dependencies',
    date: 'Yesterday',
    repo: 'side-project',
    rotation: -0.5,
  },
];

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
      {/* Hero background: dot pattern + soft blobs */}
      <div className='absolute inset-0 pointer-events-none'>
        <div
          className='absolute inset-0 opacity-[0.4]'
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className='absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-amber-200/30 blur-3xl' />
        <div className='absolute bottom-1/4 -left-16 w-64 h-64 rounded-full bg-stone-300/25 blur-3xl' />
      </div>

      <section className='relative lg:min-h-screen flex items-center px-4 sm:px-6 md:px-12 py-14 sm:py-20 md:py-24'>
        <div className='max-w-6xl mx-auto w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16'>
          <div className='space-y-8 md:space-y-10 flex-1'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='space-y-8'
            >
              <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black/25 bg-white/90 text-sm text-black/80 uppercase tracking-wider font-(--font-sketch) shadow-sm'>
                <Github className='w-4 h-4' />
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

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className='w-full md:w-full lg:w-auto lg:shrink-0 flex justify-center lg:justify-end'
          >
            <div
              className='w-full max-w-full md:max-w-full lg:max-w-[520px] rounded-2xl border-[3px] border-black bg-[#faf8f5] shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden'
              style={{ transform: 'rotate(1deg)' }}
            >
              <div className='px-4 pt-4 pb-2 border-b border-black/10 bg-white/50'>
                <p className='text-xs text-black/50 font-(--font-sketch) mb-0.5'>
                  ghstories
                </p>
                <h2 className='text-xl sm:text-2xl text-black font-(--font-sketch)'>
                  Stories
                </h2>
                <p className='text-xs text-black/60 font-(--font-sketch)'>
                  See what developers are building
                </p>
              </div>
              <div className='p-4 space-y-3 max-h-[360px] md:max-h-[400px] lg:max-h-[440px] overflow-hidden'>
                {MOCK_FEED_CARDS.map((card, i) => (
                  <motion.div
                    key={card.username}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + i * 0.1 }}
                    className='group relative p-4 sm:p-5 bg-white border-[3px] border-black rounded-2xl'
                    style={{ transform: `rotate(${card.rotation}deg)` }}
                  >
                    <HandDrawnCardBorder />
                    <div className='relative z-10 flex items-start gap-3'>
                      <div className='relative shrink-0'>
                        <div className='w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-black bg-linear-to-br from-stone-300 to-stone-400 flex items-center justify-center text-black/60 text-sm font-(--font-sketch)'>
                          {card.username.slice(0, 2)}
                        </div>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <h3 className='text-black text-sm sm:text-base font-(--font-sketch) truncate'>
                            {card.username}
                          </h3>
                          <span className='text-black/50'>·</span>
                          <span className='text-xs text-black/60 font-(--font-sketch)'>
                            {card.storyCount}{' '}
                            {card.storyCount === 1 ? 'story' : 'stories'}
                          </span>
                        </div>
                        <p className='text-sm text-black/80 truncate mb-2 font-(--font-sketch)'>
                          {card.message}
                        </p>
                        <div className='flex items-center gap-3 text-xs text-black/60 font-(--font-sketch)'>
                          <span>{card.date}</span>
                          <span>·</span>
                          <span className='font-mono truncate'>
                            {card.repo}
                          </span>
                        </div>
                      </div>
                      <div className='shrink-0 opacity-60'>
                        <div className='w-10 h-10 border-2 border-black rounded-lg bg-white flex items-center justify-center'>
                          <span className='text-black font-bold'>→</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
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
                style={{
                  transform: `rotate(${i === 0 ? -0.5 : i === 1 ? 0 : 0.5}deg)`,
                }}
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
                In your profile, connect any GitHub repo. We add the webhook for
                you—no copy-pasting or digging through repo settings.
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
              {isAuthenticated &&
                (() => {
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
                We sync your GitHub following list. Anyone you follow there is
                automatically followed here, so your feed fills with their
                commit stories.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className='border-t-2 border-black/20 px-4 sm:px-6 md:px-12 py-6 md:py-8 bg-[#faf8f5] mt-10'>
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
