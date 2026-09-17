import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import SignupContent from './SignupContent';

export const dynamic = 'force-dynamic';

export default async function SignupPage() {
  const user = await getSessionUser();
  if (user) {
    redirect('/dashboard');
  }

  return <SignupContent />;
}
