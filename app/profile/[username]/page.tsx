import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth-server';
import ProfilePageClient from './ProfilePageClient';

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const auth = await isAuthenticated();

  if (!auth) {
    redirect('/');
  }

  return <ProfilePageClient params={Promise.resolve(params)} />;
}
