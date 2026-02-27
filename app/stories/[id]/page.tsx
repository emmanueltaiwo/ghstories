import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth-server';
import StoryPageClient from './StoryPageClient';

export default async function StoryPage({
  params,
}: {
  params: { id: string };
}) {
  const auth = await isAuthenticated();

  if (!auth) {
    redirect('/');
  }

  return <StoryPageClient params={Promise.resolve(params)} />;
}
