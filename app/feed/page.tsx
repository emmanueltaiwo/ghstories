import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth-server';
import FeedPageClient from './FeedPageClient';

export default async function FeedPage() {
  const auth = await isAuthenticated();

  if (!auth) {
    redirect('/');
  }

  return <FeedPageClient />;
}
