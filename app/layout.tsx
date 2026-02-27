import type { Metadata } from 'next';
import { Geist, Geist_Mono, Cabin_Sketch } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from './ConvexClientProvider';
import { Providers } from '@/lib/providers';
import { StoryViewerOpenProvider } from '@/lib/story-viewer-context';
import { Sidebar } from '@/components/sidebar';
import { Navbar } from '@/components/navbar';
import { SketchyGrid } from '@/components/sketchy-grid';
import { getToken } from '@/lib/auth-server';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const cabinSketch = Cabin_Sketch({
  variable: '--font-sketch',
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'ghstories - Turn your commits into stories',
  description:
    'Every push becomes an ephemeral story. Share your coding journey with the dev community—no extra tools, just your normal workflow.',
  keywords: [
    'ghstories',
    'GitHub stories',
    'GitHub commits',
    'Commit stories',
    'Developer stories',
    'Developer social feed',
    'GitHub activity feed',
    'Code storytelling',
    'Open source stories',
    'Dev community',
  ],
  authors: [{ name: 'Emmanuel Taiwo' }],
  creator: 'Emmanuel Taiwo',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ghstories.xyz',
    title: 'ghstories - Turn your commits into stories',
    description:
      'Every push becomes an ephemeral story. Share your coding journey with the dev community—no extra tools, just your normal workflow.',
    siteName: 'ghstories',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'ghstories - Turn your commits into stories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ghstories - Turn your commits into stories',
    description:
      'Turn your GitHub commits into ephemeral stories and share your coding journey with the dev community.',
    creator: '@ez0xai',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://ghstories.xyz'),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();

  return (
    <html lang='en' className='bg-[#faf8f5]'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cabinSketch.variable} antialiased bg-[#faf8f5]`}
      >
        <SketchyGrid />

        <ConvexClientProvider initialToken={token}>
          <Providers>
            <StoryViewerOpenProvider>
              <div className='flex min-h-screen relative z-10 w-full'>
                <div className='flex w-full max-w-7xl mx-auto'>
                  <Sidebar />
                  <div className='flex-1 flex flex-col min-w-0'>
                    <Navbar />
                    <main className='flex-1 pb-20 lg:pb-0'>{children}</main>
                  </div>
                </div>
                <Sidebar variant='bottom' />
              </div>
            </StoryViewerOpenProvider>
          </Providers>
        </ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
