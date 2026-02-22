import type { Metadata } from 'next';
import { Geist, Geist_Mono, Cabin_Sketch } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from './ConvexClientProvider';
import { Providers } from '@/lib/providers';
import { Sidebar } from '@/components/sidebar';
import { Navbar } from '@/components/navbar';
import { SketchyGrid } from '@/components/sketchy-grid';
import { getToken } from '@/lib/auth-server';

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
  title: 'ghstories - Turn commits into stories',
  description: 'Transform your GitHub commits into ephemeral stories',
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
          </Providers>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
