'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Github, Home, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

function HandDrawnBorder({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      viewBox='0 0 300 400'
      preserveAspectRatio='none'
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        d='M5,5 Q3,3 5,8 T10,15 Q8,18 12,22 T18,30 Q16,33 20,37 T26,45 Q24,48 28,52 T34,60 Q32,63 36,67 T42,75 Q40,78 44,82 T50,90 Q48,93 52,97 T58,105 Q56,108 60,112 T66,120 Q64,123 68,127 T74,135 Q72,138 76,142 T82,150 Q80,153 84,157 T90,165 Q88,168 92,172 T98,180 Q96,183 100,187 T106,195 Q104,198 108,202 T114,210 Q112,213 116,217 T122,225 Q120,228 124,232 T130,240 Q128,243 132,247 T138,255 Q136,258 140,262 T146,270 Q144,273 148,277 T154,285 Q152,288 156,292 T162,300 Q160,303 164,307 T170,315 Q168,318 172,322 T178,330 Q176,333 180,337 T186,345 Q184,348 188,352 T194,360 Q192,363 196,367 T202,375 Q200,378 204,382 T210,390 Q208,393 212,395 L290,395 Q295,393 295,388 L295,12 Q293,7 288,7 L12,7 Q7,5 5,5 Z'
        fill='none'
        stroke='black'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

type SidebarVariant = 'left' | 'bottom';

export function Sidebar({ variant = 'left' }: { variant?: SidebarVariant }) {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated || pathname === '/') return null;

  const navItems = [{ href: '/feed', icon: Home, label: 'Feed' }];

  if (variant === 'bottom') {
    const profileHref = user
      ? `/profile/${(user as { username?: string }).username ?? user.id}`
      : '/feed';
    const isProfileActive =
      user &&
      pathname ===
        `/profile/${(user as { username?: string }).username ?? user.id}`;

    return (
      <nav className='lg:hidden fixed bottom-0 left-0 right-0 z-50 pt-3 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-[#faf8f5]/95 backdrop-blur-md'>
        <div
          className='max-w-lg mx-auto flex justify-between items-stretch gap-1 p-2 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)]'
          style={{ transform: 'rotate(-0.5deg)' }}
        >
          <Link
            href='/feed'
            className='flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl transition-colors active:scale-[0.98]'
            style={{ fontFamily: 'var(--font-sketch)' }}
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={`w-full flex flex-col items-center justify-center gap-1 py-2 rounded-lg border-2 border-black transition-colors ${
                pathname === '/feed'
                  ? 'bg-black text-white'
                  : 'bg-[#faf8f5] text-black'
              }`}
              style={{
                borderRadius: '10px 14px 10px 14px',
                transform: pathname === '/feed' ? 'rotate(-0.5deg)' : 'rotate(0.5deg)',
              }}
            >
              <Home className='w-5 h-5 shrink-0' />
              <span className='text-xs font-(--font-sketch)'>Feed</span>
            </motion.div>
          </Link>

          <Link
            href={profileHref}
            className='flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl transition-colors active:scale-[0.98]'
            style={{ fontFamily: 'var(--font-sketch)' }}
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={`w-full flex flex-col items-center justify-center gap-1 py-2 rounded-lg border-2 border-black transition-colors ${
                isProfileActive ? 'bg-black text-white' : 'bg-[#faf8f5] text-black'
              }`}
              style={{
                borderRadius: '10px 14px 10px 14px',
                transform: isProfileActive ? 'rotate(-0.5deg)' : 'rotate(0.5deg)',
              }}
            >
              <div className='w-6 h-6 rounded-full overflow-hidden border-2 border-current shrink-0'>
                <Image
                  src={
                    ((user as { avatarUrl?: string }).avatarUrl ??
                      (user as { image?: string }).image) ??
                    ''
                  }
                  alt=''
                  width={24}
                  height={24}
                  className='w-full h-full object-cover'
                />
              </div>
              <span className='text-xs font-(--font-sketch)'>Profile</span>
            </motion.div>
          </Link>

          <button
            type='button'
            onClick={() => signOut()}
            className='flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl transition-colors active:scale-[0.98]'
            style={{ fontFamily: 'var(--font-sketch)' }}
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className='w-full flex flex-col items-center justify-center gap-1 py-2 rounded-lg border-2 border-black bg-[#faf8f5] hover:bg-black hover:text-white transition-colors'
              style={{
                borderRadius: '10px 14px 10px 14px',
                transform: 'rotate(-0.5deg)',
              }}
            >
              <LogOut className='w-5 h-5 shrink-0' />
              <span className='text-xs font-(--font-sketch)'>Sign out</span>
            </motion.div>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <aside className='hidden lg:flex flex-col w-64 border-r-[3px] border-black h-screen sticky top-0 bg-[#faf8f5]'>
      <div className='flex flex-col h-full px-4 py-6 relative'>
        <HandDrawnBorder />

        <div className='relative z-10'>
          <Link href='/' className='flex items-center gap-3 mb-8 group'>
            <motion.div
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
              className='relative'
            >
              <div
                className='w-10 h-10 border-[3px] border-black rounded-lg flex items-center justify-center bg-white'
                style={{ transform: 'rotate(-2deg)' }}
              >
                <Github
                  className='w-6 h-6'
                  style={{ transform: 'rotate(2deg)' }}
                />
              </div>
            </motion.div>
            <span
              className='text-xl font-(--font-sketch)'
              style={{ transform: 'rotate(-1deg)' }}
            >
              ghstories
            </span>
          </Link>

          <nav className='flex-1 space-y-2'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className='relative group block'
                >
                  <motion.div
                    whileHover={{ x: 3, rotate: [0, -1, 1, 0] }}
                    className={`relative px-4 py-3 border-2 border-black transition-all text-base ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-black/5'
                    }`}
                    style={{
                      transform: isActive
                        ? 'rotate(-0.5deg)'
                        : 'rotate(0.5deg)',
                      borderRadius: '8px 12px 8px 12px',
                      fontFamily: 'var(--font-sketch)',
                    }}
                  >
                    <div className='flex items-center gap-3'>
                      <item.icon className='w-5 h-5' />
                      <span>{item.label}</span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {user && (
            <div className='mt-auto pt-4 border-2 border-black'>
              <Link
                href={`/profile/${(user as { username?: string }).username ?? user.id}`}
                className='flex items-center gap-3 px-4 py-3 border-2 border-black bg-white hover:bg-black hover:text-white transition-all group mb-2 rounded-lg'
                style={{
                  borderRadius: '10px 8px 10px 8px',
                  transform: 'rotate(0.5deg)',
                }}
              >
                <div className='relative w-10 h-10 rounded-full overflow-hidden border-2 border-black shrink-0'>
                  <Image
                    src={
                      (user as { avatarUrl?: string }).avatarUrl ??
                      user.image ??
                      ''
                    }
                    alt={
                      (user as { username?: string }).username ??
                      user.name ??
                      ''
                    }
                    width={40}
                    height={40}
                    className='object-cover'
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-sm truncate font-(--font-sketch)'>
                    {(user as { displayName?: string }).displayName ??
                      user.name}
                  </div>
                  <div className='text-xs text-black/70 group-hover:text-white/70 truncate font-(--font-sketch)'>
                    @{(user as { username?: string }).username ?? user.id}
                  </div>
                </div>
              </Link>

              <motion.button
                whileHover={{ rotate: [0, -2, 2, 0] }}
                onClick={() => signOut()}
                className='w-full flex items-center gap-3 px-4 py-3 border-2 border-black bg-white hover:bg-black hover:text-white transition-all text-base rounded-lg'
                style={{
                  transform: 'rotate(-0.5deg)',
                  fontFamily: 'var(--font-sketch)',
                }}
              >
                <LogOut className='w-5 h-5' />
                <span>Sign out</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
